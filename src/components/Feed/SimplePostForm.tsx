import React, { useState } from 'react';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';
import { Send, AlertCircle, Check } from 'lucide-react';

export function SimplePostForm() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { createPost } = usePosts();
  const { currentUser } = useAuth();

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      showMessage('error', 'Please enter some content');
      return;
    }

    if (!currentUser) {
      showMessage('error', 'You must be logged in to post');
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting to create post with content:', content);
      console.log('Current user:', currentUser);
      
      await createPost(content);
      
      setContent('');
      showMessage('success', 'Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
      showMessage('error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="linkedin-card p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4">Create a Simple Post</h3>
      
      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
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

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
          disabled={loading}
        />
        
        <div className="flex justify-between items-center mt-3">
          <div className="text-sm text-gray-500">
            {currentUser ? `Posting as: ${currentUser.displayName || currentUser.email}` : 'Not logged in'}
          </div>
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="linkedin-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 