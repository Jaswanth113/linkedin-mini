import { useState, useEffect } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuth';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../UI/Avatar';
import { UserProfile } from '../../hooks/useProfile';
import { useConnections, ConnectionStatus } from '../../hooks/useConnections';

export function PeopleYouMightKnow() {
  const { currentUser } = useAuth();
  const {
    getConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection,
    loading: connectionsLoading,
  } = useConnections();
  const [suggestedUsers, setSuggestedUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const usersCollection = collection(db, 'profiles');
        const q = query(usersCollection, limit(10)); // Fetch more to have options for filtering
        const usersSnapshot = await getDocs(q);
        const usersList = usersSnapshot.docs
          .map(doc => doc.data() as UserProfile)
          .filter(user => user.id !== currentUser.id) // Filter out the current user
          .slice(0, 5); // Take the first 5
        setSuggestedUsers(usersList);
      } catch (error) {
        console.error('Error fetching suggested users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);

  const handleDismiss = (userId: string) => {
    console.log('Dismissing user:', userId);
    // TODO: Implement dismiss logic
  };

  return (
    <div className="linkedin-card">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#000000] mb-4">People you may know</h3>
        <div className="space-y-4">
          {(connectionsLoading || loading) ? (
            <p className="text-xs text-gray-500">Loading suggestions...</p>
          ) : suggestedUsers.length === 0 ? (
            <p className="text-xs text-gray-500">No new suggestions right now.</p>
          ) : (
            suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-start space-x-3">
                <Link to={`/user/${user.id}`} className="flex-shrink-0">
                  <Avatar 
                    name={user.displayName} 
                    className="w-12 h-12"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/user/${user.id}`} className="block">
                    <h4 className="font-semibold text-[#000000] text-sm hover:text-[#0a66c2] hover:underline">
                      {user.displayName}
                    </h4>
                  </Link>
                  <p className="text-xs text-[#666666] mb-1 line-clamp-2">{user.headline || 'No headline'}</p>

                  <div className="flex items-center space-x-2">
                    {renderConnectButton(getConnectionStatus(user.id), user.id)}

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
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[#d9d9d9]">
          <button className="text-sm text-[#666666] hover:text-[#0a66c2] font-medium">
            Show more
          </button>
        </div>
      </div>
    </div>
  );

  function renderConnectButton(status: ConnectionStatus, targetUserId: string) {
    switch (status) {
      case 'not_connected':
        return (
          <button
            onClick={() => sendConnectionRequest(targetUserId)}
            className="px-3 py-1 text-sm font-semibold text-[#0a66c2] border border-[#0a66c2] rounded-full hover:bg-[#e6f0f8]"
          >
            Connect
          </button>
        );
      case 'pending_sent':
        return (
          <button
            disabled
            className="px-3 py-1 text-sm font-semibold text-gray-500 border border-gray-300 rounded-full cursor-not-allowed"
          >
            Pending
          </button>
        );
      case 'pending_received':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => acceptConnectionRequest(targetUserId)}
              className="px-3 py-1 text-sm font-semibold text-green-600 border border-green-600 rounded-full hover:bg-green-50"
            >
              Accept
            </button>
            <button
              onClick={() => declineConnectionRequest(targetUserId)}
              className="p-1.5 rounded-full hover:bg-gray-200"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        );
      case 'connected':
        return (
          <button
            onClick={() => removeConnection(targetUserId)}
            className="px-3 py-1 text-sm font-semibold text-gray-700 border border-gray-400 rounded-full hover:bg-gray-100"
          >
            Connected
          </button>
        );
      default:
        return null;
    }
  }
}
