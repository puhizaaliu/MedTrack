// src/pages/admin/AdminDashboard.jsx

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../contexts/NotificationsContext'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { notifications } = useNotifications()
  

  // You can customize this if your `user` object has more info
  const adminName = user?.name || 'Admin'

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-6 bg-gray-100 space-y-6 md:space-y-0 md:space-x-6">
      
      {/* Left Panel: Admin Navigation */}
      <div className="flex-1 bg-white rounded-lg shadow p-6 space-y-8">
        <h2 className="text-2xl font-semibold">Welcome, {adminName}!</h2>
        <nav className="space-y-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="w-full px-4 py-2 text-left bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            User Management
          </button>
          <button
            onClick={() => navigate('/admin/specializationsandservices')}
            className="w-full px-4 py-2 text-left bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Specializations & Services
          </button>
          <button
            onClick={() => navigate('/admin/appointmentsoverview')}
            className="w-full px-4 py-2 text-left bg-green-600 text-white rounded hover:bg-green-700"
          >
            Appointments
          </button>
          <button
            onClick={() => navigate('/admin/reports')}
            className="w-full px-4 py-2 text-left bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Reports
          </button>
          {/* <button
            onClick={() => navigate('/admin/notifications')}
            className="w-full px-4 py-2 text-left bg-red-600 text-white rounded hover:bg-red-700"
          >
            Notifications
          </button> */}
          <button
            onClick={() => navigate('/admin/invoices')}
            className="w-full px-4 py-2 text-left bg-red-600 text-white rounded hover:bg-red-700"
          >
            Invoice List
          </button>
        </nav>
      </div>
      {/* Right Panel: Recent Notifications
      <div className="md:w-1/3 bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-xl font-semibold">Recent Notifications</h3>
        <ul className="space-y-3">
          {notifications.slice(0, 5).map(n => (
            <li key={n.id} className="border-b pb-2">
              <p className="text-gray-800">{n.message ?? n.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
          {notifications.length === 0 && (
            <li className="text-gray-600">No notifications available.</li>
          )}
        </ul>
        <button
          onClick={() => navigate('/admin/notifications')}
          className="text-green-600 hover:underline focus:outline-none"
        >
          View all notifications
        </button>
      </div> */}
    </div>
  )
}
