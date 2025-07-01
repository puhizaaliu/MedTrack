// src/pages/admin/Users.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllUsers } from '../../api/users';
import UserList from '../../shared/UserList';

const ROLE_FILTERS = [
  { key: 'All', label: 'All' },
  { key: 'Patient', label: 'Patients' },
  { key: 'Doctor', label: 'Doctors' },
  { key: 'Receptionist', label: 'Receptionists' }
];

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFiltered] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then(data => {
        setAllUsers(data);
        setFiltered(data);
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  // Apply client-side filter whenever roleFilter or allUsers changes
  useEffect(() => {
    if (roleFilter === 'All') {
      setFiltered(allUsers);
    } else {
      setFiltered(allUsers.filter(u => u.role === roleFilter));
    }
  }, [roleFilter, allUsers]);

  if (!user) {
    return <p className="text-center py-6">Loading user…</p>;
  }
  if (loading) {
    return <p className="text-center py-6">Loading users…</p>;
  }
  if (error) {
    return <p className="text-red-600 text-center py-6">{error}</p>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => navigate('/admin/users/new')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
          + New User
        </button>
      </div>

      {/* Role filter tabs */}
      <div className="flex flex-wrap gap-3">
        {ROLE_FILTERS.map(r => (
          <button
            key={r.key}
            onClick={() => setRoleFilter(r.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              roleFilter === r.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* User table */}
      <UserList
        users={filteredUsers.map(u => ({
          userId:  u.userId,
          name:    u.name,
          surname: u.surname,
          email:   u.email,
          role:    u.role
        }))}
        onViewUser={id => navigate(`/admin/users/${id}`)}
      />
    </div>
  );
}
