import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import NotificationsPage from './pages/NotificationsPage';
import RequireAuth from './shared/RequireAuth';

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
import ReportDetails from './pages/patient/ReportDetails' 
import MyProfile from './pages/patient/MyProfile'

import ReceptionistLayout from './layouts/RecepsionistLayout'
import RecepsionistCalendar from './pages/receptionist/Calendar'  
import AppointmentRequests from './pages/receptionist/AppointmentRequests'  
import ReceptionistAppointments from './pages/receptionist/Appointments'
import Patients from './pages/receptionist/Patients'
import ReceptionistPatientDetails from './pages/receptionist/PatientDetails'
import Doctors from './pages/receptionist/Doctors'
import DoctorDetails from './pages/receptionist/DoctorDetails'

import DoctorLayout from './layouts/DoctorLayout' 
import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorCalendar from './pages/doctor/Calendar'
import AppointmentInProgress from './pages/doctor/AppointmentInProgress'  
import ReportForm from './pages/doctor/ReportForm' 
import DoctorReportDetails from './pages/doctor/ReportDetails' 
import MyReports from './pages/doctor/MyReports' 
import PatientsList from './pages/doctor/PatientsList'
import PatientDetails from './pages/doctor/PatientDetails'  

import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/Users'  
import UserDetails from './pages/admin/UserDetails'
import SpecializationsAndServices from './pages/admin/SpecializationsAndServices'
import AppointmentsOverview from './pages/admin/AppointmentsOverview' 
import ReportsOverview from './pages/admin/ReportsOverview' 
import AdminReportDetails from './pages/admin/ReportDetails'
function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/patient"  element={<RequireAuth allowedRoles={['Patient']}> <PatientLayout /> </RequireAuth>}>
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="bookappointment" element={<BookAppointment />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/:id" element={<ReportDetails />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="/receptionist" element={<RequireAuth allowedRoles={['Receptionist']}> <ReceptionistLayout /> </RequireAuth>}>
        <Route path="calendar" element={<RecepsionistCalendar />} />
        <Route path="appointmentrequests" element={<AppointmentRequests />} />
        <Route path="appointments" element={<ReceptionistAppointments />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<ReceptionistPatientDetails />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:if" element={<DoctorDetails />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="/doctor" element={<RequireAuth allowedRoles={['Doctor']}> <DoctorLayout /> </RequireAuth>}>
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="calendar" element={<DoctorCalendar />} />
        <Route path="appointmentinprogress" element={<AppointmentInProgress />} />
        <Route path="reports" element={<MyReports />} />
        <Route path="newreport/:id" element={<ReportForm />} />
        <Route path="reports/:id" element={<DoctorReportDetails />} />
        <Route path="patients" element={<PatientsList />} />
        <Route path="patients/:id" element={<PatientDetails />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="/admin" element={<RequireAuth allowedRoles={['Admin']}>  <AdminLayout /> </RequireAuth>}>
        <Route path="dashboard" element={<AdminDashboard />} />  
        <Route path="users" element={<UserManagement />} />  
        <Route path="users/:id" element={<UserDetails />} /> 
        <Route path="specializationsandservices" element={<SpecializationsAndServices />} /> 
        <Route path="appointmentsoverview" element={<AppointmentsOverview />} />
        <Route path="reports" element={<ReportsOverview />} />
        <Route path="reports/:id" element={<AdminReportDetails />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

       {/* catch-all: redirect unknown paths to home or 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
