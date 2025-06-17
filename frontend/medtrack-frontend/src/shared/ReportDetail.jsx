import React from 'react';

/**
 * komponent qe paraqet nje single medical report
 * Props:
 *  - report: {
 *      id, appointmentId, createdAt, updatedAt?, symptoms,
 *      symptomDuration, symptomEvolution, symptomFrequence,
 *      symptomIntensity, previousSimilarSymptom, diagnosis,
 *      treatmentPlan }
 */
export default function ReportDetail({ report }) {
  const created = new Date(report.createdAt).toLocaleString();
  const updated = report.updatedAt ? new Date(report.updatedAt).toLocaleString() : null;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Medical Report</h2>

      <div className="text-sm text-gray-500 flex justify-between">
        <span>Report ID: {report.id}</span>
        <span>Appointment ID: {report.appointmentId}</span>
      </div>

      <div className="text-sm text-gray-500">
        <p>Created at: {created}</p>
        {updated && <p>Updated at: {updated}</p>}
      </div>

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
  );
}
