import { CreatePost } from '../components/Feed/CreatePost';
import { PostFeed } from '../components/Feed/PostFeed';
import { PeopleYouMightKnow } from '../components/Feed/PeopleYouMightKnow';
import { NewsSection } from '../components/Feed/NewsSection';
import { useAuth } from '../hooks/useAuth';

// A simple placeholder for the profile summary
const ProfileSummaryCard = ({ user }: { user: { displayName?: string } | null }) => (
  <div className="bg-white p-4 rounded-lg shadow-md text-center">
    <div className="w-20 h-20 mx-auto bg-gray-300 rounded-full mb-2">
      {/* Placeholder for profile picture */}
    </div>
    <h3 className="font-bold text-lg">{user?.displayName || 'Guest User'}</h3>
    <p className="text-sm text-gray-500">Welcome to your dashboard!</p>
  </div>
);

export function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar */}
          <div className="hidden md:block md:col-span-1 lg:col-span-1 space-y-6">
            <ProfileSummaryCard user={currentUser} />
            <PeopleYouMightKnow />
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2 space-y-6">
            <CreatePost />
            <PostFeed />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <NewsSection />
          </div>

        </div>
      </div>
    </div>
  );
}