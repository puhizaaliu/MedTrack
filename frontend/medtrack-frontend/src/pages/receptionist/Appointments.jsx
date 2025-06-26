// src/pages/receptionist/Appointments.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentList from "../../shared/AppointmentList";
import { getAppointmentsByStatus } from "../../api/appointments";
import { useAuth } from "../../hooks/useAuth";

const STATUSES = [
  "Kerkese",
  "Konfirmuar",
  "NeProces",
  "Kryer",
  "Paguar",
  "NukKaArdhur"
];

const STATUS_LABELS = {
  Kerkese:     "Pending",
  Konfirmuar:  "Confirmed",
  NeProces:    "In-Process",
  Kryer:       "Completed",
  Paguar:      "Paid",
  NukKaArdhur: "No-Show"
};

export default function ReceptionistAppointments() {
  const { user }        = useAuth();
  const navigate        = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [statusFilter, setStatusFilter] = useState("Kerkese"); // must match enum

  useEffect(() => {
    setLoading(true);
    getAppointmentsByStatus(statusFilter)
      .then(data => setAppointments(data))
      .catch(err => console.error("Error loading appointments:", err))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  if (!user) {
    return <p className="text-center py-6">Loading user…</p>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800">All Appointments</h1>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-3">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Appointment table */}
      {loading ? (
        <p className="text-center py-6">Loading appointments…</p>
      ) : (
        <AppointmentList
          appointments={appointments}
          onViewDetails={id =>
            statusFilter === "Kerkese"
              ? navigate(`/receptionist/appointmentrequests/${id}`)
              : navigate(`/receptionist/appointments/${id}`)
          }
        />
      )}
    </div>
  );
}
