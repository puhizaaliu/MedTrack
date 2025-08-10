import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReportById } from '../../api/reports';
import ReportDetail from '../../shared/ReportDetail';

export default function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref for print/export area
  const printRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getReportById(id)
      .then(data => setDetail(data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // CSV Export logic (export all fields)
  const handleExportCSV = () => {
    if (!detail) return;
    const { report, appointment, patient, doctor } = detail;

    // CSV headers for all info, grouped by section for clarity
    const csvHeaders = [
      'Section,Field,Value'
    ];

    // Info rows (each row: section, field, value)
    const csvRows = [
      ['Appointment Information', 'Appointment ID', appointment.appointmentId],
      ['Appointment Information', 'Date', appointment.date ? new Date(appointment.date).toLocaleDateString() : '-'],
      ['Appointment Information', 'Time', appointment.time || ''],
      ['Appointment Information', 'Service', appointment.serviceName],

      ['Patient Information', 'Name', patient.name + ' ' + patient.surname],
      ['Patient Information', 'Phone', patient.phone],
      ['Patient Information', 'Email', patient.email],
      ['Patient Information', 'Address', patient.address],
      ['Patient Information', 'Date of Birth', patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '-'],
      ['Patient Information', 'Gender', patient.gender],

      ['Doctor Information', 'Name', 'Dr. ' + doctor.name + ' ' + doctor.surname],
      ['Doctor Information', 'Phone', doctor.phone],
      ['Doctor Information', 'Email', doctor.email],
      ['Doctor Information', 'Specialization', doctor.specializationName],

      ['Report Information', 'Report ID', report.id],
      ['Report Information', 'Created', report.createdAt ? new Date(report.createdAt).toLocaleString() : ''],
      ['Report Information', 'Symptoms', report.symptoms],
      ['Report Information', 'Duration', report.symptomDuration],
      ['Report Information', 'Evolution', report.symptomEvolution],
      ['Report Information', 'Frequency', report.symptomFrequence],
      ['Report Information', 'Intensity', report.symptomIntensity],
      ['Report Information', 'Previous Similar Symptom', report.previousSimilarSymptom ? 'Yes' : 'No'],
      ['Report Information', 'Diagnosis', report.diagnosis],
      ['Report Information', 'Treatment Plan', report.treatmentPlan],
    ];

    // Build CSV string
    const csvString = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell =>
        typeof cell === 'string' && cell.includes(',') ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(',')),
    ].join('\n');

    // Export as CSV
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'medical_report_full.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Print logic using new window
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=700,width=900');
    printWindow.document.write(`
      <html>
        <head>
          <title>Medical Report</title>
          <style>
            body { font-family: system-ui, Arial, sans-serif; padding: 2rem; color: #000; background: #fff; }
            @media print { button { display: none !important; } }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (loading)   return <p className="text-center py-6">Loading report...</p>;
  if (error)     return <p className="text-red-600 text-center py-6">{error}</p>;
  if (!detail)   return <p className="text-center py-6">No report found.</p>;

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline"
      >
        &larr; Back to Reports
      </button>

      {/* Print/Export buttons */}
      <div className="flex gap-3 mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleExportCSV}
        >
          Export
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>

      {/* Print/export area */}
      <div ref={printRef}>
        <ReportDetail
          report={detail.report}
          appointment={detail.appointment}
          patient={detail.patient}
          doctor={detail.doctor}
        />
      </div>
    </div>
  );
}
