import { Outlet, NavLink } from "react-router-dom";

export default function PatientLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-[#46F072]">MedTrack</div>
          <nav className="flex space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-[#46F072] font-semibold" : "hover:text-[#46F072]"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "text-[#46F072] font-semibold" : "hover:text-[#46F072]"
              }
            >
              About
            </NavLink>
            <NavLink
              to="/patient/dashboard"
              className={({ isActive }) =>
                isActive ? "text-[#46F072] font-semibold" : "hover:text-[#46F072]"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/patient/appointments"
              className={({ isActive }) =>
                isActive ? "text-[#46F072] font-semibold" : "hover:text-[#46F072]"
              }
            >
              Appointments
            </NavLink>
            <NavLink
              to="/patient/reports"
              className={({ isActive }) =>
                isActive ? "text-[#46F072] font-semibold" : "hover:text-[#46F072]"
              }
            >
              Reports
            </NavLink>
            <NavLink
              to="/logout"
              className="text-red-500 hover:underline"
            >
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
