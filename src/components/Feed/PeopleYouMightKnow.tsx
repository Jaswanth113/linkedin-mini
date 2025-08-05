import React from 'react';
import { UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SuggestedUser {
  id: string;
  name: string;
  headline: string;
  avatar?: string;
  mutualConnections: number;
}

export function PeopleYouMightKnow() {
  // Mock data for suggested connections
  const suggestedUsers: SuggestedUser[] = [
    {
      id: 'user1',
      name: 'Sarah Johnson',
      headline: 'Software Engineer at Google',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      mutualConnections: 12
    },
    {
      id: 'user2',
      name: 'Michael Chen',
      headline: 'Product Manager at Microsoft',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      mutualConnections: 8
    },
    {
      id: 'user3',
      name: 'Emily Rodriguez',
      headline: 'UX Designer at Adobe',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      mutualConnections: 5
    },
    {
      id: 'user4',
      name: 'David Kim',
      headline: 'Data Scientist at Netflix',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      mutualConnections: 15
    },
    {
      id: 'user5',
      name: 'Lisa Wang',
      headline: 'Marketing Director at Spotify',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      mutualConnections: 3
    }
  ];

  const handleConnect = (userId: string) => {
    console.log('Connecting to user:', userId);
    // TODO: Implement connection logic
  };

  const handleDismiss = (userId: string) => {
    console.log('Dismissing user:', userId);
    // TODO: Implement dismiss logic
  };

  return (
    <div className="linkedin-card">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#000000] mb-4">People you may know</h3>
        
        <div className="space-y-4">
          {suggestedUsers.slice(0, 3).map((user) => (
            <div key={user.id} className="flex items-start space-x-3">
              <Link to={`/user/${user.id}`} className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#0a66c2] rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-lg">
                      {user.name.charAt(0)}
                    </span>
                  )}
                </div>
              </Link>
              
              <div className="flex-1 min-w-0">
                <Link to={`/user/${user.id}`} className="block">
                  <h4 className="font-semibold text-[#000000] text-sm hover:text-[#0a66c2] hover:underline">
                    {user.name}
                  </h4>
                </Link>
                <p className="text-xs text-[#666666] mb-1 line-clamp-2">{user.headline}</p>
                <p className="text-xs text-[#666666] mb-2">
                  {user.mutualConnections} mutual connection{user.mutualConnections !== 1 ? 's' : ''}
                </p>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleConnect(user.id)}
                    className="flex items-center space-x-1 bg-transparent border border-[#0a66c2] text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white px-3 py-1 rounded-full text-xs font-medium transition-colors"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Connect</span>
                  </button>
                  
                  <button
                    onClick={() => handleDismiss(user.id)}
                    className="p-1 text-[#666666] hover:text-[#000000] hover:bg-[#f3f2ef] rounded-full transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-[#d9d9d9]">
          <button className="text-sm text-[#666666] hover:text-[#0a66c2] font-medium">
            Show more
          </button>
        </div>
      </div>
    </div>
  );
}
