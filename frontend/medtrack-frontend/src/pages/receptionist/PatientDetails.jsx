import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPatientById } from '../../api/patients';
import ReportList from '../../shared/ReportList';

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    getPatientById(id)
      .then(data => setPatient(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading patient…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <Link to="/receptionist/patients" className="text-blue-600 hover:underline">
        ← Back to Patients
      </Link>
      <h1 className="text-2xl font-bold">{patient.name} {patient.surname}</h1>
      <div className="bg-white p-6 rounded shadow space-y-2">
        <p><strong>Phone:</strong> {patient.phone}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Address:</strong> {patient.address}</p>
        <p><strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
      </div>

      {/* MedicalInfo (if exists) */}
      {patient.medicalInfo && (
        <div className="bg-white p-6 rounded shadow space-y-2">
          <h2 className="text-xl font-semibold">Medical Info</h2>
          <p><strong>Allergies:</strong> {patient.medicalInfo.allergies}</p>
          <p><strong>Medications:</strong> {patient.medicalInfo.medications}</p>
          <p><strong>Smoking:</strong> {patient.medicalInfo.smoking ? 'Yes' : 'No'}</p>
          <p><strong>Alcohol:</strong> {patient.medicalInfo.alcohol}</p>
          <p><strong>Physical Activity:</strong> {patient.medicalInfo.physicalActivity}</p>
        </div>
      )}

      {/* Family History */}
      {patient.familyHistory?.length > 0 && (
        <div className="bg-white p-6 rounded shadow space-y-2">
          <h2 className="text-xl font-semibold">Family History</h2>
          <ul className="list-disc list-inside">
            {patient.familyHistory.map(fh => (
              <li key={fh.historyId}>{fh.conditionName}</li>
            ))}
          </ul>
        </div>
        
      )}
      {/* Chronic Diseases */}
      {patient.chronicDiseases?.length > 0 && (
        <div className="bg-white p-6 rounded shadow space-y-2">
          <h2 className="text-xl font-semibold">Chronic Diseases</h2>
          <ul className="list-disc list-inside">
            {patient.chronicDiseases.map((cd, idx) => (
              <li key={cd.diseaseId || idx}>
                {cd.disease?.diseaseName || "Unknown Disease"}
                {cd.otherText && <> – <span className="italic">{cd.otherText}</span></>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
