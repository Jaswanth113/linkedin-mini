import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit, 
  Camera, 
  X, 
  Plus, 
  Trash2,
  Save,
  ChevronDown,
  Check,
  AlertCircle
} from 'lucide-react';
import { useProfile, UserProfile, Education, WorkExperience, Project, Certificate } from '../../hooks/useProfile';

interface ProfileEditorProps {
  onClose: () => void;
}

export function ProfileEditor({ onClose }: ProfileEditorProps) {
  const { 
    profile, 
    updateProfile, 
    updateProfilePicture, 
    updateCoverPhoto,
    addEducation,
    updateEducation,
    removeEducation,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    updateSkills,
    updateLanguages,
    addAchievement,
    removeAchievement,
    addProject,
    updateProject,
    removeProject,
    addCertificate,
    updateCertificate,
    removeCertificate,
    AVAILABLE_SKILLS,
    AVAILABLE_LANGUAGES
  } = useProfile();

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const coverPhotoRef = useRef<HTMLInputElement>(null);

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    displayName: '',
    headline: '',
    bio: '',
    location: ''
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState('');

  // Education form
  const [educationForm, setEducationForm] = useState({
    school: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    description: ''
  });

  // Work experience form
  const [workForm, setWorkForm] = useState({
    company: '',
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  // Project form
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    link: '',
    technologies: [] as string[]
  });

  // Certificate form
  const [certificateForm, setCertificateForm] = useState({
    title: '',
    issuingOrg: '',
    link: '',
    date: ''
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setBasicInfo({
        displayName: profile.displayName || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || ''
      });
      setSelectedSkills(profile.skills || []);
      setSelectedLanguages(profile.languages || []);
    }
  }, [profile]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImageUpload = async (file: File, type: 'profile' | 'cover') => {
    try {
      setLoading(true);
      if (type === 'profile') {
        await updateProfilePicture(file);
        showMessage('success', 'Profile picture updated successfully!');
      } else {
        await updateCoverPhoto(file);
        showMessage('success', 'Cover photo updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', 'Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasicInfo = async () => {
    try {
      setLoading(true);
      await updateProfile(basicInfo);
      showMessage('success', 'Basic information saved successfully!');
    } catch (error) {
      console.error('Error saving basic info:', error);
      showMessage('error', 'Failed to save basic information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSkills = async () => {
    try {
      setLoading(true);
      await updateSkills(selectedSkills);
      showMessage('success', 'Skills updated successfully!');
    } catch (error) {
      console.error('Error saving skills:', error);
      showMessage('error', 'Failed to save skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLanguages = async () => {
    try {
      setLoading(true);
      await updateLanguages(selectedLanguages);
      showMessage('success', 'Languages updated successfully!');
    } catch (error) {
      console.error('Error saving languages:', error);
      showMessage('error', 'Failed to save languages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEducation = async () => {
    if (!educationForm.school || !educationForm.degree) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      await addEducation(educationForm);
      setEducationForm({
        school: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        description: ''
      });
      showMessage('success', 'Education added successfully!');
    } catch (error) {
      console.error('Error adding education:', error);
      showMessage('error', 'Failed to add education. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkExperience = async () => {
    if (!workForm.company || !workForm.title) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      await addWorkExperience(workForm);
      setWorkForm({
        company: '',
        title: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
      showMessage('success', 'Work experience added successfully!');
    } catch (error) {
      console.error('Error adding work experience:', error);
      showMessage('error', 'Failed to add work experience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAchievement = async () => {
    if (!newAchievement.trim()) {
      showMessage('error', 'Please enter an achievement.');
      return;
    }
    
    try {
      setLoading(true);
      await addAchievement(newAchievement);
      setNewAchievement('');
      showMessage('success', 'Achievement added successfully!');
    } catch (error) {
      console.error('Error adding achievement:', error);
      showMessage('error', 'Failed to add achievement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async () => {
    if (!projectForm.name || !projectForm.description) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      await addProject(projectForm);
      setProjectForm({
        name: '',
        description: '',
        link: '',
        technologies: []
      });
      showMessage('success', 'Project added successfully!');
    } catch (error) {
      console.error('Error adding project:', error);
      showMessage('error', 'Failed to add project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertificate = async () => {
    if (!certificateForm.title || !certificateForm.issuingOrg) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      await addCertificate(certificateForm);
      setCertificateForm({
        title: '',
        issuingOrg: '',
        link: '',
        date: ''
      });
      showMessage('success', 'Certificate added successfully!');
    } catch (error) {
      console.error('Error adding certificate:', error);
      showMessage('error', 'Failed to add certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#0a66c2] text-[#0a66c2]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Profile Picture */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-[#0a66c2] rounded-full flex items-center justify-center">
                      {profile?.profilePicture ? (
                        <img 
                          src={profile.profilePicture} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-2xl">
                          {profile?.displayName?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => profilePicRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-[#0a66c2] text-white p-2 rounded-full hover:bg-[#004182] transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    ref={profilePicRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'profile');
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Cover Photo */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Cover Photo</h3>
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-[#0a66c2] to-[#004182] rounded-lg">
                    {profile?.coverPhoto && (
                      <img 
                        src={profile.coverPhoto} 
                        alt="Cover" 
                        className="w-full h-32 rounded-lg object-cover"
                      />
                    )}
                  </div>
                  <button
                    onClick={() => coverPhotoRef.current?.click()}
                    className="absolute top-2 right-2 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={coverPhotoRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'cover');
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Basic Info Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={basicInfo.displayName}
                    onChange={(e) => setBasicInfo({...basicInfo, displayName: e.target.value})}
                    className="linkedin-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={basicInfo.headline}
                    onChange={(e) => setBasicInfo({...basicInfo, headline: e.target.value})}
                    placeholder="e.g., Software Engineer at Tech Company"
                    className="linkedin-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={basicInfo.bio}
                    onChange={(e) => setBasicInfo({...basicInfo, bio: e.target.value})}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="linkedin-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={basicInfo.location}
                    onChange={(e) => setBasicInfo({...basicInfo, location: e.target.value})}
                    placeholder="e.g., San Francisco, CA"
                    className="linkedin-input"
                  />
                </div>

                <button
                  onClick={handleSaveBasicInfo}
                  disabled={loading}
                  className="linkedin-btn-primary"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Education</h3>
              
              {/* Add Education Form */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Add Education</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="School"
                    value={educationForm.school}
                    onChange={(e) => setEducationForm({...educationForm, school: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={educationForm.degree}
                    onChange={(e) => setEducationForm({...educationForm, degree: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={educationForm.field}
                    onChange={(e) => setEducationForm({...educationForm, field: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="text"
                    placeholder="Start Year"
                    value={educationForm.startYear}
                    onChange={(e) => setEducationForm({...educationForm, startYear: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="text"
                    placeholder="End Year (optional)"
                    value={educationForm.endYear}
                    onChange={(e) => setEducationForm({...educationForm, endYear: e.target.value})}
                    className="linkedin-input"
                  />
                </div>
                <textarea
                  placeholder="Description (optional)"
                  value={educationForm.description}
                  onChange={(e) => setEducationForm({...educationForm, description: e.target.value})}
                  rows={3}
                  className="linkedin-input mt-4"
                />
                <button
                  onClick={handleAddEducation}
                  disabled={loading}
                  className="linkedin-btn-primary mt-4"
                >
                  {loading ? 'Adding...' : 'Add Education'}
                </button>
              </div>

              {/* Education List */}
              <div className="space-y-4">
                {profile?.education?.map((edu) => (
                  <div key={edu.id} className="linkedin-card p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{edu.school}</h4>
                        <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                        <p className="text-sm text-gray-500">{edu.startYear} - {edu.endYear || 'Present'}</p>
                        {edu.description && (
                          <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
              
              {/* Add Experience Form */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Add Work Experience</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company"
                    value={workForm.company}
                    onChange={(e) => setWorkForm({...workForm, company: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={workForm.title}
                    onChange={(e) => setWorkForm({...workForm, title: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={workForm.location}
                    onChange={(e) => setWorkForm({...workForm, location: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={workForm.startDate}
                    onChange={(e) => setWorkForm({...workForm, startDate: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="text"
                    placeholder="End Date (optional)"
                    value={workForm.endDate}
                    onChange={(e) => setWorkForm({...workForm, endDate: e.target.value})}
                    className="linkedin-input"
                    disabled={workForm.current}
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={workForm.current}
                      onChange={(e) => setWorkForm({...workForm, current: e.target.checked})}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">I currently work here</label>
                  </div>
                </div>
                <textarea
                  placeholder="Description"
                  value={workForm.description}
                  onChange={(e) => setWorkForm({...workForm, description: e.target.value})}
                  rows={3}
                  className="linkedin-input mt-4"
                />
                <button
                  onClick={handleAddWorkExperience}
                  disabled={loading}
                  className="linkedin-btn-primary mt-4"
                >
                  {loading ? 'Adding...' : 'Add Experience'}
                </button>
              </div>

              {/* Experience List */}
              <div className="space-y-4">
                {profile?.workExperience?.map((exp) => (
                  <div key={exp.id} className="linkedin-card p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                        {exp.description && (
                          <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeWorkExperience(exp.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Skills</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Skills
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {AVAILABLE_SKILLS.map((skill) => (
                    <label key={skill} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSkills([...selectedSkills, skill]);
                          } else {
                            setSelectedSkills(selectedSkills.filter(s => s !== skill));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleSaveSkills}
                  disabled={loading}
                  className="linkedin-btn-primary mt-4"
                >
                  {loading ? 'Saving...' : 'Save Skills'}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {AVAILABLE_LANGUAGES.map((language) => (
                    <label key={language} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(language)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLanguages([...selectedLanguages, language]);
                          } else {
                            setSelectedLanguages(selectedLanguages.filter(l => l !== language));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">{language}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleSaveLanguages}
                  disabled={loading}
                  className="linkedin-btn-primary mt-4"
                >
                  {loading ? 'Saving...' : 'Save Languages'}
                </button>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add an achievement"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  className="linkedin-input flex-1"
                />
                <button
                  onClick={handleAddAchievement}
                  disabled={loading || !newAchievement.trim()}
                  className="linkedin-btn-primary"
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>

              <div className="space-y-2">
                {profile?.achievements?.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{achievement}</span>
                    <button
                      onClick={() => removeAchievement(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Projects</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Add Project</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    className="linkedin-input"
                  />
                  <textarea
                    placeholder="Description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    rows={3}
                    className="linkedin-input"
                  />
                  <input
                    type="url"
                    placeholder="Project Link (optional)"
                    value={projectForm.link}
                    onChange={(e) => setProjectForm({...projectForm, link: e.target.value})}
                    className="linkedin-input"
                  />
                </div>
                <button
                  onClick={handleAddProject}
                  disabled={loading}
                  className="linkedin-btn-primary mt-4"
                >
                  {loading ? 'Adding...' : 'Add Project'}
                </button>
              </div>

              <div className="space-y-4">
                {profile?.projects?.map((project) => (
                  <div key={project.id} className="linkedin-card p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <p className="text-gray-700 mt-1">{project.description}</p>
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#0a66c2] hover:underline text-sm"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Certificates</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Add Certificate</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Certificate Title"
                    value={certificateForm.title}
                    onChange={(e) => setCertificateForm({...certificateForm, title: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Organization"
                    value={certificateForm.issuingOrg}
                    onChange={(e) => setCertificateForm({...certificateForm, issuingOrg: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="url"
                    placeholder="Certificate Link (optional)"
                    value={certificateForm.link}
                    onChange={(e) => setCertificateForm({...certificateForm, link: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="text"
                    placeholder="Date"
                    value={certificateForm.date}
                    onChange={(e) => setCertificateForm({...certificateForm, date: e.target.value})}
                    className="linkedin-input"
                  />
                </div>
                <button
                  onClick={handleAddCertificate}
                  disabled={loading}
                  className="linkedin-btn-primary mt-4"
                >
                  {loading ? 'Adding...' : 'Add Certificate'}
                </button>
              </div>

              <div className="space-y-4">
                {profile?.certificates?.map((cert) => (
                  <div key={cert.id} className="linkedin-card p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                        <p className="text-gray-600">{cert.issuingOrg}</p>
                        <p className="text-sm text-gray-500">{cert.date}</p>
                        {cert.link && (
                          <a 
                            href={cert.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#0a66c2] hover:underline text-sm"
                          >
                            View Certificate
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => removeCertificate(cert.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 