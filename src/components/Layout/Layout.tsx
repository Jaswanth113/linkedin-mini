import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { useProfile } from '../../hooks/useProfile';
import { useAuth } from '../../hooks/useAuth';
import { useProfileViews } from '../../hooks/useProfileViews';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { currentUser, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile(currentUser?.id);
  const { profileViews, postImpressions } = useProfileViews(currentUser?.id);
  
  // Only show right sidebar on home page
  const showRightSidebar = location.pathname === '/';

  // Show loading state while auth or profile is loading
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0a66c2]"></div>
      </div>
    );
  }

  // If no user is authenticated, don't render the layout
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Header />
      <main className="max-w-[1128px] mx-auto px-6 py-6">
        <div className={`grid grid-cols-1 gap-6 ${
          showRightSidebar ? 'lg:grid-cols-12' : 'lg:grid-cols-9'
        }`}>
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-[72px] space-y-2">
              {/* Profile Card */}
              <div className="linkedin-card overflow-hidden">
                {/* Cover Image */}
                <div className="h-[54px] bg-gradient-to-r from-[#0a66c2] to-[#004182] relative">
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-[72px] h-[72px] bg-[#0a66c2] rounded-full flex items-center justify-center border-2 border-white">
                      {profile?.profilePicture ? (
                        <img 
                          src={profile.profilePicture} 
                          alt={profile.displayName}
                          className="w-[72px] h-[72px] rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-2xl">
                          {profile?.displayName?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="pt-8 pb-4 px-3 text-center">
                  <h3 className="font-semibold text-[16px] text-[#000000] mb-1 hover:underline cursor-pointer">
                    {profile?.displayName || currentUser?.displayName || 'User'}
                  </h3>
                  <p className="text-[12px] text-[#666666] mb-4 leading-[1.33]">
                    {profile?.headline || 'Software Engineer'}
                  </p>
                </div>
                
                {/* Stats Section */}
                <div className="border-t border-[#d9d9d9] px-3 py-3">
                  <div className="text-[12px] space-y-2">
                    <div className="flex justify-between items-center hover:bg-[#f3f2ef] px-2 py-1 rounded cursor-pointer">
                      <span className="text-[#666666]">Profile viewers</span>
                      <span className="font-semibold text-[#0a66c2]">{profileViews}</span>
                    </div>
                    <div className="flex justify-between items-center hover:bg-[#f3f2ef] px-2 py-1 rounded cursor-pointer">
                      <span className="text-[#666666]">Post impressions</span>
                      <span className="font-semibold text-[#0a66c2]">{postImpressions}</span>
                    </div>
                  </div>
                </div>
                
                {/* Premium Section */}
                <div className="border-t border-[#d9d9d9] px-3 py-3">
                  <p className="text-[12px] text-[#666666] mb-2">Access exclusive tools & insights</p>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-sm"></div>
                    <span className="text-[12px] font-semibold text-[#000000]">Try Premium for free</span>
                  </div>
                </div>
              </div>

              {/* Recent Section */}
              <div className="linkedin-card px-3 py-4">
                <h3 className="font-semibold text-[16px] text-[#000000] mb-3">Recent</h3>
                <ul className="space-y-1">
                  {profile?.skills?.slice(0, 4).map((skill) => (
                    <li key={skill} className="text-[12px] text-[#666666] hover:text-[#000000] cursor-pointer py-1 px-2 hover:bg-[#f3f2ef] rounded flex items-center">
                      <span className="w-1 h-1 bg-[#666666] rounded-full mr-2"></span>
                      {skill}
                    </li>
                  )) || (
                    <>
                      <li className="text-[12px] text-[#666666] hover:text-[#000000] cursor-pointer py-1 px-2 hover:bg-[#f3f2ef] rounded flex items-center">
                        <span className="w-1 h-1 bg-[#666666] rounded-full mr-2"></span>
                        Groups
                      </li>
                      <li className="text-[12px] text-[#666666] hover:text-[#000000] cursor-pointer py-1 px-2 hover:bg-[#f3f2ef] rounded flex items-center">
                        <span className="w-1 h-1 bg-[#666666] rounded-full mr-2"></span>
                        Events
                      </li>
                      <li className="text-[12px] text-[#666666] hover:text-[#000000] cursor-pointer py-1 px-2 hover:bg-[#f3f2ef] rounded flex items-center">
                        <span className="w-1 h-1 bg-[#666666] rounded-full mr-2"></span>
                        Followed Hashtags
                      </li>
                    </>
                  )}
                </ul>
                <button className="text-[12px] text-[#666666] hover:text-[#000000] mt-2 font-medium">
                  Show more
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={showRightSidebar ? 'lg:col-span-6' : 'lg:col-span-6'}>
            {children}
          </div>

          {/* Right Sidebar - Only show on home page */}
          {showRightSidebar && (
            <div className="lg:col-span-3">
              <div className="sticky top-[72px] space-y-2">
                {/* LinkedIn News */}
                <div className="linkedin-card px-3 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-[16px] text-[#000000]">LinkedIn News</h3>
                    <button className="text-[12px] text-[#666666] hover:text-[#000000]">•••</button>
                  </div>
                  <p className="text-[12px] text-[#666666] mb-3">Top stories</p>
                  <div className="space-y-3">
                    <div className="cursor-pointer hover:bg-[#f3f2ef] p-2 rounded">
                      <p className="text-[14px] font-medium text-[#000000] mb-1">Tech industry sees major growth</p>
                      <p className="text-[12px] text-[#666666]">2h ago • 1,234 readers</p>
                    </div>
                    <div className="cursor-pointer hover:bg-[#f3f2ef] p-2 rounded">
                      <p className="text-[14px] font-medium text-[#000000] mb-1">Remote work trends continue</p>
                      <p className="text-[12px] text-[#666666]">4h ago • 892 readers</p>
                    </div>
                    <div className="cursor-pointer hover:bg-[#f3f2ef] p-2 rounded">
                      <p className="text-[14px] font-medium text-[#000000] mb-1">AI development accelerates</p>
                      <p className="text-[12px] text-[#666666]">6h ago • 2,156 readers</p>
                    </div>
                  </div>
                  <button className="text-[12px] text-[#666666] hover:text-[#000000] mt-3 font-medium flex items-center">
                    Show more
                    <span className="ml-1">↓</span>
                  </button>
                </div>

                {/* People you may know */}
                <div className="linkedin-card px-3 py-4">
                  <h3 className="font-semibold text-[16px] text-[#000000] mb-3">People you may know</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-[#0a66c2] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">JS</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-[#000000] hover:underline cursor-pointer">Jane Smith</p>
                        <p className="text-[12px] text-[#666666] mb-1">Product Manager at Tech Corp</p>
                        <p className="text-[12px] text-[#666666] mb-2">2 mutual connections</p>
                        <button className="linkedin-btn-secondary text-[12px] py-1 px-4 rounded-full">
                          Connect
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-[#0a66c2] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">MJ</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-[#000000] hover:underline cursor-pointer">Mike Johnson</p>
                        <p className="text-[12px] text-[#666666] mb-1">UX Designer at Design Studio</p>
                        <p className="text-[12px] text-[#666666] mb-2">5 mutual connections</p>
                        <button className="linkedin-btn-secondary text-[12px] py-1 px-4 rounded-full">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="text-[12px] text-[#666666] hover:text-[#000000] mt-3 font-medium flex items-center">
                    Show more
                    <span className="ml-1">↓</span>
                  </button>
                </div>

                {/* Footer */}
                <div className="px-3 py-4">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[#666666]">
                    <a href="#" className="hover:text-[#0a66c2] hover:underline">About</a>
                    <a href="#" className="hover:text-[#0a66c2] hover:underline">Accessibility</a>
                    <a href="#" className="hover:text-[#0a66c2] hover:underline">Help Center</a>
                    <a href="#" className="hover:text-[#0a66c2] hover:underline">Privacy & Terms</a>
                    <a href="#" className="hover:text-[#0a66c2] hover:underline">Ad Choices</a>
                    <a href="#" className="hover:text-[#0a66c2] hover:underline">Advertising</a>
                    <a href="#" className="hover:text-[#0a66c2] hover:underline">Business Services</a>
                    <a href="#" className="hover:text-[#0a66c2] hover:underline">Get the LinkedIn app</a>
                    <a href="#" className="hover:text-[#0a66c2] hover:underline">More</a>
                  </div>
                  <div className="mt-3 text-[12px] text-[#666666]">
                    <span>LinkedIn Corporation © 2024</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}