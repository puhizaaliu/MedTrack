import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            MedTrack
          </Link>
          <nav className="flex space-x-6">
            <Link to="/" className="hover:text-blue-500">Home</Link>
            <Link to="/about" className="hover:text-blue-500">About</Link>
            <Link to="/login" className="hover:text-blue-500">Login</Link>
            <Link to="/register" className="hover:text-blue-500">Register</Link>
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


// import { Outlet, Link } from 'react-router-dom'

// export default function PublicLayout() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white shadow p-4">
//         <nav className="flex gap-4 text-blue-600">
//           <Link to="/">Home</Link>
//           <Link to="/about">About</Link>
//           <Link to="/login">Login</Link>
//           <Link to="/register">Register</Link>
//         </nav>
//       </header>
//       <main className="p-4">
//         <p>Layout is rendering ✅</p>
//         <Outlet />
//       </main>
//     </div>
//   )
// }

