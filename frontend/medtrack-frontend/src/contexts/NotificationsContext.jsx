// src/contexts/NotificationsContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useAuth } from '../hooks/useAuth';
import { getNotifications, updateNotification } from '../api/notifications';

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Ky është URL i API që përmban "/api"
  const apiUrl = import.meta.env.VITE_API_URL; // p.sh. "http://localhost:5130/api"
  // Hiqim segmentin "/api" për t'u përdorur me SignalR
  const signalRUrl = apiUrl.replace(/\/api\/?$/, ''); // => "http://localhost:5130"

  // Funksioni për të shënuar si të lexuar
  const markAsRead = useCallback(async (id) => {
    try {
      await updateNotification(id, { isRead: true });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    // Ndërto lidhjen SignalR me base URL-në pa "/api"
    const hub = new HubConnectionBuilder()
      .withUrl(`${signalRUrl}/hubs/notifications`, {
        accessTokenFactory: () => localStorage.getItem('accessToken'),
      })
      .withAutomaticReconnect()
      .build();

    let isCurrent = true;

    // 1) Ngarkojmë fillimisht nga API
    getNotifications(user.userId)
      .then(list => {
        if (!isCurrent) return;
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.isRead).length);
      })
      .catch(err => console.error('Error fetching notifications', err));

    // 2) Regjistrojmë listener-in për notifikatat në kohë reale
    hub.on('ReceiveNotification', notif => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // (Opsionale) Log për reconnection / close
    hub.onreconnecting(err => console.warn('SignalR reconnecting...', err));
    hub.onreconnected(id => console.log('SignalR reconnected', id));
    hub.onclose(err => {
      if (err) console.error('SignalR closed with error:', err);
      else console.log('SignalR closed gracefully.');
    });

    // Nis lidhjen
    hub.start().catch(err => console.error('SignalR connection failed:', err));

    // Cleanup: heq listener dhe mbyll lidhjen
    return () => {
      isCurrent = false;
      hub.off('ReceiveNotification');
      hub.stop();
    };
  }, [user, signalRUrl]);

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
