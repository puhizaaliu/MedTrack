import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointments } from "../../api/appointments";
import AppointmentList from "../../shared/AppointmentList";

const STATUSES = [
  "all",
  "Pending",
  "Confirmed",
  "In-Process",
  "Completed",
  "Paid",
  "No-Show",
];

export default function AppointmentsOverview() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    const status = statusFilter === "all" ? null : statusFilter;
    getAppointments(null, status)
      .then(data => setAppointments(data))
      .catch(err => console.error("Error loading appointments:", err))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  if (loading) {
    return <p className="text-center py-6">Loading appointments...</p>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold text-gray-800">Appointments Overview</h1>

      <div className="flex flex-wrap gap-3">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              statusFilter === s
                ? "bg-green-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      <AppointmentList
        appointments={appointments}
        onViewDetails={(id) => navigate(`/admin/appointments/${id}`)}
      />
    </div>
  );
}
