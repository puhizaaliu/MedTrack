import React from 'react';
import { useNavigate } from "react-router-dom";

/**
 * Komponent për të listuar appointments
 * Props:
 *  - appointments: Array of { appointmentId, date, time, doctorName, doctorSurname, serviceName, status }
 *  - onViewDetails: function(id) => void
 *  - role: string (Patient, Receptionist, Admin, etc)
 *  - onMoveInProcess: function(id) => void   // new, for "Move to In-Process"
 *  - onMoveNoShow: function(id) => void     // new, for "Mark as No-Show"
 *  - onProcessPayment: function(id) => void // new, for "Process Payment" (Completed appointments)
 */
const STATUS_LABELS = {
  Kerkese: "Pending",
  Konfirmuar: "Confirmed",
  NeProces: "In-Process",
  Kryer: "Completed",
  Paguar: "Paid",
  NukKaArdhur: "No-Show"
};

// Funksion për të shfaqur datën vetëm nëse është valide
function formatDateTime(date, time) {
  if (
    !date ||
    date === "0001-01-01T00:00:00" ||
    date.startsWith("1/1/1") ||
    date === "1/1/1" ||
    date === "0001-01-01"
  ) {
    return "-";
  }
  // Nëse ke edhe time, bashko; përndryshe shfaq vetëm datën
  try {
    if (time && time !== "00:00:00") {
      const dateTime = new Date(`${date}T${time}`);
      return dateTime.toLocaleString();
    } else {
      const onlyDate = new Date(date);
      return onlyDate.toLocaleDateString();
    }
  } catch {
    return "-";
  }
}

export default function AppointmentList({
  appointments,
  onViewDetails,
  role,
  onMoveInProcess,
  onMoveNoShow,
  onProcessPayment // <--- NEW
}) {
  if (!appointments || appointments.length === 0) {
    return <p className="text-gray-600">No appointments found.</p>;
  }
const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Date & Time</th>
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2">Doctor</th>
            <th className="px-4 py-2">Service</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.appointmentId} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 align-middle">{formatDateTime(a.date, a.time)}</td>
              <td className="px-4 py-2 align-middle">
                {a.patientName} {a.patientSurname}
              </td>
              <td className="px-4 py-2 align-middle">
                {a.doctorName} {a.doctorSurname}
              </td>
              <td className="px-4 py-2 align-middle">{a.serviceName}</td>
              <td className="px-4 py-2 align-middle capitalize">{STATUS_LABELS[a.status] || a.status}</td>
              <td className="px-4 py-2 align-middle text-right">
                {role !== "Patient" && a.status === "Kerkese" && (
                  <button
                    onClick={() => onViewDetails(a.appointmentId)}
                    className="text-blue-600 hover:underline"
                  >
                    Manage Request
                  </button>
                )}
               {role === "Receptionist" && a.status === "Paguar" && onProcessPayment && (
                  <button
                    className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    onClick={() => onProcessPayment(a.appointmentId)}
                  >
                  View
                  </button>
                )}
                {role === "Doctor" && a.status === "NeProces" && (
                  <button
                    onClick={() => onViewDetails(a.appointmentId)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Krijo Raportin
                  </button>
                )}
                {role !== "Patient" && a.status === "Konfirmuar" && (
                  <>
                    {onMoveInProcess && (
                      <button
                        onClick={() => onMoveInProcess(a.appointmentId)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 mr-2"
                      >
                        In-Process
                      </button>
                    )}
                    {onMoveNoShow && (
                      <button
                        onClick={() => onMoveNoShow(a.appointmentId)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        No-Show
                      </button>
                    )}
                  </>
                )}
                {/* ---- Payment Button for Receptionist, Completed appointments ---- */}
                {role === "Receptionist" && a.status === "Kryer" && onProcessPayment && (
                  <button
                    className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    onClick={() => onProcessPayment(a.appointmentId)}
                  >
                    Process Payment
                  </button>
                )}
                 {role === "Patient" && a.status === "Paguar" && (
                  <button
                    onClick={() => navigate(`/patient/invoice?appointment=${a.appointmentId}`)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    View Invoice
                  </button>
                )}       
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
