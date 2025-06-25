// src/pages/doctor/DoctorDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../contexts/NotificationsContext';
import { getDoctorById } from '../../api/doctors';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const [profile, setProfile] = useState(null);

  // Load the doctor's name for the welcome message
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await getDoctorById(user.userId);
        setProfile({ name: data.name, surname: data.surname });
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    })();
  }, [user]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-6 bg-gray-100 space-y-6 md:space-y-0 md:space-x-6">
      {/* Left Panel */}
      <div className="md:w-1/3 bg-white rounded-lg shadow p-6 space-y-8">
        <h2 className="text-2xl font-semibold">
          Welcome{profile ? `, Dr. ${profile.name}` : ''}!
        </h2>
        <nav className="space-y-4">
          <button
            onClick={() => navigate('/doctor/calendar')}
            className="w-full px-4 py-2 text-left bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Calendar
          </button>
          <button
            onClick={() => navigate('/doctor/reports')}
            className="w-full px-4 py-2 text-left bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            My Reports
          </button>
          <button
            onClick={() => navigate('/doctor/patients')}
            className="w-full px-4 py-2 text-left bg-green-600 text-white rounded hover:bg-green-700"
          >
            Patients List
          </button>
          <button
            onClick={() => navigate('/doctor/appointmentinprogress')}
            className="w-full px-4 py-2 text-left bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Appointments In-Progress
          </button>
        </nav>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Notifications</h3>
        <ul className="space-y-3">
          {notifications.slice(0, 5).map(n => (
            <li key={n.id} className="border-b pb-2">
              <p className="text-gray-800">{n.message || n.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
          {notifications.length === 0 && (
            <li className="text-gray-600">No notifications available.</li>
          )}
        </ul>
        <div className="mt-6">
          <button
            onClick={() => navigate('/doctor/notifications')}
            className="text-green-600 hover:underline focus:outline-none"
          >
            View all notifications
          </button>
        </div>
      </div>
    </div>
  );
}
