import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../../shared/UserList';
import { getAllDoctors } from '../../api/doctors';

export default function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getAllDoctors()
      .then(data => {
        setDoctors(data.map(d => ({
          userId: d.userId,
          name:    d.name,
          surname: d.surname,
          email:   d.email,
          role:    'doctor'
        })));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading doctors…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Doctor List</h1>
      <UserList
        users={doctors}
        onViewUser={id => navigate(`/receptionist/doctors/${id}`)}
      />
    </div>
  );
}
