
import { useAuth } from '../hooks/useAuth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export function TestProfileFix() {
  const { currentUser } = useAuth();

  const createMissingProfile = async () => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.id);
      await setDoc(userRef, {
        email: currentUser.email,
        displayName: currentUser.displayName || 'User',
        profilePicture: currentUser.profilePicture || '',
        bio: '',
        skills: [],
        certificates: [],
        projects: [],
        workExperience: [],
        education: [],
        achievements: [],
        createdAt: new Date().toISOString()
      }, { merge: true });
      
      alert('Profile created/updated successfully!');
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Test Profile Fix</h2>
      <button 
        onClick={createMissingProfile}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Missing Profile
      </button>
    </div>
  );
}
