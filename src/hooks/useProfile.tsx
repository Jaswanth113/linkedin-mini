import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  coverPhoto?: string;
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  skills: string[];
  languages: string[];
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
  }>;
  workExperience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    url?: string;
    technologies?: string[];
    date?: string;
  }>;
  certificates: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
    url?: string;
  }>;
  profileViews: number;
  postImpressions: number;
  createdAt: Date;
  updatedAt: Date;
}

export function useProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadProfile = async () => {
    if (!currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.id));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const userProfile: UserProfile = {
          id: currentUser.id,
          email: data.email || currentUser.email,
          displayName: data.displayName || currentUser.displayName,
          profilePicture: data.profilePicture || currentUser.profilePicture,
          coverPhoto: data.coverPhoto,
          headline: data.headline,
          bio: data.bio,
          location: data.location,
          phone: data.phone,
          website: data.website,
          linkedin: data.linkedin,
          skills: data.skills || [],
          languages: data.languages || [],
          education: data.education || [],
          workExperience: data.workExperience || [],
          achievements: data.achievements || [],
          projects: data.projects || [],
          certificates: data.certificates || [],
          profileViews: data.profileViews || 0,
          postImpressions: data.postImpressions || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
        setProfile(userProfile);
      } else {
        // Create default profile
        const defaultProfile: UserProfile = {
          id: currentUser.id,
          email: currentUser.email,
          displayName: currentUser.displayName,
          profilePicture: currentUser.profilePicture,
          skills: [],
          languages: [],
          education: [],
          workExperience: [],
          achievements: [],
          projects: [],
          certificates: [],
          profileViews: 0,
          postImpressions: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setProfile(defaultProfile);
        await setDoc(doc(db, 'users', currentUser.id), defaultProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile || !currentUser) return;

    try {
      const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
      setProfile(updatedProfile);
      
      await updateDoc(doc(db, 'users', currentUser.id), {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const getProfileByUid = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: uid,
          email: data.email || '',
          displayName: data.displayName || 'Unknown User',
          profilePicture: data.profilePicture,
          coverPhoto: data.coverPhoto,
          headline: data.headline,
          bio: data.bio,
          location: data.location,
          phone: data.phone,
          website: data.website,
          linkedin: data.linkedin,
          skills: data.skills || [],
          languages: data.languages || [],
          education: data.education || [],
          workExperience: data.workExperience || [],
          achievements: data.achievements || [],
          projects: data.projects || [],
          certificates: data.certificates || [],
          profileViews: data.profileViews || 0,
          postImpressions: data.postImpressions || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      } else {
        // If user document doesn't exist, create a basic profile
        const basicProfile: UserProfile = {
          id: uid,
          email: '',
          displayName: 'User',
          skills: [],
          languages: [],
          education: [],
          workExperience: [],
          achievements: [],
          projects: [],
          certificates: [],
          profileViews: 0,
          postImpressions: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Create the document in Firestore
        await setDoc(doc(db, 'users', uid), basicProfile);
        return basicProfile;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  // CRUD operations for profile sections
  const addSkill = async (skill: string) => {
    if (!profile) return;
    await updateProfile({
      skills: [...profile.skills, skill]
    });
  };

  const removeSkill = async (skill: string) => {
    if (!profile) return;
    await updateProfile({
      skills: profile.skills.filter(s => s !== skill)
    });
  };

  const addLanguage = async (language: string) => {
    if (!profile) return;
    await updateProfile({
      languages: [...profile.languages, language]
    });
  };

  const removeLanguage = async (language: string) => {
    if (!profile) return;
    await updateProfile({
      languages: profile.languages.filter(l => l !== language)
    });
  };

  const addEducation = async (education: UserProfile['education'][0]) => {
    if (!profile) return;
    await updateProfile({
      education: [...profile.education, education]
    });
  };

  const updateEducation = async (index: number, education: UserProfile['education'][0]) => {
    if (!profile) return;
    const updatedEducation = [...profile.education];
    updatedEducation[index] = education;
    await updateProfile({ education: updatedEducation });
  };

  const removeEducation = async (index: number) => {
    if (!profile) return;
    await updateProfile({
      education: profile.education.filter((_, i) => i !== index)
    });
  };

  const addWorkExperience = async (experience: UserProfile['workExperience'][0]) => {
    if (!profile) return;
    await updateProfile({
      workExperience: [...profile.workExperience, experience]
    });
  };

  const updateWorkExperience = async (index: number, experience: UserProfile['workExperience'][0]) => {
    if (!profile) return;
    const updatedExperience = [...profile.workExperience];
    updatedExperience[index] = experience;
    await updateProfile({ workExperience: updatedExperience });
  };

  const removeWorkExperience = async (index: number) => {
    if (!profile) return;
    await updateProfile({
      workExperience: profile.workExperience.filter((_, i) => i !== index)
    });
  };

  const addAchievement = async (achievement: Omit<UserProfile['achievements'][0], 'id'>) => {
    if (!profile) return;
    const newAchievement = {
      id: Date.now().toString(),
      ...achievement
    };
    await updateProfile({
      achievements: [...profile.achievements, newAchievement]
    });
  };

  const updateAchievement = async (achievementId: string, updates: Partial<UserProfile['achievements'][0]>) => {
    if (!profile?.achievements) return;
    const updatedAchievements = profile.achievements.map(achievement =>
      achievement.id === achievementId ? { ...achievement, ...updates } : achievement
    );
    await updateProfile({ achievements: updatedAchievements });
  };

  const removeAchievement = async (achievementId: string) => {
    if (!profile?.achievements) return;
    await updateProfile({
      achievements: profile.achievements.filter(achievement => achievement.id !== achievementId)
    });
  };

  const addProject = async (project: Omit<UserProfile['projects'][0], 'id'>) => {
    if (!profile) return;
    const newProject = {
      id: Date.now().toString(),
      ...project
    };
    await updateProfile({
      projects: [...profile.projects, newProject]
    });
  };

  const updateProject = async (projectId: string, updates: Partial<UserProfile['projects'][0]>) => {
    if (!profile?.projects) return;
    const updatedProjects = profile.projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    );
    await updateProfile({ projects: updatedProjects });
  };

  const removeProject = async (projectId: string) => {
    if (!profile?.projects) return;
    await updateProfile({
      projects: profile.projects.filter(project => project.id !== projectId)
    });
  };

  const addCertificate = async (certificate: Omit<UserProfile['certificates'][0], 'id'>) => {
    if (!profile) return;
    const newCertificate = {
      id: Date.now().toString(),
      ...certificate
    };
    await updateProfile({
      certificates: [...profile.certificates, newCertificate]
    });
  };

  const updateCertificate = async (certificateId: string, updates: Partial<UserProfile['certificates'][0]>) => {
    if (!profile?.certificates) return;
    const updatedCertificates = profile.certificates.map(certificate =>
      certificate.id === certificateId ? { ...certificate, ...updates } : certificate
    );
    await updateProfile({ certificates: updatedCertificates });
  };

  const removeCertificate = async (certificateId: string) => {
    if (!profile?.certificates) return;
    await updateProfile({
      certificates: profile.certificates.filter(certificate => certificate.id !== certificateId)
    });
  };

  return {
    profile,
    loading,
    updateProfile,
    getProfileByUid,
    addSkill,
    removeSkill,
    addLanguage,
    removeLanguage,
    addEducation,
    updateEducation,
    removeEducation,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addAchievement,
    updateAchievement,
    removeAchievement,
    addProject,
    updateProject,
    removeProject,
    addCertificate,
    updateCertificate,
    removeCertificate
  };
} 