// src/pages/doctor/PatientsList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../../shared/UserList';
import { getAllPatients } from '../../api/patients';
import { useAuth } from '../../hooks/useAuth';

export default function PatientsList() {
  const { user } = useAuth();            // doctor info
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // fetch all users and let the server prune by role/context:
    getAllPatients()
      .then(data => {
        // Map PatientDTO → shape UserList expects
        const list = data.map(p => ({
          userId: p.userId,
          name:    p.name,
          surname: p.surname,
          email:   p.email,
          role:    'Patient'
        }));
        setPatients(list);
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [user.userId]);

  if (loading) return <p className="text-center py-6">Loading patients…</p>;
  if (error)   return <p className="text-red-600 text-center py-6">{error}</p>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
      <UserList
        users={patients}
        onViewUser={id => navigate(`/doctor/patients/${id}`)}
      />
    </div>
  );
}
