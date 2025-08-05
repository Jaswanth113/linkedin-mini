import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Home, 
  Users, 
  Briefcase, 
  MessageCircle, 
  Bell, 
  User,
  ChevronDown,
  Grid3X3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

export function Header() {
  const { currentUser, logout } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't render header if user is not authenticated
  if (!currentUser) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-[#d9d9d9] sticky top-0 z-50">
      <div className="max-w-[1128px] mx-auto px-6">
        <div className="flex items-center justify-between h-[52px]">
          {/* Left section - Logo and Search */}
          <div className="flex items-center space-x-2 flex-1">
            {/* LinkedIn Logo */}
            <Link to="/" className="flex-shrink-0 mr-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#0a66c2] rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">in</span>
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-[280px]">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-[#666666]" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="block w-full pl-10 pr-3 py-2 border-0 rounded-sm leading-5 bg-[#edf3f8] placeholder-[#666666] focus:outline-none focus:placeholder-[#999999] focus:ring-1 focus:ring-[#0a66c2] focus:bg-white text-sm h-[34px]"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Center section - Navigation */}
          <nav className="flex items-center mx-4">
            <Link
              to="/"
              className={`linkedin-nav-item ${isActive('/') ? 'active' : ''}`}
            >
              <Home className="h-6 w-6 mb-1" />
              <span>Home</span>
            </Link>
            
            <div className="linkedin-nav-item relative">
              <Users className="h-6 w-6 mb-1" />
              <span>My Network</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#0a66c2] rounded-full"></div>
            </div>
            
            <div className="linkedin-nav-item">
              <Briefcase className="h-6 w-6 mb-1" />
              <span>Jobs</span>
            </div>
            
            <div className="linkedin-nav-item relative">
              <MessageCircle className="h-6 w-6 mb-1" />
              <span>Messaging</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#0a66c2] rounded-full"></div>
            </div>
            
            <div className="linkedin-nav-item relative">
              <Bell className="h-6 w-6 mb-1" />
              <span>Notifications</span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#0a66c2] rounded-full"></div>
            </div>
          </nav>

          {/* Right section - User menu */}
          <div className="flex items-center space-x-2">
            {/* Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className={`linkedin-nav-item ${isActive('/profile') ? 'active' : ''}`}
              >
                <div className="w-6 h-6 bg-[#0a66c2] rounded-full flex items-center justify-center mb-1">
                  {profile && !profileLoading && profile.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt={profile.displayName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-3 w-3 text-white" />
                  )}
                </div>
                <div className="flex items-center">
                  <span className="mr-1">Me</span>
                  <ChevronDown className="h-3 w-3" />
                </div>
              </button>
              
              {/* Dropdown menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-linkedin border border-[#d9d9d9] py-2 z-50 animate-in">
                  <div className="px-4 py-3 border-b border-[#d9d9d9]">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[#0a66c2] rounded-full flex items-center justify-center">
                        {profile && !profileLoading && profile.profilePicture ? (
                          <img 
                            src={profile.profilePicture} 
                            alt={profile.displayName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#000000] truncate">
                          {profile?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-[#666666] truncate">
                          {profile?.headline || 'Professional'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-[#000000] hover:bg-[#f3f2ef] transition-colors"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    View Profile
                  </Link>
                  <div className="border-t border-[#d9d9d9] my-1"></div>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-[#000000] hover:bg-[#f3f2ef] transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Apps menu */}
            <div className="linkedin-nav-item">
              <Grid3X3 className="h-6 w-6 mb-1" />
              <span>Work</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}