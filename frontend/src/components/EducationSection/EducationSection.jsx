import { School, X, Plus, Edit3, Save, Calendar, GraduationCap } from "lucide-react";
import { useState } from "react";

const EducationSection = ({ userData, isOwnProfile, onSave }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [educations, setEducations] = useState(userData.education || []);
	const [newEducation, setNewEducation] = useState({
		school: "",
		fieldOfStudy: "",
		startYear: "",
		endYear: "",
	});
	const [isAddingNew, setIsAddingNew] = useState(false);

	const handleAddEducation = () => {
		if (newEducation.school && newEducation.fieldOfStudy && newEducation.startYear) {
			setEducations([...educations, { ...newEducation, _id: Date.now().toString() }]);
			setNewEducation({
				school: "",
				fieldOfStudy: "",
				startYear: "",
				endYear: "",
			});
			setIsAddingNew(false);
		}
	};

	const handleDeleteEducation = (id) => {
		setEducations(educations.filter((edu) => edu._id !== id));
	};

	const handleSave = () => {
		onSave({ education: educations });
		setIsEditing(false);
		setIsAddingNew(false);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setIsAddingNew(false);
		setEducations(userData.education || []);
		setNewEducation({
			school: "",
			fieldOfStudy: "",
			startYear: "",
			endYear: "",
		});
	};

	return (
		<div className='bg-white shadow-lg rounded-2xl p-8 mb-6'>
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-3">
					<div className="p-2 bg-indigo-100 rounded-lg">
						<GraduationCap className="w-6 h-6 text-indigo-600" />
					</div>
					<h2 className='text-2xl font-bold text-gray-800'>Education</h2>
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

			{/* Education List */}
			<div className="space-y-6">
				{educations.map((edu) => (
					<div key={edu._id} className='flex justify-between items-start p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'>
						<div className='flex items-start space-x-4'>
							<div className="p-3 bg-white rounded-lg shadow-sm">
								<School size={24} className='text-indigo-600' />
							</div>
							<div className="flex-1">
								<h3 className='text-xl font-bold text-gray-900 mb-1'>{edu.fieldOfStudy}</h3>
								<p className='text-lg font-semibold text-gray-700 mb-2'>{edu.school}</p>
								<div className="flex items-center text-gray-500">
									<Calendar size={16} className="mr-2" />
									<span className="text-sm font-medium">
										{edu.startYear} - {edu.endYear || "Present"}
									</span>
								</div>
							</div>
						</div>
						{isEditing && (
							<button 
								onClick={() => handleDeleteEducation(edu._id)} 
								className='text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors'
							>
								<X size={20} />
							</button>
						)}
					</div>
				))}
			</div>

			{/* Add New Education Form */}
			{isEditing && isAddingNew && (
				<div className='mt-6 p-6 bg-indigo-50 rounded-xl border-2 border-indigo-200'>
					<h4 className="text-lg font-semibold mb-4 text-gray-800">Add New Education</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<input
							type='text'
							placeholder='School/University'
							value={newEducation.school}
							onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
							className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors'
						/>
						<input
							type='text'
							placeholder='Field of Study'
							value={newEducation.fieldOfStudy}
							onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
							className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors'
						/>
						<input
							type='number'
							placeholder='Start Year'
							value={newEducation.startYear}
							onChange={(e) => setNewEducation({ ...newEducation, startYear: e.target.value })}
							className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors'
							min="1950"
							max="2030"
						/>
						<input
							type='number'
							placeholder='End Year (optional)'
							value={newEducation.endYear}
							onChange={(e) => setNewEducation({ ...newEducation, endYear: e.target.value })}
							className='w-full p-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors'
							min="1950"
							max="2030"
						/>
					</div>
					<div className="flex space-x-3 mt-4">
						<button
							onClick={handleAddEducation}
							className='bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-2 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
						>
							Add Education
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
									className='bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-2.5 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center'
								>
									<Plus size={18} className="mr-2" />
									Add Education
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
						educations.length === 0 && (
							<div className="text-center py-8">
								<GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
								<p className="text-gray-500 italic mb-4">
									{isOwnProfile 
										? "Add your educational background to showcase your academic achievements."
										: `${userData.name} hasn't added any education details yet.`
									}
								</p>
							</div>
						)
					)}
				</div>
			)}

			{!isOwnProfile && educations.length === 0 && (
				<div className="text-center py-8">
					<GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
					<p className="text-gray-500 italic">
						{userData.name} hasn't added any education details yet.
					</p>
				</div>
			)}
		</div>
	);
};

export default EducationSection;