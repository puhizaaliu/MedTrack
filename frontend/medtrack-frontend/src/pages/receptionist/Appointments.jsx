import React, { useState } from "react";

const appointmentStatuses = [
  "Pending",
  "Confirmed",
  "In-Process",
  "Completed",
  "Paid",
  "No-Show",
];

const dummyAppointments = [
  {
    id: 1,
    patient: "John Doe",
    doctor: "Dr. Smith",
    date: "2025-06-20",
    time: "14:00",
    status: "Pending",
  },
  {
    id: 2,
    patient: "Jane Smith",
    doctor: "Dr. Johnson",
    date: "2025-06-21",
    time: "10:30",
    status: "Confirmed",
  },
  // Add more dummy data as needed
];

export default function Appointments() {
  const [selectedStatus, setSelectedStatus] = useState("Pending");

  const filteredAppointments = dummyAppointments.filter(
    (appt) => appt.status === selectedStatus
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>

      <div className="flex flex-wrap gap-3">
        {appointmentStatuses.map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
              selectedStatus === status
                ? "bg-[#46F072] text-white border-transparent"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Doctor
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <tr key={appt.id} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-800">{appt.patient}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{appt.doctor}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{appt.date}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{appt.time}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{appt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
