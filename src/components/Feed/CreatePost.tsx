import React, { useState } from 'react';
import { 
  BarChart3, 
  Smile,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { usePosts } from '../../hooks/usePosts';
import { Toast } from '../UI/Toast';

export function CreatePost() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { createPost } = usePosts();
  const { profile, loading: profileLoading } = useProfile();

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!content.trim()) {
      showToast('error', 'Please add some content to your post.');
      return;
    }

    try {
      setLoading(true);
      await createPost(content);
      setContent('');
      showToast('success', 'Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post. Please try again.';
      showToast('error', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Don't render if profile is still loading
  if (profileLoading) {
    return (
      <div className="linkedin-card p-4 mb-2">
        <div className="animate-pulse">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-12 bg-gray-300 rounded-full mb-3"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="linkedin-card mb-2">
      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-[#0a66c2] rounded-full flex items-center justify-center flex-shrink-0">
            {profile?.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt={profile.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-lg">
                {profile?.displayName?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start a post"
                  rows={3}
                  className="w-full p-3 border border-[#d9d9d9] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] bg-white text-[#000000] placeholder-[#666666] text-sm"
                  disabled={loading}
                />
                {content.length > 0 && (
                  <div className="absolute bottom-2 right-2">
                    <Smile className="w-5 h-5 text-[#666666] cursor-pointer hover:text-[#0a66c2]" />
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#d9d9d9]">
          <div className="flex items-center space-x-1">
            <button
              type="button"
              className="flex items-center space-x-2 text-[#666666] hover:bg-[#f3f2ef] px-3 py-2 rounded transition-colors"
              disabled={loading}
              title="Create a poll"
            >
              <BarChart3 className="w-5 h-5 text-[#378fe9]" />
              <span className="text-sm font-medium hidden sm:inline">Poll</span>
            </button>
            
            <button
              type="button"
              className="flex items-center space-x-2 text-[#666666] hover:bg-[#f3f2ef] px-3 py-2 rounded transition-colors"
              disabled={loading}
              title="Add trending topic"
            >
              <TrendingUp className="w-5 h-5 text-[#5f9b41]" />
              <span className="text-sm font-medium hidden sm:inline">Trending</span>
            </button>
            
            <button
              type="button"
              className="flex items-center space-x-2 text-[#666666] hover:bg-[#f3f2ef] px-3 py-2 rounded transition-colors"
              disabled={loading}
              title="Ask a question"
            >
              <MessageSquare className="w-5 h-5 text-[#c37d16]" />
              <span className="text-sm font-medium hidden sm:inline">Question</span>
            </button>
          </div>
          
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="linkedin-btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm px-6 py-2"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}