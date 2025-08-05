import { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  X, 
  Trash2,
  Check,
  AlertCircle,
  Search
} from 'lucide-react';
import { useProfile, UserProfile, Achievement } from '../../hooks/useProfile';
import { storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ProfileEditorProps {
  onClose: () => void;
  profile: UserProfile | null;
}

const AVAILABLE_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Django', 'Flask', 'Java', 'Spring Boot',
  'Go', 'Ruby', 'Ruby on Rails', 'PHP', 'Laravel', 'C#', '.NET', 'Swift', 'Kotlin', 'SQL', 'PostgreSQL',
  'MySQL', 'MongoDB', 'Firebase', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile Methodologies', 'Scrum'
];

const AVAILABLE_LANGUAGES = [
  'English', 'Spanish', 'Mandarin Chinese', 'Hindi', 'French', 'Arabic', 'Bengali', 'Russian', 'Portuguese', 'Indonesian'
];

export function ProfileEditor({ onClose, profile }: ProfileEditorProps) {
  const { 
    updateProfile, 
    addEducation,
    removeEducation,
    addWorkExperience,
    removeWorkExperience,
    addAchievement,
    removeAchievement,
    addProject,
    removeProject,
    addCertificate,
    removeCertificate
  } = useProfile(profile?.id, !!profile?.id);

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [skillSearch, setSkillSearch] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');
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
  const [newAchievement, setNewAchievement] = useState<Omit<Achievement, 'id'>>({ title: '', issuer: '', date: '', description: '' });

  // Education form
  const [educationForm, setEducationForm] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: ''
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
    url: '',
    technologies: [] as string[],
    date: ''
  });

  // Certificate form
  const [certificateForm, setCertificateForm] = useState({
    name: '',
    issuer: '',
    url: '',
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

  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleAddLanguage = (lang: string) => {
    if (!selectedLanguages.includes(lang)) {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImageUpload = async (file: File, type: 'profile' | 'cover') => {
    if (!profile) return;

    const imageType = type === 'profile' ? 'profilePicture' : 'coverPhoto';

    setIsUploading(true);
    showMessage('success', `Uploading ${type === 'profile' ? 'profile picture' : 'cover photo'}...`);
    const storageRef = ref(storage, `user-uploads/${profile.id}/${imageType}/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      await updateProfile({ [imageType]: downloadURL });
      showMessage('success', `${type === 'profile' ? 'Profile picture' : 'Cover photo'} updated successfully.`);
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
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
      await updateProfile({ skills: selectedSkills });
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
      await updateProfile({ languages: selectedLanguages });
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
        fieldOfStudy: '',
        startYear: '',
        endYear: ''
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
    if (!newAchievement.title.trim()) {
      showMessage('error', 'Please enter an achievement title.');
      return;
    }
    
    try {
      setLoading(true);
      await addAchievement(newAchievement);
      setNewAchievement({ title: '', issuer: '', date: '', description: '' });
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
        url: '',
        technologies: [],
        date: ''
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
    if (!certificateForm.name || !certificateForm.issuer) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      await addCertificate(certificateForm);
      setCertificateForm({
        name: '',
        issuer: '',
        url: '',
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
                      disabled={isUploading}
                      className="absolute bottom-0 right-0 bg-[#0a66c2] text-white p-2 rounded-full hover:bg-[#004182] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                        </div>
                      ) : (
                        <Camera className="w-4 h-4" />
                      )}
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
                    disabled={isUploading}
                    className="absolute top-2 right-2 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              {/* This is a placeholder for the Education tab content */}
              <h3 className="text-lg font-medium text-gray-900">Education</h3>
              <p className="text-gray-500">Education section coming soon.</p>
            </div>
          )}

          {/* Work Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
              
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
                    placeholder="End Date (or present)"
                    value={workForm.endDate}
                    onChange={(e) => setWorkForm({...workForm, endDate: e.target.value})}
                    className="linkedin-input"
                    disabled={workForm.current}
                  />
                  <div className="flex items-center md:col-span-2">
                    <input
                      type="checkbox"
                      id="currentJob"
                      checked={workForm.current}
                      onChange={(e) => setWorkForm({...workForm, current: e.target.checked, endDate: e.target.checked ? 'Present' : ''})}
                      className="h-4 w-4 text-[#0a66c2] focus:ring-[#0a66c2] border-gray-300 rounded"
                    />
                    <label htmlFor="currentJob" className="ml-2 block text-sm text-gray-900">
                      I currently work here
                    </label>
                  </div>
                  <textarea
                    placeholder="Description"
                    value={workForm.description}
                    onChange={(e) => setWorkForm({...workForm, description: e.target.value})}
                    rows={4}
                    className="linkedin-input md:col-span-2"
                  ></textarea>
                </div>
                <button
                  onClick={handleAddWorkExperience}
                  disabled={loading}
                  className="linkedin-btn-primary mt-4"
                >
                  {loading ? 'Adding...' : 'Add Experience'}
                </button>
              </div>

              <div className="space-y-4">
                {profile?.workExperience?.map((exp, index) => (
                  <div key={exp.id} className="linkedin-card p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                        <p className="text-gray-600">{exp.company} · {exp.location}</p>
                        <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                        {exp.description && <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{exp.description}</p>}
                      </div>
                      <button
                        onClick={() => removeWorkExperience(index)}
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

          {/* Skills & Languages Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              {/* Skills Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for skills..."
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      className="linkedin-input w-full"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
                    {AVAILABLE_SKILLS.filter(skill => 
                      skill.toLowerCase().includes(skillSearch.toLowerCase()) && 
                      !selectedSkills.includes(skill)
                    ).map(skill => (
                      <button 
                        key={skill} 
                        onClick={() => handleAddSkill(skill)} 
                        className="w-full text-left p-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Your Skills</h4>
                  {selectedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map(skill => (
                        <div key={skill} className="flex items-center bg-[#0a66c2] text-white text-sm font-medium px-3 py-1 rounded-full">
                          <span>{skill}</span>
                          <button onClick={() => handleRemoveSkill(skill)} className="ml-2 text-white hover:bg-white/20 rounded-full p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No skills added yet.</p>
                  )}
                </div>
                <button onClick={handleSaveSkills} disabled={loading} className="linkedin-btn-primary mt-4">
                  {loading ? 'Saving...' : 'Save Skills'}
                </button>
              </div>

              {/* Languages Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Languages</h3>
                 <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for languages..."
                      value={languageSearch}
                      onChange={(e) => setLanguageSearch(e.target.value)}
                      className="linkedin-input w-full"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
                    {AVAILABLE_LANGUAGES.filter(lang => 
                      lang.toLowerCase().includes(languageSearch.toLowerCase()) && 
                      !selectedLanguages.includes(lang)
                    ).map(lang => (
                      <button 
                        key={lang} 
                        onClick={() => handleAddLanguage(lang)} 
                        className="w-full text-left p-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Your Languages</h4>
                  {selectedLanguages.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedLanguages.map(lang => (
                        <div key={lang} className="flex items-center bg-[#0a66c2] text-white text-sm font-medium px-3 py-1 rounded-full">
                          <span>{lang}</span>
                          <button onClick={() => handleRemoveLanguage(lang)} className="ml-2 text-white hover:bg-white/20 rounded-full p-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No languages added yet.</p>
                  )}
                </div>
                <button onClick={handleSaveLanguages} disabled={loading} className="linkedin-btn-primary mt-4">
                  {loading ? 'Saving...' : 'Save Languages'}
                </button>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
              <p className="text-gray-500">Achievements section coming soon.</p>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Projects</h3>
              <p className="text-gray-500">Projects section coming soon.</p>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Certificates</h3>
              <p className="text-gray-500">Certificates section coming soon.</p>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Skills & Languages</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Add Skills</h4>
                <input
                  type="text"
                  placeholder="Search for skills..."
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                  className="linkedin-input mb-4"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border p-2 rounded-md">
                  {AVAILABLE_SKILLS.filter(skill => skill.toLowerCase().includes(skillSearch.toLowerCase())).map((skill) => (
                    <label key={skill} className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 cursor-pointer">
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
                        className="rounded text-[#0a66c2] focus:ring-[#0a66c2]"
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

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Add Languages</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto border p-2 rounded-md">
                  {AVAILABLE_LANGUAGES.map((language) => (
                    <label key={language} className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 cursor-pointer">
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
                        className="rounded text-[#0a66c2] focus:ring-[#0a66c2]"
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
                  placeholder="Title"
                  value={newAchievement.title}
                  onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                  className="linkedin-input"
                />
                <input
                  type="text"
                  placeholder="Issuer"
                  value={newAchievement.issuer}
                  onChange={(e) => setNewAchievement({...newAchievement, issuer: e.target.value})}
                  className="linkedin-input"
                />
                <input
                  type="text"
                  placeholder="Date"
                  value={newAchievement.date}
                  onChange={(e) => setNewAchievement({...newAchievement, date: e.target.value})}
                  className="linkedin-input"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                  className="linkedin-input h-24"
                />
                <button
                  onClick={handleAddAchievement}
                  disabled={loading || !newAchievement.title.trim()}
                  className="linkedin-btn-primary"
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
              </div>

              <div className="space-y-2">
                {profile?.achievements?.map((achievement) => (
                  <div key={achievement.id} className="linkedin-card p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                        <p className="text-gray-600">{achievement.issuer} - {achievement.date}</p>
                        {achievement.description && <p className="text-sm text-gray-500 mt-2">{achievement.description}</p>}
                      </div>
                      <button
                        onClick={() => achievement.id && removeAchievement(achievement.id)}
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
                    placeholder="Project URL (optional)"
                    value={projectForm.url}
                    onChange={(e) => setProjectForm({...projectForm, url: e.target.value})}
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
                        <p className="text-gray-600">{project.description}</p>
                        {project.url && (
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#0a66c2] hover:underline text-sm"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => project.id && removeProject(project.id)}
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
                    placeholder="Certificate Name"
                    value={certificateForm.name}
                    onChange={(e) => setCertificateForm({...certificateForm, name: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="text"
                    placeholder="Issuing Organization"
                    value={certificateForm.issuer}
                    onChange={(e) => setCertificateForm({...certificateForm, issuer: e.target.value})}
                    className="linkedin-input"
                  />
                  <input
                    type="url"
                    placeholder="Certificate URL (optional)"
                    value={certificateForm.url}
                    onChange={(e) => setCertificateForm({...certificateForm, url: e.target.value})}
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
                        <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                        <p className="text-gray-600">{cert.issuer}</p>
                        <p className="text-sm text-gray-500">{cert.date}</p>
                        {cert.url && (
                          <a 
                            href={cert.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#0a66c2] hover:underline text-sm"
                          >
                            View Certificate
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => cert.id && removeCertificate(cert.id)}
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