import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationsContext";

export default function AdminLayout() {
  const { unreadCount } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/admin/dashboard" className="text-2xl font-bold text-green-600">
            MedTrack Admin
          </Link>
          <nav className="flex space-x-6">
            <Link to="/admin/dashboard" className="hover:text-green-600">
              Dashboard
            </Link>
            {/* <Link to="/admin/users" className="hover:text-green-600">
              User Management
            </Link>
            <Link to="/admin/specializationsandservices" className="hover:text-green-600">
              Specializations &amp; Services
            </Link>
            <Link to="/admin/appointmentsoverview" className="hover:text-green-600">
              Appointments
            </Link>
            <Link to="/admin/reports" className="hover:text-green-600">
              Reports 
            </Link> */}
            <Link to="/admin/notifications" className="relative hover:text-green-600">
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
        &copy; {new Date().getFullYear()} MedTrack Admin. All rights reserved.
      </footer>
    </div>
  );
}
