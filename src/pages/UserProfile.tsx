import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile, UserProfile as UserProfileType } from '../hooks/useProfile';
import { usePosts } from '../hooks/usePosts';
import { useProfileViews } from '../hooks/useProfileViews';
import { PostCard } from '../components/Feed/PostCard';
import { ProfileSectionModal } from '../components/Profile/ProfileSectionModal';
import {
  Edit,
  Eye,
  TrendingUp,
  ArrowLeft,
  UserPlus,
  MessageCircle,
  Plus,
  Briefcase,
  Award,
  FolderOpen,
  FileText,
  ExternalLink
} from 'lucide-react';

function SectionForm({ section, onSave, onClose }: { section: any, onSave: (data: any) => void, onClose: () => void }) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (section) {
      if (section.type === 'skills') {
        // The skills array is passed directly in section.data
        setFormData({ skills: (section.data || []).join(', ') });
      } else {
        setFormData(section.data || {});
      }
    }
  }, [section]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (section.type === 'skills') {
      // For skills, convert the string back to an array and pass it inside an object.
      onSave({ skills: formData.skills.split(',').map((s: string) => s.trim()).filter(Boolean) });
    } else {
      // For other sections, just pass the form data directly.
      onSave(formData);
    }
  };

  const renderFormFields = () => {
    if (!section) return <p>Something went wrong.</p>;

    switch (section.type) {
      case 'skills':
        return (
          <textarea
            name="skills"
            value={formData.skills || ''}
            onChange={handleChange}
            placeholder="Enter skills, separated by commas"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" rows={4}
          />
        );
      case 'education':
        return (
          <div className="space-y-4">
            <input name="school" value={formData.school || ''} onChange={handleChange} placeholder="School or University" className="w-full p-2 border border-gray-300 rounded-md" />
            <input name="degree" value={formData.degree || ''} onChange={handleChange} placeholder="Degree" className="w-full p-2 border border-gray-300 rounded-md" />
            <input name="fieldOfStudy" value={formData.fieldOfStudy || ''} onChange={handleChange} placeholder="Field of Study" className="w-full p-2 border border-gray-300 rounded-md" />
            <div className="flex space-x-4">
              <input name="startYear" value={formData.startYear || ''} onChange={handleChange} placeholder="Start Year" className="w-full p-2 border border-gray-300 rounded-md" />
              <input name="endYear" value={formData.endYear || ''} onChange={handleChange} placeholder="End Year (or expected)" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
          </div>
        );
      case 'workExperience':
        return (
          <div className="space-y-4">
            <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Job Title" className="w-full p-2 border border-gray-300 rounded-md" />
            <input name="company" value={formData.company || ''} onChange={handleChange} placeholder="Company" className="w-full p-2 border border-gray-300 rounded-md" />
            <input name="location" value={formData.location || ''} onChange={handleChange} placeholder="Location" className="w-full p-2 border border-gray-300 rounded-md" />
            <div className="flex space-x-4">
              <input name="startDate" value={formData.startDate || ''} onChange={handleChange} placeholder="Start Date" className="w-full p-2 border border-gray-300 rounded-md" />
              <input name="endDate" value={formData.endDate || ''} onChange={handleChange} placeholder="End Date (or 'Present')" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="w-full p-2 border border-gray-300 rounded-md" rows={3}></textarea>
          </div>
        );
        case 'projects':
        return (
          <div className="space-y-4">
            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Project Name" className="w-full p-2 border border-gray-300 rounded-md" />
            <input name="date" value={formData.date || ''} onChange={handleChange} placeholder="Date (e.g., Jan 2023)" className="w-full p-2 border border-gray-300 rounded-md" />
            <input name="url" value={formData.url || ''} onChange={handleChange} placeholder="Project URL" className="w-full p-2 border border-gray-300 rounded-md" />
            <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="w-full p-2 border border-gray-300 rounded-md" rows={3}></textarea>
          </div>
        );
      case 'certificates':
        return (
          <div className="space-y-4">
            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Certificate Name" className="w-full p-2 border border-gray-300 rounded-md" />
            <input name="issuer" value={formData.issuer || ''} onChange={handleChange} placeholder="Issuing Organization" className="w-full p-2 border border-gray-300 rounded-md" />
            <input name="date" value={formData.date || ''} onChange={handleChange} placeholder="Issue Date" className="w-full p-2 border border-gray-300 rounded-md" />
            <input name="url" value={formData.url || ''} onChange={handleChange} placeholder="Credential URL" className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        );
      case 'achievements':
        return (
          <div className="space-y-4">
            <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="Honor or Award Title" className="w-full p-2 border border-gray-300 rounded-md" />
            <input name="issuer" value={formData.issuer || ''} onChange={handleChange} placeholder="Issuer" className="w-full p-2 border border-gray-300 rounded-md" />
            <input name="date" value={formData.date || ''} onChange={handleChange} placeholder="Date" className="w-full p-2 border border-gray-300 rounded-md" />
            <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" className="w-full p-2 border border-gray-300 rounded-md" rows={3}></textarea>
          </div>
        );
      default:
        return <p>Something went wrong.</p>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderFormFields()}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button type="button" onClick={onClose} className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#0a66c2] rounded-md hover:bg-[#004182] transition">Save</button>
      </div>
    </form>
  );
}



export function UserProfile() {
  const [showEditModal, setShowEditModal] = useState(false);
  const { userId: routeUserId } = useParams<{ userId: string }>();
  const { currentUser, loading: authLoading } = useAuth();
  
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    // This effect runs when authentication is complete.
    // It sets the userId for the profile we need to load.
    if (!authLoading) {
      setUserId(routeUserId || currentUser?.id);
    }
  }, [authLoading, routeUserId, currentUser]);

  // The profile hook is enabled only when we have a valid userId.
  const { profile, loading: profileLoading, error, updateProfile } = useProfile(userId, !!userId);

  const isOwnProfile = !authLoading && !profileLoading && !!currentUser && !!profile && currentUser.id === profile.id;

  const { getUserPosts } = usePosts();
  const { profileViews, postImpressions } = useProfileViews(userId);

  const [isSectionModalOpen, setSectionModalOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState<Partial<UserProfileType> | null>(null);
  const [currentSection, setCurrentSection] = useState<{ type: string; data: any; index?: number } | null>(null);

  useEffect(() => {
    // Self-correcting effect: If the user is viewing their own profile
    // and their displayName in the database doesn't match their auth displayName,
    // update the database profile.
    if (isOwnProfile && profile && currentUser?.displayName && profile.displayName !== currentUser.displayName) {
      updateProfile({ displayName: currentUser.displayName });
    }
  }, [isOwnProfile, profile, currentUser, updateProfile]);

  const openSectionModal = (type: string, data: any = {}, index?: number) => {
    if (type === 'skills') {
      setCurrentSection({ type, data: profile?.skills || [] });
    } else {
      setCurrentSection({ type, data, index });
    }
    setSectionModalOpen(true);
  };

  const closeSectionModal = () => {
    setSectionModalOpen(false);
    setCurrentSection(null);
  };

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileFormData(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
  };

  const handleProfileFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (profileFormData) {
      await updateProfile(profileFormData);
      setShowEditModal(false);
    }
  };

  const handleSectionSave = async (formData: any) => {
    if (!profile || !currentSection) return;

    const { type, index } = currentSection;

    try {
      if (type === 'skills') {
        // Handle skills update
        await updateProfile({ skills: formData.skills });
      } else {
        // Handle updates for arrays of objects (Experience, Education, etc.)
        const currentItems = (profile[type as keyof UserProfileType] as any[]) || [];
        let updatedItems;

        if (index !== undefined) {
          // Update an existing item
          updatedItems = [...currentItems];
          updatedItems[index] = { ...updatedItems[index], ...formData };
        } else {
          // Add a new item
          const newItem = { id: Date.now().toString(), ...formData };
          updatedItems = [...currentItems, newItem];
        }
        await updateProfile({ [type]: updatedItems });
      }
      closeSectionModal(); // Close modal on successful save
    } catch (err) {
      console.error('Failed to save section:', err);
      // Optionally: show an error message to the user
    }
  };

  const userPosts = userId ? getUserPosts(userId) : [];

  // Show a loading spinner if we are waiting for auth or for the profile data to load.
  if (authLoading || (userId && profileLoading)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0a66c2]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-3 px-6 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2 inline" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <span className="text-gray-500 font-bold text-3xl">?</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-6">This profile could not be loaded.</p>
            <Link to="/" className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-3 px-6 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2 inline" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-[#0a66c2] hover:text-[#004182] font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Feed
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="relative">
            <img src={profile.coverPhoto || 'https://via.placeholder.com/1500x500'} alt="Cover" className="w-full h-48 object-cover" />
            <div className="absolute top-24 left-6">
              <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center ring-4 ring-white">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={profile.displayName || 'Profile'} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-gray-500">{profile.displayName?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>
            <div className="pt-4 pl-48 pr-6 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.displayName}</h1>
                  <p className="text-gray-600 text-lg">{profile.headline}</p>
                  <p className="text-gray-500 text-sm mt-1">{profile.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {isOwnProfile ? (
                    <button 
                      onClick={() => {
                        setProfileFormData(profile);
                        setShowEditModal(true); 
                      }}
                      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center">
                      <Edit size={16} className="mr-2"/> Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-[#0a66c2] text-white rounded-full font-semibold hover:bg-[#004182] flex items-center">
                        <UserPlus className="w-4 h-4 mr-2" /> Connect
                      </button>
                      <button className="px-4 py-2 bg-white text-[#0a66c2] border border-[#0a66c2] rounded-full font-semibold hover:bg-blue-50 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" /> Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleProfileFormSubmit} className="p-6">
                <h2 className="text-2xl font-bold mb-6">Edit Basic Info</h2>
                <div className="space-y-4">
                  <input type="text" name="displayName" value={profileFormData?.displayName || ''} onChange={handleProfileFormChange} className="w-full p-2 border rounded" placeholder="Your Name" />
                  <input type="text" name="headline" value={profileFormData?.headline || ''} onChange={handleProfileFormChange} className="w-full p-2 border rounded" placeholder="Your Headline" />
                  <textarea name="bio" value={profileFormData?.bio || ''} onChange={handleProfileFormChange} className="w-full p-2 border rounded" placeholder="About you"></textarea>
                  <input type="text" name="location" value={profileFormData?.location || ''} onChange={handleProfileFormChange} className="w-full p-2 border rounded" placeholder="Location" />
                  <input type="text" name="website" value={profileFormData?.website || ''} onChange={handleProfileFormChange} className="w-full p-2 border rounded" placeholder="Website URL" />
                  <input type="text" name="linkedin" value={profileFormData?.linkedin || ''} onChange={handleProfileFormChange} className="w-full p-2 border rounded" placeholder="LinkedIn Profile URL" />
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-md bg-[#0a66c2] text-white hover:bg-[#004182]">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* About Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{profile.bio || 'No bio available.'}</p>
            </div>

            {/* Work Experience Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Experience</h3>
                {isOwnProfile && (
                  <button onClick={() => openSectionModal('workExperience')} className="p-1 rounded-full hover:bg-gray-100">
                    <Plus size={22} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {profile.workExperience?.map((exp, index) => (
                  <div key={exp.id || index} className="flex">
                    <Briefcase className="w-10 h-10 mr-4 text-gray-400"/>
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-bold">{exp.title}</h4>
                        {isOwnProfile && <button onClick={() => openSectionModal('workExperience', exp, index)}><Edit size={16}/></button>}
                      </div>
                      <p>{exp.company} · {exp.location}</p>
                      <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                      <p className="mt-2 text-sm">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Education</h3>
                {isOwnProfile && (
                  <button onClick={() => openSectionModal('education')} className="p-1 rounded-full hover:bg-gray-100">
                    <Plus size={22} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {profile.education?.map((edu, index) => (
                  <div key={edu.id || index} className="flex">
                    <Award className="w-10 h-10 mr-4 text-gray-400"/>
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-bold">{edu.school}</h4>
                        {isOwnProfile && <button onClick={() => openSectionModal('education', edu, index)}><Edit size={16}/></button>}
                      </div>
                      <p>{edu.degree}, {edu.fieldOfStudy}</p>
                      <p className="text-sm text-gray-500">{edu.startYear} - {edu.endYear}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Projects</h3>
                {isOwnProfile && (
                  <button onClick={() => openSectionModal('projects')} className="p-1 rounded-full hover:bg-gray-100">
                    <Plus size={22} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {profile.projects?.map((proj, index) => (
                  <div key={proj.id || index} className="flex">
                    <FolderOpen className="w-10 h-10 mr-4 text-gray-400"/>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h4 className="font-bold">{proj.name}</h4>
                        {isOwnProfile && <button onClick={() => openSectionModal('projects', proj, index)}><Edit size={16}/></button>}
                      </div>
                      <p className="text-sm text-gray-500">{proj.date}</p>
                      <p className="mt-1 text-sm">{proj.description}</p>
                      {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center mt-1">View Project <ExternalLink className="w-4 h-4 ml-1"/></a>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Licenses & Certifications Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Licenses & Certifications</h3>
                {isOwnProfile && (
                  <button onClick={() => openSectionModal('certificates')} className="p-1 rounded-full hover:bg-gray-100">
                    <Plus size={22} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {profile.certificates?.map((cert, index) => (
                  <div key={cert.id || index}>
                    <div className="flex justify-between">
                      <h4 className="font-bold flex items-center"><FileText className="w-5 h-5 mr-2 text-gray-400"/>{cert.name}</h4>
                      {isOwnProfile && <button onClick={() => openSectionModal('certificates', cert, index)}><Edit size={16}/></button>}
                    </div>
                    <p className="text-sm text-gray-500 ml-7">{cert.issuer}</p>
                    <p className="text-sm text-gray-500 ml-7">Issued {cert.date}</p>
                    {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline ml-7 flex items-center">Show credential <ExternalLink className="w-4 h-4 ml-1"/></a>}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
                {isOwnProfile && (
                  <button onClick={() => openSectionModal('skills')} className="p-1 rounded-full hover:bg-gray-100">
                    <Plus size={22} />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map(skill => (
                  <span key={skill} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Honors & Awards</h3>
                {isOwnProfile && (
                  <button onClick={() => openSectionModal('achievements')} className="p-1 rounded-full hover:bg-gray-100">
                    <Plus size={22} />
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {profile.achievements?.map((ach, index) => (
                  <div key={ach.id || index} className="flex">
                    <Award className="w-10 h-10 mr-4 text-gray-400"/>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h4 className="font-bold">{ach.title}</h4>
                        {isOwnProfile && <button onClick={() => openSectionModal('achievements', ach, index)}><Edit size={16}/></button>}
                      </div>
                      <p className="text-sm text-gray-500">Issued by {ach.issuer} · {ach.date}</p>
                      {ach.description && <p className="mt-1 text-sm">{ach.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>



            {/* Posts Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Posts</h3>
              <div className="space-y-6">
                {userPosts.length > 0 ? (
                  userPosts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                  <p className="text-gray-500">This user hasn't posted anything yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {isOwnProfile && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Eye className="w-5 h-5 mr-3 text-[#0a66c2]" />
                    <span><span className="font-bold">{profileViews}</span> profile views</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <TrendingUp className="w-5 h-5 mr-3 text-[#0a66c2]" />
                    <span><span className="font-bold">{postImpressions}</span> post impressions</span>
                  </div>
                </div>
              </div>
            )}




          </div>
        </div>

        <ProfileSectionModal 
          isOpen={isSectionModalOpen} 
          onClose={closeSectionModal} 
          title={currentSection ? `${currentSection.index !== undefined ? 'Edit' : 'Add'} ${currentSection.type.charAt(0).toUpperCase() + currentSection.type.slice(1)}` : ''}>
            {currentSection && <SectionForm 
              section={currentSection} 
              onSave={handleSectionSave} 
              onClose={closeSectionModal} 
            />}
        </ProfileSectionModal>
      </div>
    </>
  );
}