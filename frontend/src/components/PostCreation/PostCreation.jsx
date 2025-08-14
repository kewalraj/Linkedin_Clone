import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader, X, Camera } from "lucide-react";

const PostCreation = ({ user }) => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const queryClient = useQueryClient();

    const { mutate: createPostMutation, isPending } = useMutation({
        mutationFn: async (postData) => {
            const res = await axiosInstance.post("/posts/create", postData, {
                headers: { "Content-Type": "application/json" },
            });
            return res.data;
        },
        onSuccess: () => {
            resetForm();
            toast.success("Post created successfully! 🎉");
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (err) => {
            console.error("Post creation error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to create post";
            toast.error(errorMessage);
        },
    });

    const handlePostCreation = async () => {
        try {
            if (!content.trim() && !image) {
                toast.error("Please add some content or an image to your post");
                return;
            }

            setIsUploading(true);
            const postData = { content: content.trim() };
            
            if (image) {
                // Validate image size (5MB limit)
                if (image.size > 5 * 1024 * 1024) {
                    toast.error("Image size must be less than 5MB");
                    setIsUploading(false);
                    return;
                }
                
                // Validate image type
                if (!image.type.startsWith('image/')) {
                    toast.error("Please select a valid image file");
                    setIsUploading(false);
                    return;
                }
                
                postData.image = await readFileAsDataURL(image);
            }

            createPostMutation(postData);
        } catch (error) {
            console.error("Error in handlePostCreation:", error);
            toast.error("Failed to process your post. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setContent("");
        setImage(null);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file");
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setImage(file);
        readFileAsDataURL(file).then(setImagePreview);
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const isLoading = isPending || isUploading;

    return (
        <div className='bg-white rounded-2xl shadow-lg mb-6 p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300'>
            <div className='flex space-x-4'>
                <img 
                    src={user.profilePicture || "/avatar.png"} 
                    alt={user.name} 
                    className='w-14 h-14 rounded-full object-cover ring-2 ring-blue-100 flex-shrink-0' 
                />
                <div className="flex-1">
                    <textarea
                        placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
                        className='w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent hover:border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none resize-none transition-all duration-200 min-h-[120px] text-lg placeholder-gray-500'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={2000}
                    />
                    
                    <div className="mt-2 text-right text-sm text-gray-500">
                        {content.length}/2000
                    </div>

                    {imagePreview && (
                        <div className='mt-4 relative'>
                            <div className="relative rounded-xl overflow-hidden group">
                                <img 
                                    src={imagePreview} 
                                    alt='Selected' 
                                    className='w-full max-h-80 object-cover rounded-xl shadow-md' 
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                    <button
                                        onClick={removeImage}
                                        className='absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transform transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100'
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='flex justify-between items-center mt-6'>
                        <div className='flex space-x-6'>
                            <label className='flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 cursor-pointer group'>
                                <div className="p-2 rounded-lg group-hover:bg-blue-50 transition-colors duration-200">
                                    {imagePreview ? <Camera size={22} /> : <Image size={22} />}
                                </div>
                                <span className="ml-2 font-medium">{imagePreview ? "Change Photo" : "Photo"}</span>
                                <input 
                                    type='file' 
                                    accept='image/*' 
                                    className='hidden' 
                                    onChange={handleImageChange} 
                                    disabled={isLoading}
                                />
                            </label>
                        </div>

                        <button
                            className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-2 min-w-[120px] justify-center'
                            onClick={handlePostCreation}
                            disabled={isLoading || (!content.trim() && !image)}
                        >
                            {isLoading ? (
                                <>
                                    <Loader className='w-5 h-5 animate-spin' />
                                    <span>{isUploading ? "Uploading..." : "Posting..."}</span>
                                </>
                            ) : (
                                <span>Share Post</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCreation;