import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import PostCreation from "../../components/PostCreation/PostCreation";
import Post from "../../components/Post/Post";
import { Users, TrendingUp, Sparkles } from "lucide-react";
import RecommendedUser from "../../components/RecommendedUser/RecommendedUser";

const HomePage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: recommendedUsers, isLoading: isLoadingRecommended } = useQuery({
        queryKey: ["recommendedUsers"],
        queryFn: async () => {
            const res = await axiosInstance.get("/users/suggestions");
            return res.data;
        },
    });

    const { data: posts, isLoading: isLoadingPosts } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const res = await axiosInstance.get("/posts");
            return res.data;
        },
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {/* Left Sidebar */}
                <div className='hidden lg:block lg:col-span-1'>
                    <Sidebar user={authUser} />
                </div>

                {/* Main Feed */}
                <div className="col-span-1 lg:col-span-2 order-first lg:order-none space-y-6">
                    {/* Post Creation */}
                    <PostCreation user={authUser} />

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        {isLoadingPosts ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                                                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        </div>
                                        <div className="h-48 bg-gray-300 rounded-xl"></div>
                                    </div>
                                ))}
                            </div>
                        ) : posts?.length > 0 ? (
                            posts.map((post) => (
                                <Post key={post._id} post={post} />
                            ))
                        ) : (
                            <div className='bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100'>
                                <div className='mb-6'>
                                    <div className="relative inline-block">
                                        <Users size={64} className='text-blue-500' />
                                        <Sparkles size={24} className="absolute -top-2 -right-2 text-yellow-400" />
                                    </div>
                                </div>
                                <h2 className='text-2xl font-bold mb-4 text-gray-800'>Welcome to Your Feed!</h2>
                                <p className='text-gray-600 mb-6 max-w-md mx-auto leading-relaxed'>
                                    Connect with professionals and start building your network to see posts in your feed.
                                </p>
                                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                    <h3 className="font-semibold text-blue-900 mb-2">Getting Started Tips:</h3>
                                    <ul className="text-left text-blue-800 space-y-1 text-sm">
                                        <li>• Connect with colleagues and industry professionals</li>
                                        <li>• Share your first post to engage with your network</li>
                                        <li>• Check out suggested connections on the right</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Recommended Users */}
                {recommendedUsers?.length > 0 && (
                    <div className='col-span-1 lg:col-span-1 hidden lg:block'>
                        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6'>
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                                <div className="flex items-center space-x-2">
                                    <TrendingUp className="text-white" size={20} />
                                    <h2 className='font-semibold text-white'>People you may know</h2>
                                </div>
                            </div>
                            <div className="p-4">
                                {isLoadingRecommended ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center space-x-3 animate-pulse">
                                                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recommendedUsers.map((user) => (
                                            <RecommendedUser key={user._id} user={user} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Trending Topics Card */}
                        <div className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-6'>
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                                <div className="flex items-center space-x-2">
                                    <Sparkles className="text-white" size={20} />
                                    <h2 className='font-semibold text-white'>Trending Topics</h2>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-800">#TechInnovation</p>
                                        <p className="text-sm text-gray-500">12.5K posts</p>
                                    </div>
                                    <TrendingUp size={16} className="text-green-500" />
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-800">#RemoteWork</p>
                                        <p className="text-sm text-gray-500">8.3K posts</p>
                                    </div>
                                    <TrendingUp size={16} className="text-green-500" />
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-800">#AIRevolution</p>
                                        <p className="text-sm text-gray-500">15.7K posts</p>
                                    </div>
                                    <TrendingUp size={16} className="text-green-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;