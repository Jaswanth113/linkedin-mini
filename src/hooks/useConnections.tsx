import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,

} from 'firebase/firestore';
import { useAuth } from './useAuth';

export type ConnectionStatus = 'not_connected' | 'pending_sent' | 'pending_received' | 'connected';

export interface Connection {
  id: string;
  users: [string, string];
  requesterId: string;
  status: 'pending' | 'connected';
  createdAt: any;
  updatedAt: any;
}

export function useConnections() {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  const getDocId = (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  };

  useEffect(() => {
    if (!currentUser) {
      setConnections([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'connections'),
      where('users', 'array-contains', currentUser.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userConnections = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Connection));
      setConnections(userConnections);
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch connections:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getConnectionStatus = useCallback((targetUserId: string): ConnectionStatus => {
    if (!currentUser) return 'not_connected';

    const connection = connections.find(c => c.users.includes(targetUserId));

    if (!connection) return 'not_connected';

    if (connection.status === 'connected') {
      return 'connected';
    }

    if (connection.status === 'pending') {
      return connection.requesterId === currentUser.id ? 'pending_sent' : 'pending_received';
    }

    return 'not_connected';
  }, [connections, currentUser]);

  const sendConnectionRequest = async (targetUserId: string) => {
    if (!currentUser) throw new Error('You must be logged in to connect.');

    const docId = getDocId(currentUser.id, targetUserId);
    const connectionRef = doc(db, 'connections', docId);

    await setDoc(connectionRef, {
      users: [currentUser.id, targetUserId],
      requesterId: currentUser.id,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const acceptConnectionRequest = async (requesterId: string) => {
    if (!currentUser) throw new Error('You must be logged in.');

    const docId = getDocId(currentUser.id, requesterId);
    const connectionRef = doc(db, 'connections', docId);

    await updateDoc(connectionRef, {
      status: 'connected',
      updatedAt: serverTimestamp(),
    });
  };

  const declineConnectionRequest = async (requesterId: string) => {
    if (!currentUser) throw new Error('You must be logged in.');
    const docId = getDocId(currentUser.id, requesterId);
    await deleteDoc(doc(db, 'connections', docId));
  };

  const removeConnection = async (targetUserId: string) => {
    if (!currentUser) throw new Error('You must be logged in.');
    const docId = getDocId(currentUser.id, targetUserId);
    await deleteDoc(doc(db, 'connections', docId));
  };

  return {
    connections,
    loading,
    getConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    declineConnectionRequest,
    removeConnection,
  };
}
