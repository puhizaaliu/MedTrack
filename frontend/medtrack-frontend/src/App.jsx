import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Login from './pages/public/Login'
import Register from './pages/public/Register'

import PatientLayout from './layouts/PatientLayout'
import PatientDashboard from './pages/patient/Dashboard'
import PatientAppointments from './pages/patient/Appointments'
import BookAppointment from './pages/patient/BookAppointment'
import Reports from './pages/patient/Reports'

import ReceptionistLayout from './layouts/RecepsionistLayout'
import RecepsionistCalendar from './pages/receptionist/Calendar'  
import AppointmentRequests from './pages/receptionist/AppointmentRequests'  
import ReceptionistAppointments from './pages/receptionist/Appointments'

import DoctorLayout from './layouts/DoctorLayout' 
import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorCalendar from './pages/doctor/Calendar'
import AppointmentInProgress from './pages/doctor/AppointmentInProgress'  
import ReportForm from './pages/doctor/ReportForm'  

import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/Users'  

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
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="bookappointment" element={<BookAppointment />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      <Route path="/recepsionist" element={<ReceptionistLayout />}>
        <Route path="calendar" element={<RecepsionistCalendar />} />
        <Route path="appointmentrequests" element={<AppointmentRequests />} />
        <Route path="appointments" element={<ReceptionistAppointments />} />
      </Route>
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="calendar" element={<DoctorCalendar />} />
        <Route path="appointmentinprogress" element={<AppointmentInProgress />} />
        <Route path="reportform" element={<ReportForm />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />  
        <Route path="users" element={<UserManagement />} />  
      </Route>
    </Routes>
  )
}

export default App
