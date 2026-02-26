import { useState, useEffect } from 'react';
import { query, where, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Listen for unread messages
    const messagesQuery = query(
      collection(db, 'messages'),
      where('toId', '==', user.uid),
      where('read', '==', false)
    );

    // Listen for new announcements
    const announcementsQuery = query(
      collection(db, 'announcements'),
      where('createdAt', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    );

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      setNotifications(prev => [
        ...prev.filter(n => n.type !== 'message'),
        ...snapshot.docs.map(doc => ({
          id: doc.id,
          type: 'message',
          ...doc.data()
        }))
      ]);
    });

    const unsubscribeAnnouncements = onSnapshot(announcementsQuery, (snapshot) => {
      setNotifications(prev => [
        ...prev.filter(n => n.type !== 'announcement'),
        ...snapshot.docs.map(doc => ({
          id: doc.id,
          type: 'announcement',
          ...doc.data()
        }))
      ]);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeAnnouncements();
    };
  }, [user]);

  useEffect(() => {
    setUnreadCount(notifications.length);
  }, [notifications]);

  return { unreadCount, notifications };
};
