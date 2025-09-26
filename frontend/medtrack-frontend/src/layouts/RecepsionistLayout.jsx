import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

export default function ReceptionistLayout() {
   const { unreadCount } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/receptionist/calendar" className="text-2xl font-bold text-emerald-600">
            MedTrack
          </Link>
          <nav className="flex space-x-6">
            {/* <Link to="/receptionist/calendar" className="hover:text-emerald-600">
              Calendar
            </Link> */}
            <Link to="/receptionist/appointments" className="hover:text-emerald-600">
              Appointments
            </Link>
            <Link to="/receptionist/doctors" className="hover:text-emerald-600">
              Doctors
            </Link><Link to="/receptionist/patients" className="hover:text-emerald-600">
              Patients
            </Link>
            <Link to="/receptionist/notifications" className="relative hover:text-emerald-600">
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-500 text-white rounded-full px-1 text-xs">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="text-red-500 hover:text-red-700">
              Logout
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <Outlet />
      </main>

      <footer className="mt-10 border-t text-sm text-gray-500 py-6 text-center">
        &copy; {new Date().getFullYear()} MedTrack. All rights reserved.
      </footer>
    </div>
  );
}
