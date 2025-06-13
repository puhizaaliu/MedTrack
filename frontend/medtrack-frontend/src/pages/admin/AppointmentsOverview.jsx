import React, { useState } from "react";

const AppointmentsOverview = () => {
  const [filter, setFilter] = useState("all");

  const appointments = [
    {
      id: 1,
      patient: "Jane Smith",
      doctor: "Dr. John Doe",
      date: "2025-06-14",
      time: "10:00",
      status: "Confirmed",
    },
    {
      id: 2,
      patient: "Alex Green",
      doctor: "Dr. Sarah Lee",
      date: "2025-06-15",
      time: "14:30",
      status: "Pending",
    },
    // more sample data...
  ];

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Appointments Overview</h1>

      <div className="flex gap-4">
        {[
          "all",
          "Pending",
          "Confirmed",
          "In-Process",
          "Completed",
          "Paid",
          "No-Show",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded ${
              filter === status
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status === "all" ? "All" : status}
          </button>
        ))}
      </div>

      <table className="w-full table-auto border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Patient</th>
            <th className="px-4 py-2 text-left">Doctor</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appt) => (
            <tr key={appt.id} className="border-t">
              <td className="px-4 py-2">{appt.patient}</td>
              <td className="px-4 py-2">{appt.doctor}</td>
              <td className="px-4 py-2">{appt.date}</td>
              <td className="px-4 py-2">{appt.time}</td>
              <td className="px-4 py-2">
                <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                  {appt.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsOverview;
