import React from "react";

export default function AppointmentInProgress() {
  //shembull se tani i qes te dhenat prej databazes
  const appointment = {
    patientName: "Arben Krasniqi",
    time: "10:00 AM",
    date: "2025-06-15",
    reason: "General Check-up",
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-[#46F072]">Current Appointment</h2>

      <div className="space-y-2 text-gray-700">
        <p><strong>Patient:</strong> {appointment.patientName}</p>
        <p><strong>Date:</strong> {appointment.date}</p>
        <p><strong>Time:</strong> {appointment.time}</p>
        <p><strong>Reason:</strong> {appointment.reason}</p>
      </div>

      <div className="mt-6">
        <p className="text-gray-600 mb-2">Please proceed to fill out the medical report for this appointment.</p>
        <a
          href="/doctor/reportform"
          className="inline-block px-6 py-2 bg-[#46F072] hover:bg-[#3dd266] text-white font-medium rounded"
        >
          Fill Report
        </a>
      </div>
    </div>
  );
}
