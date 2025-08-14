import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const getFeedPosts = async (req, res) => {
	try {
		const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
			.populate("author", "name username profilePicture headline")
			.populate("comments.user", "name profilePicture username")
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.error("Error in getFeedPosts controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;
		
		// Find user by username
		const user = await User.findOne({ username }).select("_id");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Get posts by this user
		const posts = await Post.find({ author: user._id })
			.populate("author", "name username profilePicture headline")
			.populate("comments.user", "name profilePicture username")
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.error("Error in getUserPosts controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const createPost = async (req, res) => {
	try {
		const { content, image } = req.body;

		// Validate input
		if (!content && !image) {
			return res.status(400).json({ message: "Post must have content or an image" });
		}

		if (content && content.length > 2000) {
			return res.status(400).json({ message: "Content cannot exceed 2000 characters" });
		}

		let newPost;

		if (image) {
			try {
				// Validate base64 image format
				if (!image.startsWith('data:image/')) {
					return res.status(400).json({ message: "Invalid image format" });
				}

				// Upload to Cloudinary with error handling
				const imgResult = await cloudinary.uploader.upload(image, {
					folder: "linkedin_posts",
					transformation: [
						{ width: 1000, height: 1000, crop: "limit" },
						{ quality: "auto" },
						{ fetch_format: "auto" }
					]
				});

				newPost = new Post({
					author: req.user._id,
					content: content || "",
					image: imgResult.secure_url,
				});
			} catch (cloudinaryError) {
				console.error("Cloudinary upload error:", cloudinaryError);
				return res.status(500).json({ 
					message: "Failed to upload image. Please try with a smaller image." 
				});
			}
		} else {
			newPost = new Post({
				author: req.user._id,
				content: content.trim(),
			});
		}

		await newPost.save();

		// Populate the author info before sending response
		const populatedPost = await Post.findById(newPost._id)
			.populate("author", "name username profilePicture headline")
			.populate("comments.user", "name profilePicture username");

		res.status(201).json(populatedPost);
	} catch (error) {
		console.error("Error in createPost controller:", error);
		
		// Handle specific MongoDB errors
		if (error.name === 'ValidationError') {
			return res.status(400).json({ 
				message: "Validation error: " + Object.values(error.errors).map(e => e.message).join(', ')
			});
		}
		
		// Handle Cloudinary errors
		if (error.http_code) {
			return res.status(400).json({ 
				message: "Image upload failed: " + (error.message || "Please try with a smaller image")
			});
		}

		res.status(500).json({ 
			message: "Failed to create post. Please try again." 
		});
	}
};

export const deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		if (post.author.toString() !== userId.toString()) {
			return res.status(403).json({ message: "You are not authorized to delete this post" });
		}

		// Delete image from Cloudinary if exists
		if (post.image) {
			try {
				const publicId = post.image.split("/").pop().split(".")[0];
				await cloudinary.uploader.destroy(`linkedin_posts/${publicId}`);
			} catch (cloudinaryError) {
				console.error("Error deleting image from Cloudinary:", cloudinaryError);
				// Continue with post deletion even if image deletion fails
			}
		}

		await Post.findByIdAndDelete(postId);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error("Error in delete post controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getPostById = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findById(postId)
			.populate("author", "name username profilePicture headline")
			.populate("comments.user", "name profilePicture username headline");

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in getPostById controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const createComment = async (req, res) => {
	try {
		const postId = req.params.id;
		const { content } = req.body;

		if (!content || !content.trim()) {
			return res.status(400).json({ message: "Comment content is required" });
		}

		if (content.length > 500) {
			return res.status(400).json({ message: "Comment cannot exceed 500 characters" });
		}

		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$push: { comments: { user: req.user._id, content: content.trim() } },
			},
			{ new: true }
		).populate("author", "name email username headline profilePicture");

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// Create notification if comment is not by post author
		if (post.author._id.toString() !== req.user._id.toString()) {
			const newNotification = new Notification({
				recipient: post.author,
				type: "comment",
				relatedUser: req.user._id,
				relatedPost: postId,
			});

			await newNotification.save();

			// Send email notification
			try {
				const postUrl = process.env.CLIENT_URL + "/post/" + postId;
				await sendCommentNotificationEmail(
					post.author.email,
					post.author.name,
					req.user.name,
					postUrl,
					content.trim()
				);
			} catch (emailError) {
				console.error("Error sending comment notification email:", emailError);
			}
		}

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in createComment controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const likePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findById(postId);
		const userId = req.user._id;

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		if (post.likes.includes(userId)) {
			// Unlike the post
			post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
		} else {
			// Like the post
			post.likes.push(userId);
			
			// Create notification if the post owner is not the user who liked
			if (post.author.toString() !== userId.toString()) {
				const newNotification = new Notification({
					recipient: post.author,
					type: "like",
					relatedUser: userId,
					relatedPost: postId,
				});

				await newNotification.save();
			}
		}

		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in likePost controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};