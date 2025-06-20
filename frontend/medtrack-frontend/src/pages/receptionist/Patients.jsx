import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../../shared/UserList';
import { getAllPatients } from '../../api/patients';
import { getPatientById } from '../../api/patients';

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    getAllPatients()
      .then(data => {
        // Map PatientDTO → shape for UserList
        setPatients(data.map(p => ({
          userId: p.userId,
          name:    p.name,
          surname: p.surname,
          email:   p.email,
          role:    'patient'
        })));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading patients…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6 px-4">
      <h1 className="text-2xl font-bold">Patient List</h1>
      <UserList
        users={patients}
        onViewUser={id => navigate(`/receptionist/patients/${id}`)}
      />
    </div>
  );
}
