import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentList from "../../shared/AppointmentList";
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

export default function Appointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Pending");

  useEffect(() => {
    setLoading(true);
    getAppointments(user.id, statusFilter)
      .then((data) => setAppointments(data))
      .finally(() => setLoading(false));
  }, [user.id, statusFilter]);

  if (loading) {
    return <p className="text-center py-6">Loading appointments...</p>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <button
          onClick={() => navigate('/patient/appointments/new')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Book Appointment
        </button>
      </div>

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
            {s}
          </button>
        ))}
      </div>

      <AppointmentList
        appointments={appointments}
        onViewDetails={(id) => navigate(`/patient/appointments/${id}`)}
      />
    </div>
  );
}
