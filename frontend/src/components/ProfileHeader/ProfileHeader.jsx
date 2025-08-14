import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { Camera, Clock, MapPin, UserCheck, UserPlus, X, Edit3, Check, Mail } from "lucide-react";
import { axiosInstance } from "../../lib/axios";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({});
	const queryClient = useQueryClient();

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery({
		queryKey: ["connectionStatus", userData._id],
		queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
		enabled: !isOwnProfile,
	});

	const isConnected = userData.connections.some((connection) => connection === authUser._id);

	const { mutate: sendConnectionRequest } = useMutation({
		mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
		onSuccess: () => {
			toast.success("Connection request sent");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: acceptRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: rejectRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const { mutate: removeConnection } = useMutation({
		mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
		onSuccess: () => {
			toast.success("Connection removed");
			refetchConnectionStatus();
			queryClient.invalidateQueries(["connectionRequests"]);
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "An error occurred");
		},
	});

	const getConnectionStatus = useMemo(() => {
		if (isConnected) return "connected";
		if (!isConnected) return "not_connected";
		return connectionStatus?.data?.status;
	}, [isConnected, connectionStatus]);

	const renderConnectionButton = () => {
		const baseClass = "text-white py-2.5 px-6 rounded-full transition-all duration-300 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5";
		switch (getConnectionStatus) {
			case "connected":
				return (
					<div className='flex gap-3 justify-center'>
						<div className={`${baseClass} bg-gradient-to-r from-green-500 to-green-600`}>
							<UserCheck size={20} className='mr-2' />
							Connected
						</div>
						<button
							className={`${baseClass} bg-gradient-to-r from-red-500 to-red-600 text-sm`}
							onClick={() => removeConnection(userData._id)}
						>
							<X size={18} className='mr-2' />
							Remove
						</button>
					</div>
				);

			case "pending":
				return (
					<button className={`${baseClass} bg-gradient-to-r from-yellow-500 to-orange-500 cursor-not-allowed`}>
						<Clock size={20} className='mr-2' />
						Pending
					</button>
				);

			case "received":
				return (
					<div className='flex gap-3 justify-center'>
						<button
							onClick={() => acceptRequest(connectionStatus.data.requestId)}
							className={`${baseClass} bg-gradient-to-r from-green-500 to-green-600`}
						>
							<Check size={20} className='mr-2' />
							Accept
						</button>
						<button
							onClick={() => rejectRequest(connectionStatus.data.requestId)}
							className={`${baseClass} bg-gradient-to-r from-red-500 to-red-600`}
						>
							<X size={20} className='mr-2' />
							Reject
						</button>
					</div>
				);
			default:
				return (
					<button
						onClick={() => sendConnectionRequest(userData._id)}
						className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-6 rounded-full transition-all duration-300 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
					>
						<UserPlus size={20} className='mr-2' />
						Connect
					</button>
				);
		}
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = () => {
		onSave(editedData);
		setIsEditing(false);
	};

	return (
		<div className='bg-white shadow-lg rounded-2xl mb-6 overflow-hidden'>
			{/* Banner Section */}
			<div
				className='relative h-56 bg-cover bg-center'
				style={{
					backgroundImage: `url('${editedData.bannerImg || userData.bannerImg || "/banner.png"}')`,
				}}
			>
				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
				
				{isEditing && (
					<label className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg cursor-pointer hover:bg-white transition-all duration-300 group'>
						<Camera size={20} className="text-gray-700 group-hover:text-blue-600" />
						<input
							type='file'
							className='hidden'
							name='bannerImg'
							onChange={handleImageChange}
							accept='image/*'
						/>
					</label>
				)}
			</div>

			<div className='px-8 pb-8'>
				{/* Profile Picture */}
				<div className='relative -mt-20 mb-6 flex justify-center'>
					<div className="relative">
						<img
							className='w-36 h-36 rounded-full border-4 border-white shadow-xl object-cover bg-white'
							src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
							alt={userData.name}
						/>
						{isEditing && (
							<label className='absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 p-2.5 rounded-full shadow-lg cursor-pointer transition-all duration-300 group'>
								<Camera size={18} className="text-white" />
								<input
									type='file'
									className='hidden'
									name='profilePicture'
									onChange={handleImageChange}
									accept='image/*'
								/>
							</label>
						)}
					</div>
				</div>

				{/* Profile Info */}
				<div className='text-center space-y-4'>
					{isEditing ? (
						<div className="space-y-4">
							<input
								type='text'
								value={editedData.name ?? userData.name}
								onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
								className='text-3xl font-bold text-center w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none transition-colors'
								placeholder="Full Name"
							/>
							<input
								type='text'
								value={editedData.headline ?? userData.headline}
								onChange={(e) => setEditedData({ ...editedData, headline: e.target.value })}
								className='text-lg text-gray-600 text-center w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none transition-colors'
								placeholder="Professional Headline"
							/>
							<div className="flex items-center justify-center">
								<MapPin size={18} className='text-gray-500 mr-2' />
								<input
									type='text'
									value={editedData.location ?? userData.location}
									onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
									className='text-gray-600 text-center border-2 border-gray-200 rounded-lg px-3 py-1 focus:border-blue-500 focus:outline-none transition-colors'
									placeholder="Location"
								/>
							</div>
						</div>
					) : (
						<div className="space-y-2">
							<h1 className='text-3xl font-bold text-gray-900'>{userData.name}</h1>
							<p className='text-lg text-gray-600 font-medium'>{userData.headline}</p>
							<div className='flex justify-center items-center text-gray-500'>
								<MapPin size={16} className='mr-1' />
								<span>{userData.location}</span>
							</div>
							{!isOwnProfile && (
								<div className='flex justify-center items-center text-gray-500 mt-2'>
									<Mail size={16} className='mr-1' />
									<span className="text-sm">{userData.email}</span>
								</div>
							)}
						</div>
					)}

					{/* Connection Count */}
					<div className="text-blue-600 font-semibold">
						{userData.connections?.length || 0} connections
					</div>

					{/* Action Buttons */}
					<div className="pt-4">
						{isOwnProfile ? (
							isEditing ? (
								<div className="flex gap-3 justify-center">
									<button
										className='bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2.5 px-8 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center'
										onClick={handleSave}
									>
										<Check size={18} className="mr-2" />
										Save Changes
									</button>
									<button
										onClick={() => setIsEditing(false)}
										className='bg-gray-500 hover:bg-gray-600 text-white py-2.5 px-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5'
									>
										Cancel
									</button>
								</div>
							) : (
								<button
									onClick={() => setIsEditing(true)}
									className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-8 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center mx-auto'
								>
									<Edit3 size={18} className="mr-2" />
									Edit Profile
								</button>
							)
						) : (
							<div className='flex justify-center'>{renderConnectionButton()}</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileHeader;