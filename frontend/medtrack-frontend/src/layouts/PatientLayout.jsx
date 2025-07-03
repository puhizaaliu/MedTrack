import React from "react";
import { Outlet, NavLink } from "react-router-dom";
//import { useNotifications } from "../contexts/NotificationsContext";

export default function PatientLayout() {
  // const { unreadCount } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-[#46F072]">MedTrack</div>
          <nav className="flex space-x-6">
            <NavLink to="/patient/dashboard" className={({ isActive }) =>
              isActive ? "text-[#46F072] font-semibold" : "hover:text-[#46F072]"
            }>
              Dashboard
            </NavLink>
            <NavLink to="/patient/appointments" className={({ isActive }) =>
              isActive ? "text-[#46F072] font-semibold" : "hover:text-[#46F072]"
            }>
              Appointments
            </NavLink>
            <NavLink to="/patient/reports" className={({ isActive }) =>
              isActive ? "text-[#46F072] font-semibold" : "hover:text-[#46F072]"
            }>
              Reports
            </NavLink>
            {/* <NavLink to="/patient/notifications" className="relative">
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-500 text-white rounded-full px-1 text-xs">
                  {unreadCount}
                </span>
              )}
            </NavLink> */}
            <NavLink to="/patient/profile" className={({ isActive }) =>
              isActive ? "text-[#46F072] font-semibold" : "hover:text-[#46F072]"
            }>
              Profile
            </NavLink>
            <NavLink to="/login" className="text-red-500 hover:underline">
              Logout
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
