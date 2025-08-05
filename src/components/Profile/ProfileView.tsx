
import { Calendar, FileText } from 'lucide-react';
import Avatar from '../UI/Avatar';
import { PostCard } from '../Feed/PostCard';
import { PeopleYouMightKnow } from '../Feed/PeopleYouMightKnow';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { useProfile } from '../../hooks/useProfile';

export function ProfileView() {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser } = useAuth();
  const { profile: userProfile, loading: profileLoading } = useProfile(userId || currentUser?.id);
  const { getUserPosts } = usePosts();
  
  const profileId = userId || currentUser?.id;
  const userPosts = profileId ? getUserPosts(profileId) : [];

  if (profileLoading || !currentUser || !userProfile) {
    return <div>Loading...</div>;
  }

  const formatJoinDate = (date: any) => {
    if (!date) return '';
    const joinDate = date.toDate ? date.toDate() : new Date(date);
    return joinDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 md:h-48 bg-gradient-to-r from-blue-50 to-indigo-100" />
        <div className="p-6">
          <div className="relative">
            <div className="absolute -top-20 md:-top-24">
              <Avatar 
                name={userProfile.displayName} 
                className="w-28 h-28 md:w-36 md:h-36 text-5xl border-4 border-white rounded-full"
              />
            </div>
          </div>

          <div className="pt-12 md:pt-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {userProfile.displayName}
            </h1>
            <p className="text-gray-600 mb-3">{userProfile.headline || 'No headline provided'}</p>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
              <div className="flex items-center">
                 <span className="text-sm text-gray-500">{userProfile.email}</span>
              </div>
               <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Joined {formatJoinDate(userProfile.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1.5" />
                <span>{userPosts.length} posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Posts</h2>
        
        {userPosts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            You haven't posted anything yet. Go to the home page to create your first post!
          </p>
        ) : (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* People You Might Know */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">People you may know</h2>
        <PeopleYouMightKnow />
      </div>
    </div>
  );
}