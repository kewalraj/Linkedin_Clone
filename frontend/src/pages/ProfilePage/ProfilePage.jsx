import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import AboutSection from "../../components/AboutSection/AboutSection";
import ExperienceSection from "../../components/ExperienceSection/ExperienceSection";
import EducationSection from "../../components/EducationSection/EducationSection";
import SkillsSection from "../../components/SkillsSection/SkillsSection";
import Post from "../../components/Post/Post";
import PostCreation from "../../components/PostCreation/PostCreation";
import { Users, FileText, User } from "lucide-react";

const ProfilePage = () => {
	const { username } = useParams();
	const queryClient = useQueryClient();

	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
	});

	const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
		queryKey: ["userProfile", username],
		queryFn: () => axiosInstance.get(`/users/${username}`),
	});

	// Fetch user's posts
	const { data: userPosts, isLoading: isUserPostsLoading } = useQuery({
		queryKey: ["userPosts", username],
		queryFn: async () => {
			const res = await axiosInstance.get(`/posts/user/${username}`);
			return res.data;
		},
		enabled: !!username,
	});

	const { mutate: updateProfile } = useMutation({
		mutationFn: async (updatedData) => {
			await axiosInstance.put("/users/profile", updatedData);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", username]);
		},
	});

	if (isLoading || isUserProfileLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
			</div>
		);
	}

	const isOwnProfile = authUser.username === userProfile.data.username;
	const userData = isOwnProfile ? authUser : userProfile.data;

	const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-6xl mx-auto p-4">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column - Profile Info */}
					<div className="lg:col-span-2 space-y-6">
						<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
					</div>

					{/* Right Column - Activity & Stats */}
					<div className="space-y-6">
						{/* Profile Stats Card */}
						<div className="bg-white shadow-md rounded-xl p-6">
							<h3 className="text-lg font-semibold mb-4 text-gray-800">Profile Stats</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="p-2 bg-blue-100 rounded-lg">
											<Users className="w-5 h-5 text-blue-600" />
										</div>
										<span className="text-gray-600">Connections</span>
									</div>
									<span className="font-semibold text-gray-800">{userData.connections?.length || 0}</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="p-2 bg-green-100 rounded-lg">
											<FileText className="w-5 h-5 text-green-600" />
										</div>
										<span className="text-gray-600">Posts</span>
									</div>
									<span className="font-semibold text-gray-800">{userPosts?.length || 0}</span>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="p-2 bg-purple-100 rounded-lg">
											<User className="w-5 h-5 text-purple-600" />
										</div>
										<span className="text-gray-600">Profile Views</span>
									</div>
									<span className="font-semibold text-gray-800">-</span>
								</div>
							</div>
						</div>

						{/* Contact Info Card */}
						<div className="bg-white shadow-md rounded-xl p-6">
							<h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Info</h3>
							<div className="space-y-3">
								<div>
									<p className="text-sm text-gray-500">Email</p>
									<p className="text-gray-800">{userData.email || "Not provided"}</p>
								</div>
								<div>
									<p className="text-sm text-gray-500">Location</p>
									<p className="text-gray-800">{userData.location || "Not specified"}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Posts Section */}
				<div className="mt-8">
					<div className="bg-white shadow-md rounded-xl p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-800">
								{isOwnProfile ? "Your Posts" : `${userData.name}'s Posts`}
							</h2>
							<span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
								{userPosts?.length || 0} posts
							</span>
						</div>

						{/* Post Creation - Only show for own profile */}
						{isOwnProfile && (
							<div className="mb-6">
								<PostCreation user={authUser} />
							</div>
						)}

						{/* Posts List */}
						<div className="space-y-6">
							{isUserPostsLoading ? (
								<div className="flex justify-center py-8">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
								</div>
							) : userPosts && userPosts.length > 0 ? (
								userPosts.map((post) => (
									<Post key={post._id} post={post} />
								))
							) : (
								<div className="text-center py-12">
									<div className="mb-4">
										<FileText size={64} className="mx-auto text-gray-300" />
									</div>
									<h3 className="text-xl font-semibold mb-2 text-gray-600">No Posts Yet</h3>
									<p className="text-gray-500">
										{isOwnProfile 
											? "Share your first post to get started!" 
											: `${userData.name} hasn't posted anything yet.`
										}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;