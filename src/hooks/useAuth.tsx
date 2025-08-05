  import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface User {
  id: string;
  email: string;
  displayName: string;
  profilePicture?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Ensure user profile exists
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          // Create profile if missing
          const userData = {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'User',
            profilePicture: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=150&h=150&fit=crop&crop=face`,
            bio: '',
            skills: [],
            certificates: [],
            projects: [],
            workExperience: [],
            education: [],
            achievements: [],
            createdAt: new Date().toISOString()
          };
          await setDoc(userRef, userData);
        }

        const userData = userDoc.exists() ? userDoc.data() : {};
        
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: userData?.displayName || firebaseUser.displayName || 'User',
          profilePicture: userData?.profilePicture || firebaseUser.photoURL || ''
        };
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Ensure user profile exists
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create profile if missing
        const userData = {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || 'User',
          profilePicture: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=150&h=150&fit=crop&crop=face`,
          bio: '',
          skills: [],
          certificates: [],
          projects: [],
          workExperience: [],
          education: [],
          achievements: [],
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, userData);
      }

      const userData = userDoc.exists() ? userDoc.data() : {};
      
      const user: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userData?.displayName || userCredential.user.displayName || 'User',
        profilePicture: userData?.profilePicture || userCredential.user.photoURL || ''
      };
      
      setCurrentUser(user);
      setLoading(false);
      
      // The user will also be set in the useEffect via onAuthStateChanged
    } catch (error) {
      setLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name in Firebase Auth
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName,
        profilePicture: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?w=150&h=150&fit=crop&crop=face`,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      
      // The user will be set in the useEffect via onAuthStateChanged
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    signOut(auth);
    // The user will be cleared in the useEffect via onAuthStateChanged
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 