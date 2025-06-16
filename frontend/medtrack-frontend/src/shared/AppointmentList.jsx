import React from 'react';

/**
 * komponent me i listu appointments
 * Props:
 *  - appointments: Array of { appointmentId, date, time, doctorName, doctorSurname, serviceName, status }
 *  - onViewDetails: function(id) => void
 */
export default function AppointmentList({ appointments, onViewDetails }) {
  if (!appointments || appointments.length === 0) {
    return <p className="text-gray-600">No appointments found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Date & Time</th>
            <th className="px-4 py-2">Doctor</th>
            <th className="px-4 py-2">Service</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => {
            // Construct JS Date from DateOnly + TimeOnly strings
            const dateTime = new Date(`${a.date}T${a.time}`);
            const formatted = dateTime.toLocaleString();
            return (
              <tr key={a.appointmentId} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 align-middle">{formatted}</td>
                <td className="px-4 py-2 align-middle">
                  {a.doctorName} {a.doctorSurname}
                </td>
                <td className="px-4 py-2 align-middle">{a.serviceName}</td>
                <td className="px-4 py-2 align-middle capitalize">{a.status}</td>
                <td className="px-4 py-2 align-middle text-right">
                  <button
                    onClick={() => onViewDetails(a.appointmentId)}
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
