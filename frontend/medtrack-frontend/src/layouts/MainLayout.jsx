import { Outlet, Link } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl mb-6">MedTrack</h2>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          {/* i shtoj masanej Dashboard, Profile etj */}
        </ul>
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
