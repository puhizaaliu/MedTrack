import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function ReceptionistLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/reception/calendar" className="text-2xl font-bold text-emerald-600">
            MedTrack
          </Link>
          <nav className="flex space-x-6">
            <Link to="/reception/calendar" className="hover:text-emerald-600">
              Calendar
            </Link>
            <Link to="/reception/requests" className="hover:text-emerald-600">
              Requests
            </Link>
            <Link to="/reception/appointments" className="hover:text-emerald-600">
              Appointments
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t text-sm text-gray-500 py-6 text-center">
        &copy; {new Date().getFullYear()} MedTrack. All rights reserved.
      </footer>
    </div>
  );
}
