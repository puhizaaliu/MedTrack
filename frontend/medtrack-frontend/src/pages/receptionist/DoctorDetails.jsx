import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById } from '../../api/doctors';

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDoctorById(id)
      .then(data => setDoctor(data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-6">Loading doctor...</p>;
  if (error)   return <p className="text-red-600 text-center py-6">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline"
      >
        &larr; Back to Doctors
      </button>
      <h1 className="text-2xl font-semibold text-gray-800">
        {doctor.name} {doctor.surname}
      </h1>
      <section className="bg-white shadow rounded-lg p-6">
        <p><strong>Phone:</strong> {doctor.phone}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Specialization:</strong> {doctor.specializationName}</p>
      </section>
    </div>
  );
}