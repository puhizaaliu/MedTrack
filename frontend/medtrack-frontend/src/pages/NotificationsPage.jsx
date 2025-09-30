import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from "../hooks/useNotifications";
import NotificationList from '../shared/NotificationList';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  // guard: wait for auth
  if (!user) {
    return <p className="text-center py-6">Loading user...</p>;
  }

  const base = user.role;

  const handleView = notif => {
    markAsRead(notif.id);

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
          url = `/${role}/dashboard`;
        }
        break;
    }

    if (url) {
      navigate(url);
    } else {
      console.warn("No matching URL for notification", notif);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">My Notifications</h1>
     {notifications.filter(n => !n.isRead).length > 0 && (
      <>
        <h2 className="text-lg font-semibold mb-2">Unread</h2>
        <NotificationList
          notifications={notifications.filter(n => !n.isRead)}
          onViewNotification={handleView}
          onMarkAsRead={markAsRead}
        />
      </>
    )}

    {notifications.filter(n => n.isRead).length > 0 && (
      <>
        <h2 className="text-lg font-semibold mt-6 mb-2">Read</h2>
        <NotificationList
          notifications={notifications.filter(n => n.isRead)}
          onViewNotification={handleView}
        />
      </>
    )}
    </div>
  );  
}
