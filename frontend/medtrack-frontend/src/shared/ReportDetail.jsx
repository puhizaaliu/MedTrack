import React from 'react';

/**
 * Component to display a single medical report with related appointment, patient, and doctor info
 * Props:
 *  - report: MedicalReportDTO fields
 *  - appointment: AppointmentDTO fields
 *  - patient: PatientDTO fields
 *  - doctor: DoctorDTO fields
 */

// Handles either a string OR a { Year/Month/Day } or { year/month/day } object
function formatDate(d) {
  if (!d) return '';
  if (typeof d === 'string') {
    const dt = new Date(d);
    return isNaN(dt) ? d : dt.toLocaleDateString();
  }
  const day   = d.day ?? d.Day;
  const month = d.month ?? d.Month;
  const year  = d.year ?? d.Year;
  if ([day, month, year].some(x => x == null)) return '';
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

// Handles either a string OR a { Hour/Minute } or { hour/minute } object
function formatTime(t) {
  if (!t) return '';
  if (typeof t === 'string') {
    const [h, m] = t.split(':');
    return h ? `${h.padStart(2, '0')}:${(m || '00').padStart(2, '0')}` : t;
  }
  const hour   = t.hour   ?? t.Hour;
  const minute = t.minute ?? t.Minute;
  if (hour == null || minute == null) return '';
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export default function ReportDetail({ report, appointment, patient, doctor }) {
  const created = new Date(report.createdAt).toLocaleString();
  const updated = report.updatedAt
    ? new Date(report.updatedAt).toLocaleString()
    : null;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Medical Report Details</h2>

      {/* Appointment Info */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-medium text-gray-700">Appointment Information</h3>
        <div className="text-sm text-gray-600">
          <p><strong>Appointment ID:</strong> {appointment.appointmentId}</p>
          <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
          <p><strong>Time:</strong> {formatTime(appointment.time)}</p>
          <p><strong>Service:</strong> {appointment.serviceName}</p>
        </div>
      </div>

      {/* Patient Info */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-medium text-gray-700">Patient Information</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Name:</strong> {patient.name} {patient.surname}</p>
          <p><strong>Phone:</strong> {patient.phone}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Address:</strong> {patient.address}</p>
          <p><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-medium text-gray-700">Doctor Information</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Name:</strong> Dr. {doctor.name} {doctor.surname}</p>
          <p><strong>Phone:</strong> {doctor.phone}</p>
          <p><strong>Specialization:</strong> {doctor.specializationName}</p>
        </div>
      </div>

      {/* Report Info */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Report Information</h3>
        <div className="text-sm text-gray-500 flex justify-between">
          <span>Report ID: {report.id}</span>
          <span>Created: {created}</span>
        </div>
        {updated && <div className="text-sm text-gray-500">Updated: {updated}</div>}

        <div className="space-y-2 text-gray-700">
          <p><strong>Symptoms:</strong> {report.symptoms}</p>
          <p><strong>Duration:</strong> {report.symptomDuration}</p>
          <p><strong>Evolution:</strong> {report.symptomEvolution}</p>
          <p><strong>Frequency:</strong> {report.symptomFrequence}</p>
          <p><strong>Intensity:</strong> {report.symptomIntensity}/10</p>
          <p><strong>Previous Similar Symptom:</strong> {report.previousSimilarSymptom ? 'Yes' : 'No'}</p>
          <p><strong>Diagnosis:</strong> {report.diagnosis}</p>
          <p><strong>Treatment Plan:</strong> {report.treatmentPlan}</p>
        </div>
      </div>
    </div>
  );
}
