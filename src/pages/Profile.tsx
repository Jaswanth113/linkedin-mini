import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useProfileViews } from '../hooks/useProfileViews';
import Avatar from '../components/UI/Avatar';
import { ProfileEditor } from '../components/Profile/ProfileEditor';
import { ProfileUpdateForm } from '../components/Profile/ProfileUpdateForm';

import { 
  Edit, 
  MapPin, 
  Building,
  GraduationCap,
  Award,
  FolderOpen,
  FileText,
  Eye,
  ExternalLink,
  Plus,
  Camera
} from 'lucide-react';

export function Profile() {
  const { currentUser, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile(currentUser?.id, !!currentUser?.id);
  const { profileViews } = useProfileViews(currentUser?.id);
  const [showEditor, setShowEditor] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0a66c2]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[1128px] mx-auto px-6">
        {/* Profile Header */}
        <div className="linkedin-card overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="relative h-[200px] bg-gradient-to-r from-[#0a66c2] to-[#004182]">
            {profile?.coverPhoto && (
              <img 
                src={profile.coverPhoto} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            )}
            <button className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all">
              <Camera className="w-4 h-4 text-[#666666]" />
            </button>
          </div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6 relative">
            {/* Profile Picture */}
            <div className="relative flex justify-center lg:justify-start -mt-20">
              <div className="w-[160px] h-[160px] rounded-full border-4 border-white shadow-lg relative">
                <Avatar name={profile?.displayName} className="w-full h-full text-6xl" />
                <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-[#666666]" />
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="text-center lg:text-left pt-4">
              <div className="flex justify-end">
                 <button 
                    onClick={() => setShowUpdateForm(true)} 
                    className="p-2 hover:bg-[#f3f2ef] rounded-full transition-colors"
                  >
                    <Edit className="w-4 h-4 text-[#666666]" />
                  </button>
              </div>
              <h1 className="text-[28px] font-semibold text-[#000000] mb-1">{profile?.displayName || 'User'}</h1>
              <p className="text-[18px] text-[#666666] mb-2">{profile?.headline || 'Software Engineer'}</p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[14px] text-[#666666]">
                {profile?.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span className="text-[#0a66c2] font-medium hover:underline cursor-pointer">{profileViews} profile views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-[#0a66c2] font-medium hover:underline cursor-pointer">500+ connections</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <button className="linkedin-btn-primary text-[14px] px-6 py-2 flex items-center space-x-2">
                  <span>Open to</span>
                </button>
                <button className="linkedin-btn-secondary text-[14px] px-6 py-2 flex items-center space-x-2">
                  <span>Add profile section</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="linkedin-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-[#000000]">About</h2>
                <button 
                  onClick={() => setShowEditor(true)}
                  className="p-2 hover:bg-[#f3f2ef] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#666666]" />
                </button>
              </div>
              {profile?.bio ? (
                <p className="text-[14px] text-[#000000] leading-[1.6] whitespace-pre-wrap">
                  {profile.bio}
                </p>
              ) : (
                <div className="text-center py-6">
                  <p className="text-[14px] text-[#666666] mb-3">Add a summary to highlight your personality or work experience</p>
                  <button 
                    onClick={() => setShowEditor(true)}
                    className="linkedin-btn-secondary text-sm"
                  >
                    Add summary
                  </button>
                </div>
              )}
            </div>

            {/* Experience Section */}
            <div className="linkedin-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-[#000000]">Experience</h2>
                <button 
                  onClick={() => setShowEditor(true)}
                  className="p-2 hover:bg-[#f3f2ef] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#666666]" />
                </button>
              </div>
              
              {profile?.workExperience && profile.workExperience.length > 0 ? (
                <div className="space-y-6">
                  {profile.workExperience.map((exp, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-[#f3f2ef] rounded flex items-center justify-center flex-shrink-0">
                        <Building className="w-6 h-6 text-[#666666]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold text-[#000000] mb-1">{exp.title}</h3>
                        <p className="text-[14px] text-[#000000] mb-1">{exp.company}</p>
                        <p className="text-[12px] text-[#666666] mb-1">{exp.startDate} - {exp.endDate || 'Present'}</p>
                        {exp.location && <p className="text-[12px] text-[#666666] mb-2">{exp.location}</p>}
                        {exp.description && (
                          <p className="text-[14px] text-[#000000] leading-[1.4] whitespace-pre-wrap">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-[#666666]">Show your experience to help others get to know you better</p>
              )}
            </div>

            {/* Education Section */}
            <div className="linkedin-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-[#000000]">Education</h2>
                <button 
                  onClick={() => setShowEditor(true)}
                  className="p-2 hover:bg-[#f3f2ef] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#666666]" />
                </button>
              </div>
              
              {profile?.education && profile.education.length > 0 ? (
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-[#f3f2ef] rounded flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-[#666666]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold text-[#000000] mb-1">{edu.school}</h3>
                        <p className="text-[14px] text-[#000000] mb-1">{edu.degree}</p>
                        <p className="text-[12px] text-[#666666]">{edu.startYear} - {edu.endYear || 'Present'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-[#666666]">Add your education to help others discover you</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="linkedin-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-[#000000]">Skills</h2>
                <button 
                  onClick={() => setShowEditor(true)}
                  className="p-2 hover:bg-[#f3f2ef] rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#666666]" />
                </button>
              </div>
              
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.slice(0, 15).map((skill, index) => (
                    <span key={index} className="linkedin-skill-tag">
                      {skill}
                    </span>
                  ))}
                  {profile.skills.length > 15 && (
                    <button className="text-[14px] text-[#666666] hover:text-[#0a66c2] font-medium">
                      Show all {profile.skills.length} skills
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-[14px] text-[#666666]">Add skills to showcase your expertise</p>
              )}
            </div>

            {/* Achievements Section */}
            <div className="linkedin-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-[#000000]">Achievements</h2>
                <button onClick={() => setShowEditor(true)} className="p-2 hover:bg-[#f3f2ef] rounded-full transition-colors">
                  <Plus className="w-4 h-4 text-[#666666]" />
                </button>
              </div>
              {profile?.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-6">
                  {profile.achievements.map((ach, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-[#f3f2ef] rounded flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-[#666666]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold text-[#000000] mb-1">{ach.title}</h3>
                        <p className="text-[14px] text-[#000000] mb-1">Issued by {ach.issuer}</p>
                        <p className="text-[12px] text-[#666666]">{ach.date}</p>
                        {ach.description && <p className="text-[14px] text-[#000000] mt-2 leading-[1.4]">{ach.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-[#666666]">Showcase your awards, honors, and other achievements.</p>
              )}
            </div>

            {/* Projects Section */}
            <div className="linkedin-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-[#000000]">Projects</h2>
                <button onClick={() => setShowEditor(true)} className="p-2 hover:bg-[#f3f2ef] rounded-full transition-colors">
                  <Plus className="w-4 h-4 text-[#666666]" />
                </button>
              </div>
              {profile?.projects && profile.projects.length > 0 ? (
                <div className="space-y-6">
                  {profile.projects.map((proj, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-[#f3f2ef] rounded flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="w-6 h-6 text-[#666666]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold text-[#000000] mb-1">{proj.name}</h3>
                        {proj.date && <p className="text-[12px] text-[#666666] mb-2">{proj.date}</p>}
                        <p className="text-[14px] text-[#000000] leading-[1.4] mb-3">{proj.description}</p>
                        {proj.technologies && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {proj.technologies.map(tech => <span key={tech} className="linkedin-skill-tag text-xs">{tech}</span>)}
                          </div>
                        )}
                        {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-[#0a66c2] font-medium text-[14px] hover:underline flex items-center">Show Project <ExternalLink className="w-4 h-4 ml-1" /></a>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-[#666666]">Add projects to highlight your practical experience.</p>
              )}
            </div>

            {/* Certifications Section */}
            <div className="linkedin-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-[#000000]">Licenses & Certifications</h2>
                <button onClick={() => setShowEditor(true)} className="p-2 hover:bg-[#f3f2ef] rounded-full transition-colors">
                  <Plus className="w-4 h-4 text-[#666666]" />
                </button>
              </div>
              {profile?.certificates && profile.certificates.length > 0 ? (
                <div className="space-y-6">
                  {profile.certificates.map((cert, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-[#f3f2ef] rounded flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-[#666666]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold text-[#000000] mb-1">{cert.name}</h3>
                        <p className="text-[14px] text-[#000000] mb-1">{cert.issuer}</p>
                        <p className="text-[12px] text-[#666666]">Issued {cert.date}</p>
                        {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-[#0a66c2] font-medium text-[14px] hover:underline flex items-center mt-2">Show credential <ExternalLink className="w-4 h-4 ml-1" /></a>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-[#666666]">Add your professional licenses and certifications.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="linkedin-card p-6">
              <h2 className="text-[20px] font-semibold text-[#000000] mb-4">People Also Viewed</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-sm">User Name {i}</h4>
                      <p className="text-xs text-gray-500">User Headline {i}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="linkedin-card p-6">
              <h2 className="text-[20px] font-semibold text-[#000000] mb-4">People You May Know</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Potential Connection {i}</h4>
                      <p className="text-xs text-gray-500">Mutual Connections</p>
                      <button className="linkedin-btn-secondary text-xs mt-1 px-3 py-1">Connect</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditor && (
        <ProfileEditor profile={profile} onClose={() => setShowEditor(false)} />
      )}
      {showUpdateForm && (
        <ProfileUpdateForm 
          onClose={() => setShowUpdateForm(false)} 
          initialData={{
            displayName: profile?.displayName || '',
            headline: profile?.headline || '',
            bio: profile?.bio || '',
            location: profile?.location || ''
          }} 
        />
      )}
    </>
  );
}