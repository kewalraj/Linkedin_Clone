import { useState } from "react";
import { Edit3, Save, User, X } from "lucide-react";

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [about, setAbout] = useState(userData.about || "");

	const handleSave = () => {
		setIsEditing(false);
		onSave({ about });
	};

	const handleCancel = () => {
		setIsEditing(false);
		setAbout(userData.about || "");
	};

	return (
		<div className='bg-white shadow-lg rounded-2xl p-8 mb-6'>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-3">
					<div className="p-2 bg-blue-100 rounded-lg">
						<User className="w-6 h-6 text-blue-600" />
					</div>
					<h2 className='text-2xl font-bold text-gray-800'>About</h2>
				</div>
				
				{isOwnProfile && !isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className='flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-blue-50'
					>
						<Edit3 size={18} />
						<span className="font-medium">Edit</span>
					</button>
				)}
			</div>

			{isOwnProfile && isEditing ? (
				<div className="space-y-4">
					<textarea
						value={about}
						onChange={(e) => setAbout(e.target.value)}
						className='w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none'
						rows='6'
						placeholder="Tell people about yourself... What makes you unique? What are you passionate about?"
					/>
					<div className="flex space-x-3">
						<button
							onClick={handleSave}
							className='bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2.5 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center'
						>
							<Save size={18} className="mr-2" />
							Save
						</button>
						<button
							onClick={handleCancel}
							className='bg-gray-500 hover:bg-gray-600 text-white py-2.5 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center'
						>
							<X size={18} className="mr-2" />
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div className="prose max-w-none">
					{userData.about ? (
						<p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
							{userData.about}
						</p>
					) : (
						<div className="text-center py-8">
							<User size={48} className="mx-auto text-gray-300 mb-4" />
							<p className="text-gray-500 italic">
								{isOwnProfile 
									? "Add a description about yourself to help others get to know you better."
									: `${userData.name} hasn't added an about section yet.`
								}
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default AboutSection;