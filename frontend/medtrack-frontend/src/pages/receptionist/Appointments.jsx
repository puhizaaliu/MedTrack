import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointments } from "../../api/appointments";
import { useAuth } from "../../hooks/useAuth";

const STATUSES = [
  "Pending",
  "Confirmed",
  "In-Process",
  "Completed",
  "Paid",
  "No-Show",
];

export default function ReceptionistAppointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Pending");

  useEffect(() => {
    setLoading(true);
    // Fetch all appointments filtered by status
    getAppointments(null, statusFilter)
      .then(data => setAppointments(data))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  if (loading) {
    return <p className="text-center py-6">Loading appointments...</p>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">All Appointments</h1>
      </div>

      <div className="flex flex-wrap gap-3">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              statusFilter === s
                ? "bg-green-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Patient</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Doctor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Date & Time</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Service</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => {
              const dateTime = new Date(`${a.date}T${a.time}`);
              const formattedDate = dateTime.toLocaleDateString();
              const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <tr key={a.appointmentId} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{a.patientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{a.doctorName} {a.doctorSurname}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{formattedDate} {formattedTime}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{a.serviceName}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 capitalize">{a.status}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => navigate(`/receptionist/appointments/${a.appointmentId}`)}
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
    </div>
  );
}
