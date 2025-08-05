import { PostCard } from './PostCard';
import { usePosts } from '../../hooks/usePosts';

export function PostFeed() {
  const { posts, loading } = usePosts();

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="linkedin-card p-4">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-20 bg-gray-300 rounded mb-4"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 feed-container">
      {/* Sort by */}
      <div className="linkedin-card p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#666666]">Sort by:</span>
            <button className="text-sm font-medium text-[#000000] hover:text-[#0a66c2]">
              Top
            </button>
          </div>
          <button className="text-sm text-[#666666] hover:text-[#0a66c2]">
            Recent
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="linkedin-card p-8 text-center">
          <div className="w-16 h-16 bg-[#f3f2ef] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-[18px] font-semibold text-[#000000] mb-2">Welcome to your feed!</h3>
          <p className="text-[14px] text-[#666666] mb-4 max-w-md mx-auto">
            This is where you'll see updates from your network. Start by creating your first post to share your thoughts with the community.
          </p>
          <p className="text-[12px] text-[#666666]">No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  );
}