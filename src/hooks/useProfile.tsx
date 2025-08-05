import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  getDoc,
  setDoc,

  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Education {
  id?: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear?: string;
}

export interface WorkExperience {
  id?: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Achievement {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  url?: string;
  technologies?: string[];
  date?: string;
}

export interface Certificate {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
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
  education: Education[];
  workExperience: WorkExperience[];
  achievements: Achievement[];
  projects: Project[];
  certificates: Certificate[];
  profileViews: number;
  postImpressions: number;
  createdAt: Date;
  updatedAt: Date;
}

export function useProfile(uid: string | undefined, enabled: boolean = true) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProfileByUid = useCallback(async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
        const updatedAt = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date();

        return {
          id: uid,
          email: data.email || null,
          displayName: data.displayName || `User ${uid.substring(0, 6)}`,
          profilePicture: data.profilePicture || undefined,
          coverPhoto: data.coverPhoto || '',
          headline: data.headline || '',
          bio: data.bio || '',
          location: data.location || '',
          phone: data.phone || '',
          website: data.website || '',
          linkedin: data.linkedin || '',
          skills: data.skills || [],
          languages: data.languages || [],
          education: data.education || [],
          workExperience: data.workExperience || [],
          achievements: data.achievements || [],
          projects: data.projects || [],
          certificates: data.certificates || [],
          profileViews: data.profileViews || 0,
          postImpressions: data.postImpressions || 0,
          createdAt,
          updatedAt,
        };
      } else {
        const defaultProfile: UserProfile = {
          id: uid,
          email: null,
          displayName: `User ${uid.substring(0, 6)}`,

          coverPhoto: '',
          headline: '',
          bio: '',
          location: '',
          phone: '',
          website: '',
          linkedin: '',
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
          updatedAt: new Date(),
        };
        await setDoc(userDocRef, defaultProfile);
        return defaultProfile;
      }
    } catch (err) {
      console.error('Error fetching or creating profile:', err);
      setError('Failed to load profile.');
      return null;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      const profileData = await getProfileByUid(uid);
      setProfile(profileData);
      setLoading(false);
    };

    fetchProfile();
  }, [uid, enabled, getProfileByUid]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    try {
      const userDocRef = doc(db, 'users', profile.id);
      const currentProfileData = (await getDoc(userDocRef)).data() || {};
      const updateData = {
        ...currentProfileData,
        ...updates,
        updatedAt: new Date(),
      };

      // For array fields, ensure we are replacing the whole array if provided in updates
      if (updates.skills) updateData.skills = updates.skills;
      if (updates.languages) updateData.languages = updates.languages;
      if (updates.education) updateData.education = updates.education;
      if (updates.workExperience) updateData.workExperience = updates.workExperience;
      if (updates.achievements) updateData.achievements = updates.achievements;
      if (updates.projects) updateData.projects = updates.projects;
      if (updates.certificates) updateData.certificates = updates.certificates;

      await setDoc(userDocRef, updateData, { merge: true });
      // Refresh local profile state after update
      const updatedProfile = await getProfileByUid(profile.id);
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile.');
    }
  };

  const addSkill = (skill: string) => {
    if (!profile) return;
    updateProfile({ skills: [...profile.skills, skill] });
  };

  const removeSkill = (skill: string) => {
    if (!profile) return;
    updateProfile({ skills: profile.skills.filter((s) => s !== skill) });
  };

  const addLanguage = (language: string) => {
    if (!profile) return;
    updateProfile({ languages: [...profile.languages, language] });
  };

  const removeLanguage = (language: string) => {
    if (!profile) return;
    updateProfile({ languages: profile.languages.filter((l) => l !== language) });
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
    error,
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