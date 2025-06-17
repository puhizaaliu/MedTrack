// src/contexts/NotificationsContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useAuth } from '../hooks/useAuth';
import { getNotifications, updateNotification } from '../api/notifications';

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);

  useEffect(() => {
    if (!user) return;

    // 1) Initial load from the API
    getNotifications(user.userId)
      .then(list => {
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.isRead).length);
      })
      .catch(console.error);

    // 2) Open SignalR connection
    const hub = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL.replace(/^http/, 'ws')}/hubs/notifications`, {
        accessTokenFactory: () => localStorage.getItem('accessToken')
      })
      .withAutomaticReconnect()
      .build();

    hub.on('ReceiveNotification', notif => {
      setNotifications(current => [notif, ...current]);
      setUnreadCount(count => count + 1);
    });

    hub.start().catch(console.error);
    return () => hub.stop();
  }, [user]);

  const markAsRead = id => {
    updateNotification(id, { isRead: true }).catch(console.error);
    setNotifications(current =>
      current.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount(count => Math.max(0, count - 1));
  };

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
