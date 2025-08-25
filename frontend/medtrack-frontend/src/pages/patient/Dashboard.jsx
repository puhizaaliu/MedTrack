import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getPatientById } from '../../api/patients';
import { getAppointmentsForPatient } from '../../api/appointments';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);

  useEffect(() => {
    if (!user) return;
      (async () => {
        try {
          if (user.role === 'Patient') {
            const data = await getPatientById(user.userId);
            setProfile(data);

            const appointments = await getAppointmentsForPatient(user.userId);
            const now = new Date();
            const upcoming = appointments
              .filter(app => 
                // new Date(app.date) > now && 
                (app.status === "Konfirmuar" || app.status === "Confirmed")
              )
              .sort((a, b) => new Date(a.date) - new Date(b.date));
            setNextAppointment(upcoming[0] || null);
          }
        } catch (err) {
          console.error('Failed to load profile or appointments', err);
        }
      })();
    }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-8">
        {/* Left/Top - Profile & Quick Actions */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl font-bold text-green-600 shadow">
              {profile?.name?.[0] || 'P'}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Welcome{profile ? `, ${profile.name}` : ''}!</h2>
              <p className="text-gray-500">{profile?.email}</p>
            </div>
          </div>
          <div className="space-y-3 w-full">
            <button
              onClick={() => navigate('/patient/bookappointment')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
            >
              Book Appointment
            </button>
            <button
              onClick={() => navigate('/patient/appointments')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-green-700 transition"
            >
              My Appointments
            </button>
            <button
              onClick={() => navigate('/patient/reports')}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-purple-700 transition"
            >
              My Reports
            </button>
            <button
              onClick={() => navigate('/patient/profile')}
              className="w-full bg-gray-200 text-green-500 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right/Bottom - Next Appointment & Health Tips */}
        <div className="flex-1 flex flex-col gap-8 justify-between">
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm mb-4">
            <h3 className="text-xl font-semibold mb-2">Your Next Appointment</h3>
            {nextAppointment ? (
              <div>
                <div className="text-lg">{new Date(nextAppointment.date).toLocaleString()}</div>
                <div className="text-gray-700">Doctor: {nextAppointment.doctorName} {nextAppointment.doctorSurname}</div>
              </div>
            ) : (
              <div className="text-gray-400">No appointments scheduled.</div>
            )}
          </div>
          <div className="bg-green-50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Health Tip</h3>
            <div className="text-gray-700">
              Remember to drink enough water every day and move regularly for better health!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
