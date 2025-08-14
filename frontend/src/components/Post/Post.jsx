import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2, MoreHorizontal, Heart } from "lucide-react";
import PostAction from "../PostAction/PostAction";

const Post = ({ post }) => {
    const { postId } = useParams();
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const [showComments, setShowComments] = useState(false);
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState(post.comments || []);
	const [showMenu, setShowMenu] = useState(false);

    const isOwner = authUser._id === post.author._id;
	const isLiked = post.likes.includes(authUser._id);

    const queryClient = useQueryClient();

    const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.delete(`/posts/delete/${post._id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["userPosts"] });
			toast.success("Post deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

    const { mutate: createComment, isPending: isAddingComment } = useMutation({
		mutationFn: async (newComment) => {
			await axiosInstance.post(`/posts/${post._id}/comment`, { content: newComment });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["userPosts"] });
			toast.success("Comment added successfully");
		},
		onError: (err) => {
			toast.error(err.response.data.message || "Failed to add comment");
		},
	});

	const { mutate: likePost, isPending: isLikingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.post(`/posts/${post._id}/like`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["userPosts"] });
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
		},
	});

    const handleDeletePost = () => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		deletePost();
		setShowMenu(false);
	};

    const handleLikePost = async () => {
		if (isLikingPost) return;
		likePost();
	};

    const handleAddComment = async (e) => {
		e.preventDefault();
		if (newComment.trim()) {
			createComment(newComment);
			setNewComment("");
			setComments([
				...comments,
				{
					content: newComment,
					user: {
						_id: authUser._id,
						name: authUser.name,
						profilePicture: authUser.profilePicture,
					},
					createdAt: new Date(),
				},
			]);
		}
	};

    return (
        <div className="bg-white shadow-lg rounded-2xl mb-6 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Header */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <Link to={`/profile/${post?.author?.username}`} className="flex-shrink-0">
							<img
								src={post.author.profilePicture || "/avatar.png"}
								alt={post.author.name}
								className='w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 hover:ring-blue-300 transition-all'
							/>
						</Link>

						<div className="flex-1">
							<Link to={`/profile/${post?.author?.username}`} className="hover:text-blue-600 transition-colors">
								<h3 className='font-bold text-gray-900 text-lg'>{post.author.name}</h3>
							</Link>
							<p className='text-sm text-gray-600 font-medium'>{post.author.headline}</p>
							<p className='text-xs text-gray-500 flex items-center mt-1'>
								<span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
								{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
							</p>
						</div>
                    </div>
                    
                    {/* Options Menu */}
                    {isOwner && (
						<div className="relative">
							<button 
								onClick={() => setShowMenu(!showMenu)}
								className='text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors'
							>
								<MoreHorizontal size={20} />
							</button>
							{showMenu && (
								<div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
									<button 
										onClick={handleDeletePost} 
										className='w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center space-x-2 rounded-lg transition-colors'
									>
										{isDeletingPost ? (
											<Loader size={16} className='animate-spin' />
										) : (
											<Trash2 size={16} />
										)}
										<span>Delete Post</span>
									</button>
								</div>
							)}
						</div>
					)}
                </div>

                {/* Post Content */}
                <div className="mb-4">
                    <p className='text-gray-800 leading-relaxed text-lg whitespace-pre-wrap'>{post.content}</p>
                </div>

                {/* Post Image */}
				{post.image && (
					<div className="mb-4 rounded-xl overflow-hidden">
						<img 
							src={post.image} 
							alt='Post content' 
							className='w-full max-h-96 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer' 
						/>
					</div>
				)}

                {/* Engagement Stats */}
                {(post.likes.length > 0 || comments.length > 0) && (
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                            {post.likes.length > 0 && (
                                <span className="text-sm text-gray-600 flex items-center">
                                    <div className="flex -space-x-1 mr-2">
                                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                            <ThumbsUp size={12} className="text-white" />
                                        </div>
                                    </div>
                                    {post.likes.length}
                                </span>
                            )}
                        </div>
                        {comments.length > 0 && (
                            <span className="text-sm text-gray-600">
                                {comments.length} comment{comments.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <button
                        onClick={handleLikePost}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg hover:bg-gray-50 transition-colors ${isLiked ? 'text-blue-600' : 'text-gray-600'}`}
                    >
                        <ThumbsUp size={20} className={`transition-colors ${isLiked ? "text-blue-600 fill-blue-300" : ""}`} />
                        <span className="font-medium hidden sm:inline">{post.likes.length} Like{post.likes.length !== 1 ? 's' : ''}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        <MessageCircle size={20} />
                        <span className="font-medium hidden sm:inline">{comments.length} Comment{comments.length !== 1 ? 's' : ''}</span>
                    </button>

					<button 
						className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
					>
                        <Share2 size={20} />
                        <span className="font-medium hidden sm:inline">Share</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
				<div className='bg-gray-50 px-6 pb-6'>
					<div className='py-4'>
						<h4 className="font-semibold text-gray-800 mb-4">Comments</h4>
						
						{/* Comment Form */}
						<form onSubmit={handleAddComment} className='mb-4'>
							<div className="flex space-x-3">
								<img
									src={authUser.profilePicture || "/avatar.png"}
									alt={authUser.name}
									className='w-10 h-10 rounded-full object-cover flex-shrink-0'
								/>
								<div className="flex-1 flex space-x-2">
									<input
										type='text'
										value={newComment}
										onChange={(e) => setNewComment(e.target.value)}
										placeholder='Write a comment...'
										className='flex-grow p-3 rounded-full bg-white border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors'
									/>
									<button
										type='submit'
										className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center'
										disabled={isAddingComment || !newComment.trim()}
									>
										{isAddingComment ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
									</button>
								</div>
							</div>
						</form>

						{/* Comments List */}
						<div className='space-y-4 max-h-80 overflow-y-auto'>
							{comments.map((comment) => (
								<div key={comment._id} className='flex space-x-3 bg-white p-4 rounded-xl shadow-sm'>
									<Link to={`/profile/${comment.user.username}`} className="flex-shrink-0">
										<img
											src={comment.user.profilePicture || "/avatar.png"}
											alt={comment.user.name}
											className='w-8 h-8 rounded-full object-cover'
										/>
									</Link>
									<div className='flex-grow'>
										<div className='bg-gray-100 rounded-xl px-4 py-2'>
											<Link to={`/profile/${comment.user.username}`} className="hover:text-blue-600 transition-colors">
												<span className='font-semibold text-gray-900'>{comment.user.name}</span>
											</Link>
											<p className="text-gray-800 mt-1">{comment.content}</p>
										</div>
										<div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
											<span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
											<button className="hover:text-blue-600 transition-colors">Like</button>
											<button className="hover:text-blue-600 transition-colors">Reply</button>
										</div>
									</div>
								</div>
							))}
							
							{comments.length === 0 && (
								<div className="text-center py-8">
									<MessageCircle size={48} className="mx-auto text-gray-300 mb-2" />
									<p className="text-gray-500">No comments yet. Be the first to comment!</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
        </div>
    )
}

export default Post