import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById }    from '../../api/users';
import { getPatientById } from '../../api/patients';
import { getDoctorById }  from '../../api/doctors';

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    getUserById(id)
      .then(u => {
        setUser(u);
        if (u.role === 'Patient') {
          return getPatientById(id).then(setProfile);
        }
        if (u.role === 'Doctor') {
          return getDoctorById(id).then(setProfile);
        }
        // No extra profile for Admin/Receptionist
        return Promise.resolve();
      })
      .catch(e => {
        setError(e.response?.data?.message || e.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-6">Loading user…</p>;
  if (error)   return <p className="text-red-600 text-center py-6">{error}</p>;
  if (!user)   return <p className="text-center py-6">User not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <Link
        to="/admin/users"
        className="text-blue-600 hover:underline"
      >
        ← Back to Users
      </Link>

      <h1 className="text-2xl font-bold">
        {user.name} {user.surname}
      </h1>

      <div className="bg-white p-6 rounded shadow space-y-2">
        <p><strong>Parent Name:</strong> {user.parentName}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p>
          <strong>Date of Birth:</strong>{' '}
          {new Date(user.dateOfBirth).toLocaleDateString()}
        </p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {user.role === 'Patient' && profile && (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-semibold">Medical Info</h2>
          <p><strong>Allergies:</strong> {profile.medicalInfo?.allergies}</p>
          <p><strong>Medications:</strong> {profile.medicalInfo?.medications}</p>
          <p>
            <strong>Smoking:</strong>{' '}
            {profile.medicalInfo?.smoking ? 'Yes' : 'No'}
          </p>
          <p><strong>Alcohol:</strong> {profile.medicalInfo?.alcohol}</p>
          <p>
            <strong>Physical Activity:</strong>{' '}
            {profile.medicalInfo?.physicalActivity}
          </p>

          {profile.familyHistory?.length > 0 && (
            <>
              <h2 className="text-xl font-semibold">Family History</h2>
              <ul className="list-disc list-inside">
                {profile.familyHistory.map(fh => (
                  <li key={fh.historyId}>{fh.conditionName}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {user.role === 'Doctor' && profile && (
        <div className="bg-white p-6 rounded shadow space-y-2">
          <h2 className="text-xl font-semibold">Doctor Info</h2>
          <p><strong>Specialization:</strong> {profile.specializationName}</p> :contentReference[oaicite:0]{index=0}
        </div>
      )}
    </div>
  );
}
