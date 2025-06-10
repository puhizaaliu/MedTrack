import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Faqet publike
import Home from './pages/Common/Home';
import About from './pages/Common/About';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Komponent per “protected routes”
function RequireAuth({ children }) {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Private Layout */}
        <Route element={<RequireAuth><MainLayout/></RequireAuth>}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* ma vone i shtoj nested routes per Patient, Doctor, Reception, Admin */}
        </Route>

        {/* Faqja 404 */}
        <Route path="*" element={<p className="p-6">404 - Page Not Found</p>} />
      </Routes>
    </BrowserRouter>
  );
}
