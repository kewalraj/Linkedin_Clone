import { X, Plus, Edit3, Save, Star, Award } from "lucide-react";
import { useState } from "react";

const SkillsSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [skills, setSkills] = useState(userData.skills || []);
	const [newSkill, setNewSkill] = useState("");

	const handleAddSkill = () => {
		if (newSkill.trim() && !skills.some(skill => skill.toLowerCase() === newSkill.toLowerCase())) {
			setSkills([...skills, newSkill.trim()]);
			setNewSkill("");
		}
	};

	const handleDeleteSkill = (skillToDelete) => {
		setSkills(skills.filter((skill) => skill !== skillToDelete));
	};

	const handleSave = () => {
		onSave({ skills });
		setIsEditing(false);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setSkills(userData.skills || []);
		setNewSkill("");
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddSkill();
		}
	};

	return (
		<div className='bg-white shadow-lg rounded-2xl p-8 mb-6'>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-3">
					<div className="p-2 bg-purple-100 rounded-lg">
						<Star className="w-6 h-6 text-purple-600" />
					</div>
					<h2 className='text-2xl font-bold text-gray-800'>Skills & Expertise</h2>
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

			{/* Skills Display */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6'>
				{skills.map((skill, index) => (
					<div
						key={index}
						className={`group relative bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100 text-gray-800 px-4 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between ${
							isEditing ? 'hover:border-red-200' : 'hover:border-blue-200'
						}`}
					>
						<div className="flex items-center space-x-2">
							<Award size={16} className="text-blue-600" />
							<span className="truncate">{skill}</span>
						</div>
						{isEditing && (
							<button 
								onClick={() => handleDeleteSkill(skill)} 
								className='opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded-full transition-all duration-300'
							>
								<X size={16} />
							</button>
						)}
					</div>
				))}
			</div>

			{/* Add New Skill */}
			{isEditing && (
				<div className='mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200'>
					<div className='flex space-x-3'>
						<input
							type='text'
							placeholder='Add a new skill (e.g., JavaScript, Project Management, etc.)'
							value={newSkill}
							onChange={(e) => setNewSkill(e.target.value)}
							onKeyPress={handleKeyPress}
							className='flex-grow p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors'
						/>
						<button
							onClick={handleAddSkill}
							disabled={!newSkill.trim()}
							className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center'
						>
							<Plus size={18} className="mr-2" />
							Add
						</button>
					</div>
					<p className="text-sm text-gray-600 mt-2">
						💡 Add skills that showcase your expertise and help you stand out to potential connections.
					</p>
				</div>
			)}

			{/* Action Buttons */}
			{isOwnProfile && (
				<div className="pt-4 border-t border-gray-200">
					{isEditing ? (
						<div className="flex space-x-3">
							<button
								onClick={handleSave}
								className='bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2.5 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center'
							>
								<Save size={18} className="mr-2" />
								Save Changes
							</button>
							<button
								onClick={handleCancel}
								className='bg-gray-500 hover:bg-gray-600 text-white py-2.5 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5'
							>
								Cancel
							</button>
						</div>
					) : (
						skills.length === 0 && (
							<div className="text-center py-8">
								<Star size={48} className="mx-auto text-gray-300 mb-4" />
								<p className="text-gray-500 italic mb-4">
									{isOwnProfile 
										? "Add your skills to showcase your expertise to potential connections."
										: `${userData.name} hasn't added any skills yet.`
									}
								</p>
							</div>
						)
					)}
				</div>
			)}

			{!isOwnProfile && skills.length === 0 && (
				<div className="text-center py-8">
					<Star size={48} className="mx-auto text-gray-300 mb-4" />
					<p className="text-gray-500 italic">
						{userData.name} hasn't added any skills yet.
					</p>
				</div>
			)}

			{skills.length > 0 && !isEditing && (
				<div className="text-center text-sm text-gray-500 mt-4">
					{skills.length} skill{skills.length !== 1 ? 's' : ''} added
				</div>
			)}
		</div>
	);
};

export default SkillsSection;