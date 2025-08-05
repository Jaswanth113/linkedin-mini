import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ThumbsUp, 
  MessageCircle, 
  Repeat2, 
  Send, 
  Globe,
  Trash2
} from 'lucide-react';
import Avatar from '../UI/Avatar';
import { Post } from '../../hooks/usePosts';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';
import { useProfileViews } from '../../hooks/useProfileViews';
import { useProfile } from '../../hooks/useProfile';
import { PollDisplay } from './PollDisplay';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { currentUser } = useAuth();
  const { likePost, addComment, sharePost, isPostLikedByUser, deletePost } = usePosts();
  const { profile: authorProfile, loading: authorLoading } = useProfile(post.authorId);
  const { incrementPostImpressions } = useProfileViews(post.authorId);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    incrementPostImpressions();
  }, []);

  const handleLike = async () => {
    if (!currentUser) return;
    
    try {
      await likePost(post.id);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    if (!currentUser || !newComment.trim()) return;
    
    try {
      await addComment(post.id, newComment);
      setNewComment('');
      setShowComments(true);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = async () => {
    if (!currentUser) return;
    
    try {
      await sharePost(post.id);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="linkedin-card mb-2">
      {/* Post Header */}
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {authorLoading ? (
              <div className="flex items-start space-x-2 animate-pulse">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-start space-x-2">
                <Avatar 
                  name={authorProfile?.displayName} 
                  className="w-12 h-12"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <Link 
                      to={`/user/${post.authorId}`}
                      className="font-semibold text-[#000000] text-sm hover:text-[#0a66c2] hover:underline"
                    >
                      {authorProfile?.displayName || 'User'}
                    </Link>
                    <span className="text-[#666666] text-xs">• 1st</span>
                  </div>
                  {authorProfile?.headline && (
                    <p className="text-[#666666] text-xs leading-tight truncate">{authorProfile.headline}</p>
                  )}
                  <div className="flex items-center space-x-1 text-[#666666] text-xs">
                    <span>{formatTimestamp(post.createdAt)}</span>
                    <span>•</span>
                    <Globe className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delete button for author only */}
          {currentUser?.id === post.authorId && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this post?')) {
                  deletePost(post.id);
                }
              }}
              className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors flex-shrink-0"
              title="Delete post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Post Content */}
        <div className="mb-3">
          <p className="text-[#000000] text-sm whitespace-pre-wrap break-words">{post.content}</p>
        </div>

        {/* Poll Display */}
        {post.poll && <PollDisplay post={post} />}
      </div>

      {/* Engagement Stats */}
      {(post.likes?.length > 0 || post.comments?.length > 0 || post.shares > 0) && (
        <div className="px-3 pb-2">
          <div className="flex items-center justify-between text-xs text-[#666666] pb-2 border-b border-[#d9d9d9]">
            <div className="flex items-center space-x-4">
              {post.likes?.length > 0 && (
                <div className="flex items-center space-x-1 hover:underline cursor-pointer">
                  <div className="flex items-center -space-x-1">
                    <div className="w-4 h-4 bg-[#0a66c2] rounded-full flex items-center justify-center border border-white">
                      <ThumbsUp className="w-2 h-2 text-white fill-current" />
                    </div>
                  </div>
                  <span>{post.likes.length}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {post.comments?.length > 0 && (
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="hover:underline"
                >
                  {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
                </button>
              )}
              {post.shares > 0 && (
                <span className="hover:underline cursor-pointer">
                  {post.shares} repost{post.shares !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-3 py-1">
        <div className="flex items-center">
          <button 
            onClick={handleLike}
            className={`linkedin-post-action ${
              isPostLikedByUser(post) 
                ? 'active' 
                : ''
            }`}
          >
            <ThumbsUp className={`w-5 h-5 ${
              isPostLikedByUser(post) ? 'fill-current' : ''
            }`} />
            <span className="text-sm font-medium">Like</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="linkedin-post-action"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Comment</span>
          </button>

          <button 
            onClick={handleShare}
            className="linkedin-post-action"
          >
            <Repeat2 className="w-5 h-5" />
            <span className="text-sm font-medium">Repost</span>
          </button>

          <button className="linkedin-post-action">
            <Send className="w-5 h-5" />
            <span className="text-sm font-medium">Send</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-3 pb-3 border-t border-[#d9d9d9] mt-2 pt-3">
          {/* Add Comment */}
          <div className="flex items-start space-x-2 mb-3">
            {currentUser && (
              <Avatar 
                name={currentUser.displayName} 
                className="w-8 h-8"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-[#d9d9d9] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent bg-[#f3f2ef]"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-[#0a66c2] text-white rounded-full text-xs font-medium hover:bg-[#004182] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments?.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2">
                <Avatar 
                  name={comment.authorName} 
                  className="w-8 h-8"
                />
                <div className="flex-1">
                  <div className="bg-[#f3f2ef] rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-xs text-[#000000]">{comment.authorName}</span>
                      <span className="text-xs text-[#666666]">{formatTimestamp(comment.createdAt)}</span>
                    </div>
                    <p className="text-xs text-[#000000]">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}