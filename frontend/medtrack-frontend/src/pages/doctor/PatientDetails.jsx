import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById } from '../../api/patients';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPatientById(id)
      .then(data => setPatient(data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-6">Loading patient...</p>;
  if (error)   return <p className="text-red-600 text-center py-6">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline"
      >
        &larr; Back to Patients
      </button>

      <h1 className="text-2xl font-semibold text-gray-800">
        {patient.name} {patient.surname}
      </h1>

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-medium mb-4">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><strong>Phone:</strong> {patient.phone}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Address:</strong> {patient.address}</p>
          <p><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
        </div>
      </section>

      {patient.medicalInfo && (
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-medium mb-4">Medical Info</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Allergies:</strong> {patient.medicalInfo.allergies}</p>
            <p><strong>Medications:</strong> {patient.medicalInfo.medications}</p>
            <p><strong>Smoking:</strong> {patient.medicalInfo.smoking ? 'Yes' : 'No'}</p>
            <p><strong>Alcohol:</strong> {patient.medicalInfo.alcohol ? 'Yes' : 'No'}</p>
            <p><strong>Physical Activity:</strong> {patient.medicalInfo.physicalActivity}</p>
          </div>
        </section>
      )}

      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-medium mb-4">Family History</h2>
        {patient.familyHistory.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {patient.familyHistory.map(h => (
              <li key={h.historyId}>{h.conditionName}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No family history recorded.</p>
        )}
      </section>

      {/* New Chronic Diseases section */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-medium mb-4">Chronic Diseases</h2>
        {patient.chronicDiseases.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {patient.chronicDiseases.map(cd => (
              <li key={cd.diseaseId}>
                {cd.disease?.diseaseName}
                {cd.otherText && ` — ${cd.otherText}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No chronic diseases recorded.</p>
        )}
      </section>
    </div>
  );
}
