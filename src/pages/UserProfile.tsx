import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile, UserProfile as UserProfileType } from '../hooks/useProfile';
import { usePosts } from '../hooks/usePosts';
import { useProfileViews } from '../hooks/useProfileViews';
import { PostCard } from '../components/Feed/PostCard';
import {
  Edit,

  Award,
  FolderOpen,
  FileText,
  ExternalLink,
  Eye,
  TrendingUp,
  ArrowLeft,
  UserPlus,
  MessageCircle,
  Briefcase,
} from 'lucide-react';

export function UserProfile() {
  const [showEdit, setShowEdit] = useState(false);
  const { userId: routeUserId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth();
  const userId = routeUserId || currentUser?.id;
  const isOwnProfile = !!userId && userId === currentUser?.id;

  const { profile, loading, error, updateProfile } = useProfile(userId);
  const { getUserPosts } = usePosts();
  const { profileViews, postImpressions } = useProfileViews(userId);

  const [editableProfile, setEditableProfile] = useState<Partial<UserProfileType> | null>(null);

  useEffect(() => {
    if (profile) {
      setEditableProfile(profile);
    }
  }, [profile]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editableProfile) {
      await updateProfile(editableProfile);
    }
    setShowEdit(false);
  };

  const userPosts = userId ? getUserPosts(userId) : [];

  if (loading) {
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
            <div className="h-48 bg-gray-300">
              {profile.coverPhoto && <img src={profile.coverPhoto} alt="Cover" className="w-full h-full object-cover" />}
            </div>
            <div className="absolute top-24 left-10">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={profile.displayName || 'User'} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-gray-500">{profile.displayName?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>
            <div className="pt-4 pl-48 pr-6 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.displayName}</h1>
                  <p className="text-lg text-gray-600">{profile.headline}</p>
                  <p className="text-sm text-gray-500 mt-1">{profile.location}</p>
                </div>
                <div>
                  {isOwnProfile ? (
                    <button 
                      onClick={() => setShowEdit(true)} 
                      className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-2 px-4 rounded-full transition-colors flex items-center">
                      <Edit className="w-4 h-4 mr-2" /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <button className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold py-2 px-4 rounded-full transition-colors flex items-center">
                        <UserPlus className="w-4 h-4 mr-2" /> Connect
                      </button>
                      <button className="bg-blue-100 text-[#0a66c2] font-semibold py-2 px-4 rounded-full transition-colors flex items-center hover:bg-blue-200">
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
        {showEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-900">Edit Profile</h3>
                <button onClick={() => setShowEdit(false)} className="text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
              </div>
              <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="displayName">Display Name</label>
                  <input type="text" id="displayName" value={editableProfile?.displayName || ''} onChange={(e) => setEditableProfile({ ...editableProfile, displayName: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="headline">Headline</label>
                  <input type="text" id="headline" value={editableProfile?.headline || ''} onChange={(e) => setEditableProfile({ ...editableProfile, headline: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="bio">Bio</label>
                  <textarea id="bio" value={editableProfile?.bio || ''} onChange={(e) => setEditableProfile({ ...editableProfile, bio: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" rows={4}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profilePicture">Profile Picture URL</label>
                  <input type="text" id="profilePicture" value={editableProfile?.profilePicture || ''} onChange={(e) => setEditableProfile({ ...editableProfile, profilePicture: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="coverPhoto">Cover Photo URL</label>
                  <input type="text" id="coverPhoto" value={editableProfile?.coverPhoto || ''} onChange={(e) => setEditableProfile({ ...editableProfile, coverPhoto: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button type="button" onClick={() => setShowEdit(false)} className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#0a66c2] rounded-md hover:bg-[#004182] transition">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            {profile?.bio && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {userPosts.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Posts</h3>
                <div className="space-y-6">
                  {userPosts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {profile?.workExperience?.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Work Experience</h3>
                <ul className="space-y-6">
                  {profile.workExperience.map((job, index) => (
                    <li key={index} className="flex items-start">
                      <Briefcase className="w-10 h-10 mr-4 mt-1 text-[#0a66c2] flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800 text-lg">{job.title}</h4>
                        <p className="text-gray-700 font-medium">{job.company}</p>
                        <p className="text-gray-500 text-sm">
                          {job.startDate} - {job.endDate || 'Present'}
                          {job.location && ` · ${job.location}`}
                        </p>
                        {job.description && <p className="text-gray-600 mt-2 text-sm">{job.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profile?.projects?.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Projects</h3>
                <ul className="space-y-4">
                  {profile.projects.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FolderOpen className="w-5 h-5 mr-4 mt-1 text-[#0a66c2] flex-shrink-0" />
                      <div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0a66c2] hover:underline">View <ExternalLink className="w-3 h-3 ml-1 inline" /></a>}
                        </div>
                        <p className="text-gray-600 text-sm">{item.date}</p>
                        {item.description && <p className="text-gray-600 mt-1 text-sm">{item.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profile?.certificates?.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Licenses & Certifications</h3>
                <ul className="space-y-4">
                  {profile.certificates.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FileText className="w-5 h-5 mr-4 mt-1 text-[#0a66c2] flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-gray-600 text-sm">{item.issuer} &middot; Issued {item.date}</p>
                        {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0a66c2] hover:underline">Show Credential <ExternalLink className="w-3 h-3 ml-1 inline" /></a>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar) */}
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

            {profile?.skills?.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-[#0a66c2] text-sm font-semibold px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.achievements?.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Honors & Awards</h3>
                <ul className="space-y-4">
                  {profile.achievements.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Award className="w-5 h-5 mr-4 mt-1 text-[#0a66c2] flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.issuer} &middot; {item.date}</p>
                        {item.description && <p className="text-gray-600 mt-1 text-sm">{item.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}