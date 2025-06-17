import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../contexts/NotificationsContext';
import NotificationList from '../shared/NotificationList';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  // guard: wait for auth
  if (!user) {
    return <p className="text-center py-6">Loading user...</p>;
  }

  const base = user.role; // now safe to read

  const handleView = id => {
    const n = notifications.find(x => x.id === id);
    markAsRead(id);

    // Navigate based on payload
    if (n.appointmentId) {
      navigate(`/${base}/appointments/${n.appointmentId}`);
    } else if (n.medicalReportId) {
      navigate(`/${base}/reports/${n.medicalReportId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">My Notifications</h1>
      <NotificationList
        notifications={notifications}
        onViewNotification={handleView}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
}
