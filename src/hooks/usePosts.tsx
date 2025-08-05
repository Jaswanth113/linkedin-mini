import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  orderBy,
  query,
  serverTimestamp,
  increment,
  onSnapshot,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorHeadline?: string;
  likes: string[];
  comments: Comment[];
  shares: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
}

export function usePosts() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = loadPosts();
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const loadPosts = () => {
    try {
      const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
        const fetchedPosts: Post[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedPosts.push({
            id: doc.id,
            content: data.content,
            authorId: data.authorId,
            authorName: data.authorName,
            authorAvatar: data.authorAvatar,
            authorHeadline: data.authorHeadline,
            likes: data.likes || [],
            comments: data.comments || [],
            shares: data.shares || 0,
            createdAt: data.createdAt?.toDate() || new Date()
          });
        });
        
        setPosts(fetchedPosts);
        setLoading(false);
      }, (error) => {
        console.error('Error loading posts:', error);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up posts listener:', error);
      setLoading(false);
      return undefined;
    }
  };

  const createPost = async (content: string) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      // Fetch user profile to get headline
      const userDoc = await getDoc(doc(db, 'users', currentUser.id));
      const userProfile = userDoc.exists() ? userDoc.data() : {};
      
      const postData = {
        content,
        authorId: currentUser.id,
        authorName: currentUser.displayName || 'User',
        authorAvatar: currentUser.profilePicture,
        authorHeadline: userProfile.headline || '',
        likes: [],
        comments: [],
        shares: 0,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'posts'), postData);
      // The real-time listener will automatically pick up the new post
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    if (!currentUser) return;

    try {
      const postRef = doc(db, 'posts', postId);
      const post = posts.find(p => p.id === postId);
      
      if (!post) return;
      
      const isLiked = post.likes.includes(currentUser.id);
      
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.id)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.id)
        });
      }
      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!currentUser || !content.trim()) return;

    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        content,
        authorId: currentUser.id,
        authorName: currentUser.displayName,
        authorAvatar: currentUser.profilePicture,
        createdAt: new Date()
      };

      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        comments: arrayUnion(newComment)
      });
      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const sharePost = async (postId: string) => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        shares: increment(1)
      });
      // The real-time listener will automatically update the UI
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const deletePost = async (postId: string) => {
    if (!currentUser) return;
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      if (post.authorId !== currentUser.id) return; // Only author can delete
      await deleteDoc(doc(db, 'posts', postId));
      // Real-time listener will update UI
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const getUserPosts = (userId: string) => {
    return posts.filter(post => post.authorId === userId);
  };

  const isPostLikedByUser = (post: Post) => {
    if (!currentUser) return false;
    return post.likes.includes(currentUser.id);
  };

  return {
    posts,
    loading,
    createPost,
    likePost,
    addComment,
    sharePost,
    getUserPosts,
    isPostLikedByUser,
    deletePost,
  };
} 