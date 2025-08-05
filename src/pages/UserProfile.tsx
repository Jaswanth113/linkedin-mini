import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { usePosts } from '../hooks/usePosts';
import { useProfileViews } from '../hooks/useProfileViews';
import { PostCard } from '../components/Feed/PostCard';
import { 
  Edit, 
  MoreHorizontal, 
  MapPin, 
  Calendar,
  Building,
  Globe,
  Mail,
  Phone,
  Linkedin,
  GraduationCap,
  Briefcase,
  Award,
  FolderOpen,
  FileText,
  Camera,
  Plus,
  Share,
  MessageCircle,
  UserPlus,
  Eye,
  TrendingUp,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth();
  const { getProfileByUid } = useProfile();
  const { getUserPosts } = usePosts();
  const { profileViews, postImpressions } = useProfileViews(userId);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
  }, [userId]);

  const loadUserProfile = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const userProfile = await getProfileByUid(userId);
      if (userProfile) {
        setProfile(userProfile);
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const userPosts = userId ? getUserPosts(userId) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a66c2]"></div>
      </div>
    );
  }

  if (error) {
    // Show a default profile page for missing users
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-[#0a66c2] rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-3xl">?</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Unknown User</h2>
            <p className="text-gray-600 mb-6">This user profile does not exist or has not been set up yet.</p>
            <Link to="/" className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-3 px-6 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2 inline" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    // Fallback to a default profile card ONLY if truly missing
    return (
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-[#0a66c2] rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-3xl">?</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Unknown User</h2>
            <p className="text-gray-600 mb-6">This user profile does not exist or has not been set up yet.</p>
            <Link to="/" className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-3 px-6 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2 inline" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Always show all profile sections, with placeholders for empty fields
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-[#0a66c2] hover:text-[#004182] font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="relative h-56 bg-gradient-to-r from-[#0a66c2] to-[#004182]">
            {profile?.coverPhoto && (
              <img 
                src={profile.coverPhoto} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          </div>
          
          {/* Profile Info */}
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col lg:flex-row lg:items-end -mt-20 mb-8 gap-6 lg:gap-8">
              {/* Profile Picture */}
              <div className="relative flex justify-center lg:justify-start">
                <div className="w-36 h-36 bg-[#0a66c2] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  {profile?.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt={profile.displayName || 'Profile'} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-4xl">
                      {profile?.displayName?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 text-center lg:text-left min-w-0">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 truncate">
                  {profile?.displayName || 'User'}
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 mb-4 line-clamp-2">
                  {profile?.headline || 'Professional'}
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                  {profile?.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 flex-shrink-0" />
                    <span>Joined {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : new Date().getFullYear()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 flex-shrink-0" />
                    <span>{profileViews} profile views</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-end gap-3">
                {currentUser && currentUser.uid !== userId && (
                  <>
                    <button className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-3 px-6 rounded-full transition-colors text-sm">
                      <Share className="w-4 h-4 mr-2 inline" />
                      Share profile
                    </button>
                    <button className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-3 px-6 rounded-full transition-colors text-sm">
                      <MessageCircle className="w-4 h-4 mr-2 inline" />
                      Message
                    </button>
                    <button className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-3 px-6 rounded-full transition-colors text-sm">
                      <UserPlus className="w-4 h-4 mr-2 inline" />
                      Connect
                    </button>
                  </>
                )}
                <button className="p-3 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="space-y-8">
          {/* Profile Sections */}
          <div className="space-y-8">
            {/* About Section */}
            {profile?.bio && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900">About</h3>
                </div>
                <p className="text-gray-700 leading-relaxed break-words text-base whitespace-pre-wrap text-overflow-safe">{profile.bio}</p>
              </div>
            )}

            {/* Contact Info */}
            {(profile?.email || profile?.phone || profile?.website || profile?.linkedin) && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900">Contact info</h3>
                </div>
                <div className="space-y-6">
                  {profile?.email && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Mail className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                      <span className="text-base text-gray-700 break-words min-w-0 flex-1 leading-relaxed">{profile.email}</span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Phone className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                      <span className="text-base text-gray-700 min-w-0 flex-1 leading-relaxed">{profile.phone}</span>
                    </div>
                  )}
                  {profile?.website && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Globe className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-base text-[#0a66c2] hover:underline break-words min-w-0 flex-1 leading-relaxed">
                        {profile.website}
                      </a>
                    </div>
                  )}
                  {profile?.linkedin && (
                    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Linkedin className="w-6 h-6 text-gray-500 flex-shrink-0 mt-1" />
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-base text-[#0a66c2] hover:underline break-words min-w-0 flex-1 leading-relaxed">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {profile.skills.map((skill: string, index: number) => (
                    <span key={index} className="px-6 py-3 bg-[#e8f3ff] text-[#0a66c2] text-base rounded-full font-medium break-words max-w-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Section */}
            {profile?.languages && profile.languages.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900">Languages</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {profile.languages.map((language: string, index: number) => (
                    <span key={index} className="px-6 py-3 bg-[#e8f3ff] text-[#0a66c2] text-base rounded-full font-medium break-words max-w-full">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {profile?.education && profile.education.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900">Education</h3>
                </div>
                <div className="space-y-8">
                  {profile.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-4 border-[#0a66c2] pl-8 p-6 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <GraduationCap className="w-6 h-6 text-[#0a66c2] mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 break-words text-lg mb-2">{edu.school}</h4>
                          <p className="text-base text-gray-600 break-words mb-1">{edu.degree}</p>
                          <p className="text-base text-gray-500 break-words mb-1">{edu.field}</p>
                          <p className="text-base text-gray-500">{edu.startYear} - {edu.endYear || 'Present'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience Section */}
            {profile?.workExperience && profile.workExperience.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900">Experience</h3>
                </div>
                <div className="space-y-8">
                  {profile.workExperience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-4 border-[#0a66c2] pl-8 p-6 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-4">
                        <Building className="w-6 h-6 text-[#0a66c2] mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 break-words text-lg mb-2">{exp.title}</h4>
                          <p className="text-base text-gray-600 break-words mb-1">{exp.company}</p>
                          {exp.location && <p className="text-base text-gray-500 break-words mb-1">{exp.location}</p>}
                          <p className="text-base text-gray-500 mb-3">{exp.startDate} - {exp.endDate || 'Present'}</p>
                          {exp.description && (
                            <p className="text-base text-gray-700 break-words whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900">Achievements</h3>
              </div>
              {profile?.achievements && profile.achievements.length > 0 ? (
                <div className="space-y-6">
                  {profile.achievements.map((achievement: any, index: number) => (
                    <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                      <Award className="w-6 h-6 text-[#0a66c2] mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 break-words text-lg mb-2">{achievement.title}</h4>
                        <p className="text-base text-gray-600 break-words mb-1">{achievement.issuer}</p>
                        <p className="text-base text-gray-500 mb-3">{achievement.date}</p>
                        {achievement.description && (
                          <p className="text-base text-gray-700 break-words whitespace-pre-wrap leading-relaxed">{achievement.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Not provided</div>
              )}
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900">Projects</h3>
              </div>
              {profile?.projects && profile.projects.length > 0 ? (
                <div className="space-y-8">
                  {profile.projects.map((project: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-8 bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <FolderOpen className="w-6 h-6 text-[#0a66c2] mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start space-x-3 mb-4">
                            <h4 className="font-semibold text-gray-900 break-words text-lg flex-1">{project.title}</h4>
                            {project.url && (
                              <a href={project.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-5 h-5 text-[#0a66c2] flex-shrink-0" />
                              </a>
                            )}
                          </div>
                          <p className="text-base text-gray-600 break-words whitespace-pre-wrap leading-relaxed mb-3">{project.description}</p>
                          {project.technologies && project.technologies.length > 0 && (
                            <p className="text-base text-gray-500 break-words mb-2">{project.technologies.join(', ')}</p>
                          )}
                          {project.date && <p className="text-base text-gray-500">{project.date}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Not provided</div>
              )}
            </div>

            {/* Certificates Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900">Certificates</h3>
              </div>
              {profile?.certificates && profile.certificates.length > 0 ? (
                <div className="space-y-6">
                  {profile.certificates.map((cert: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-8 bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <FileText className="w-6 h-6 text-[#0a66c2] mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start space-x-3 mb-4">
                            <h4 className="font-semibold text-gray-900 break-words text-lg flex-1">{cert.title}</h4>
                            {cert.url && (
                              <a href={cert.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-5 h-5 text-[#0a66c2] flex-shrink-0" />
                              </a>
                            )}
                          </div>
                          <p className="text-base text-gray-600 break-words mb-1">{cert.issuer}</p>
                          <p className="text-base text-gray-500 mb-3">{cert.date}</p>
                          {cert.description && (
                            <p className="text-base text-gray-700 break-words whitespace-pre-wrap leading-relaxed">{cert.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Not provided</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}