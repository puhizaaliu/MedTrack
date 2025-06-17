import React, { useEffect, useState } from "react";
import { getAppointmentRequests, approveRequest, rejectRequest } from "../../api/appointments";

export default function AppointmentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getAppointmentRequests()
      .then(data => setRequests(data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      setRequests(reqs => reqs.filter(r => r.appointmentId !== id));
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      setRequests(reqs => reqs.filter(r => r.appointmentId !== id));
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  if (loading) return <p className="text-center py-6">Loading appointment requests...</p>;
  if (error) return <p className="text-red-600 text-center py-6">{error}</p>;

  return (
    <div className="bg-white rounded shadow p-6 max-w-5xl mx-auto">
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
            <tr key={req.appointmentId} className="border-t">
              <td className="px-4 py-2 border">{req.patientName}</td>
              <td className="px-4 py-2 border">{req.serviceName}</td>
              <td className="px-4 py-2 border">{req.preferredDate}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleApprove(req.appointmentId)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleReject(req.appointmentId)}
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
