import React, { useState } from "react";

export default function AppointmentRequests() {
    //si shembuj se tani i zv me tdhana prej databazes
  const [requests, setRequests] = useState([
    {
      id: 1,
      patientName: "Arta Berisha",
      service: "Konsultë kardiologjike",
      preferredDate: "2025-06-15",
      status: "Pending"
    },
    {
      id: 2,
      patientName: "Valon Krasniqi",
      service: "Kontrollë ortopedike",
      preferredDate: "2025-06-17",
      status: "Pending"
    }
  ]);

  const handleApprove = (id) => {
    console.log("Approve request", id);
  };

  const handleReject = (id) => {
    console.log("Reject request", id);
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h1 className="text-2xl font-semibold mb-4">Kërkesat për Termine</h1>
      <table className="min-w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border">Pacienti</th>
            <th className="px-4 py-2 border">Shërbimi</th>
            <th className="px-4 py-2 border">Data e preferuar</th>
            <th className="px-4 py-2 border">Veprime</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-t">
              <td className="px-4 py-2 border">{req.patientName}</td>
              <td className="px-4 py-2 border">{req.service}</td>
              <td className="px-4 py-2 border">{req.preferredDate}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleApprove(req.id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleReject(req.id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
