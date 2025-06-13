import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Login from './pages/public/Login'
import Register from './pages/public/Register'

import PatientLayout from './layouts/PatientLayout'
import PatientDashboard from './pages/patient/Dashboard';
import Appointments from './pages/patient/Appointments';
import BookAppointment from './pages/patient/BookAppointment';
import Reports from './pages/patient/Reports';
function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="/patient" element={<PatientLayout />}>
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="bookappointment" element={<BookAppointment />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}

export default App
