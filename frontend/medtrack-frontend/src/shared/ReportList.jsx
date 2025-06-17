import React from 'react';

/**
 * komponent me i listu medical reports
 * Props:
 *  - reports: Array of { id, appointmentId, createdAt, diagnosis }
 *  - onViewReport: function(id) => void
 */
export default function ReportList({ reports, onViewReport }) {
  if (!reports || reports.length === 0) {
    return <p className="text-gray-600">No medical reports available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Report Date</th>
            <th className="px-4 py-2">Appointment ID</th>
            <th className="px-4 py-2">Diagnosis</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => {
            const date = new Date(r.createdAt).toLocaleString();
            const brief = r.diagnosis.length > 30 ? r.diagnosis.slice(0, 30) + '...' : r.diagnosis;
            return (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 align-middle">{date}</td>
                <td className="px-4 py-2 align-middle">{r.appointmentId}</td>
                <td className="px-4 py-2 align-middle">{brief}</td>
                <td className="px-4 py-2 align-middle text-right">
                  <button
                    onClick={() => onViewReport(r.id)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
