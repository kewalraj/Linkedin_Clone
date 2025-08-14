import { Briefcase, X, Plus, Edit3, Save, Calendar } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../../utils/dateUtils";

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [experiences, setExperiences] = useState(userData.experience || []);
	const [newExperience, setNewExperience] = useState({
		title: "",
		company: "",
		startDate: "",
		endDate: "",
		description: "",
		currentlyWorking: false,
	});
	const [isAddingNew, setIsAddingNew] = useState(false);

	const handleAddExperience = () => {
		if (newExperience.title && newExperience.company && newExperience.startDate) {
			setExperiences([...experiences, { ...newExperience, _id: Date.now().toString() }]);
			setNewExperience({
				title: "",
				company: "",
				startDate: "",
				endDate: "",
				description: "",
				currentlyWorking: false,
			});
			setIsAddingNew(false);
		}
	};

	const handleDeleteExperience = (id) => {
		setExperiences(experiences.filter((exp) => exp._id !== id));
	};

	const handleSave = () => {
		onSave({ experience: experiences });
		setIsEditing(false);
		setIsAddingNew(false);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setIsAddingNew(false);
		setExperiences(userData.experience || []);
		setNewExperience({
			title: "",
			company: "",
			startDate: "",
			endDate: "",
			description: "",
			currentlyWorking: false,
		});
	};

	const handleCurrentlyWorkingChange = (e) => {
		setNewExperience({
			...newExperience,
			currentlyWorking: e.target.checked,
			endDate: e.target.checked ? "" : newExperience.endDate,
		});
	};

	return (
		<div className='bg-white shadow-lg rounded-2xl p-8 mb-6'>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-3">
					<div className="p-2 bg-green-100 rounded-lg">
						<Briefcase className="w-6 h-6 text-green-600" />
					</div>
					<h2 className='text-2xl font-bold text-gray-800'>Experience</h2>
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

			{/* Experience List */}
			<div className="space-y-6">
				{experiences.map((exp) => (
					<div key={exp._id} className='flex justify-between items-start p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
						<div className='flex items-start space-x-4'>
							<div className="p-3 bg-white rounded-lg shadow-sm">
								<Briefcase size={24} className='text-green-600' />
							</div>
							<div className="flex-1">
								<h3 className='text-xl font-bold text-gray-900 mb-1'>{exp.title}</h3>
								<p className='text-lg font-semibold text-gray-700 mb-2'>{exp.company}</p>
								<div className="flex items-center text-gray-500 mb-3">
									<Calendar size={16} className="mr-2" />
									<span className="text-sm font-medium">
										{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
									</span>
								</div>
								{exp.description && (
									<p className='text-gray-600 leading-relaxed whitespace-pre-wrap'>{exp.description}</p>
								)}
							</div>
						</div>
						{isEditing && (
							<button 
								onClick={() => handleDeleteExperience(exp._id)} 
								className='text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors'
							>
								<X size={20} />
							</button>
						)}
					</div>
				))}
			</div>

			{/* Add New Experience Form */}
			{isEditing && isAddingNew && (
				<div className='mt-6 p-6 bg-blue-50 rounded-xl border-2 border-blue-200'>
					<h4 className="text-lg font-semibold mb-4 text-gray-800">Add New Experience</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<input
							type='text'
							placeholder='Job Title'
							value={newExperience.title}
							onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
							className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors'
						/>
						<input
							type='text'
							placeholder='Company'
							value={newExperience.company}
							onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
							className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors'
						/>
						<input
							type='date'
							placeholder='Start Date'
							value={newExperience.startDate}
							onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
							className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors'
						/>
						{!newExperience.currentlyWorking && (
							<input
								type='date'
								placeholder='End Date'
								value={newExperience.endDate}
								onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
								className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors'
							/>
						)}
					</div>
					<div className='flex items-center mt-4 mb-4'>
						<input
							type='checkbox'
							id='currentlyWorking'
							checked={newExperience.currentlyWorking}
							onChange={handleCurrentlyWorkingChange}
							className='w-4 h-4 text-blue-600 mr-3'
						/>
						<label htmlFor='currentlyWorking' className="text-gray-700 font-medium">I currently work here</label>
					</div>
					<textarea
						placeholder='Job Description (optional)'
						value={newExperience.description}
						onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
						className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none'
						rows="4"
					/>
					<div className="flex space-x-3 mt-4">
						<button
							onClick={handleAddExperience}
							className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
						>
							Add Experience
						</button>
						<button
							onClick={() => setIsAddingNew(false)}
							className='bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			{/* Action Buttons */}
			{isOwnProfile && (
				<div className="mt-6 pt-6 border-t border-gray-200">
					{isEditing ? (
						<div className="flex space-x-3">
							{!isAddingNew && (
								<button
									onClick={() => setIsAddingNew(true)}
									className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center'
								>
									<Plus size={18} className="mr-2" />
									Add Experience
								</button>
							)}
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
						experiences.length === 0 && (
							<div className="text-center py-8">
								<Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
								<p className="text-gray-500 italic mb-4">
									{isOwnProfile 
										? "Add your work experience to showcase your professional journey."
										: `${userData.name} hasn't added any work experience yet.`
									}
								</p>
							</div>
						)
					)}
				</div>
			)}

			{!isOwnProfile && experiences.length === 0 && (
				<div className="text-center py-8">
					<Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
					<p className="text-gray-500 italic">
						{userData.name} hasn't added any work experience yet.
					</p>
				</div>
			)}
		</div>
	);
};

export default ExperienceSection;