import React from 'react';
import { User, Calendar, FileText } from 'lucide-react';
import { PostCard } from '../Feed/PostCard';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';

export function ProfileView() {
  const { currentUser, userProfile } = useAuth();
  const { getUserPosts } = usePosts();
  
  const userPosts = currentUser ? getUserPosts(currentUser.uid) : [];

  if (!currentUser || !userProfile) {
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {userProfile.displayName}
            </h1>
            <p className="text-gray-600 mb-3">{userProfile.email}</p>
            
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Joined {formatJoinDate(userProfile.createdAt)}
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {userPosts.length} posts
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
    </div>
  );
}