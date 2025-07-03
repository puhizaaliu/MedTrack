import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationsContext";

export default function DoctorLayout() {
  const { unreadCount } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/doctor/dashboard" className="text-2xl font-bold text-[#46F072]">
            MedTrack
          </Link>
          <nav className="flex space-x-6">
            <Link to="/doctor/dashboard" className="hover:text-[#46F072]">Dashboard</Link>
            <Link to="/doctor/calendar"  className="hover:text-[#46F072]">Calendar</Link>
            <Link to="/doctor/appointmentinprogress" className="hover:text-[#46F072]">In-Process</Link>
            <Link to="/doctor/reports" className="hover:text-[#46F072]">Reports</Link>
            <Link to="/doctor/notifications" className="relative hover:text-[#46F072]">
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-500 text-white rounded-full px-1 text-xs">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to="/login" className="hover:text-[#46F072]">Logout</Link>
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
