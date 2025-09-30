// src/contexts/NotificationsContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useAuth } from '../hooks/useAuth';
import { getNotifications, updateNotification } from '../api/notifications';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

export const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const seenNotificationIds = useRef(new Set());

  const apiUrl = import.meta.env.VITE_API_URL;
  const signalRUrl = apiUrl.replace(/\/api\/?$/, '');

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

    const hub = new HubConnectionBuilder()
      .withUrl(`${signalRUrl}/hubs/notifications`, {
        accessTokenFactory: () => localStorage.getItem('accessToken'),
      })
      .withAutomaticReconnect()
      .build();

    let isCurrent = true;
    
    // lifecycle events
    hub.onclose(error => {
      console.warn("🔴 SignalR connection closed.", error);
    });

    hub.onreconnecting(error => {
      console.warn("🟠 SignalR reconnecting...", error);
    });

    hub.onreconnected(connectionId => {
      console.info("🟢 SignalR reconnected.", connectionId);
    });

    getNotifications(user.userId)
      .then(list => {
        if (!isCurrent) return;
        setNotifications(list);
        setUnreadCount(list.filter(n => !n.isRead).length);
        // Add fetched IDs to seenNotificationIds so they don't trigger toasts
        list.forEach(n => seenNotificationIds.current.add(n.id));
      })
      .catch(err => console.error('Error fetching notifications', err));

    hub.on('ReceiveNotification', notif => {
      // Ignore if already seen
      if (seenNotificationIds.current.has(notif.id)) return;

      seenNotificationIds.current.add(notif.id); // mark as seen
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);

      const role = user?.role?.toLowerCase();
      let url = null;

      switch (notif.type) {
        case "AppointmentRequested":
          if (role === "receptionist") url = "/receptionist/appointments";
          break;
        case "AppointmentConfirmed":
          if (role === "patient") url = "/patient/appointments";
          break;
        case "AppointmentInProcess":
          if (role === "doctor") url = "/doctor/appointmentinprogress";
          break;
        case "NewMedicalReport":
          if (notif.medicalReportId) url = `/${role}/reports/${notif.medicalReportId}`;
          break;
        default:
          if (notif.appointmentId) {
            url = `/${role}/appointments/${notif.appointmentId}`;
          }
          break;
      }

      toast(({ closeToast }) => (
        <div
          onClick={() => {
            if (url) navigate(url);
            closeToast();
          }}
          style={{ cursor: 'pointer' }}
        >
          <strong>Njoftim i ri:</strong><br />
          {notif.message}
        </div>
      ), {
        type: 'info',
        pauseOnHover: true,
      });
    });

    hub.start().catch(err => console.error('SignalR connection failed:', err));

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
};
