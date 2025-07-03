// src/pages/receptionist/Appointments.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentList from "../../shared/AppointmentList";
import { getAppointmentsByStatus, updateAppointment } from "../../api/appointments";
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
  const [error,        setError]        = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAppointmentsByStatus(statusFilter)
      .then(data => setAppointments(data))
      .catch(err => {
        setError("Error loading appointments");
        console.error("Error loading appointments:", err);
      })
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const handleMoveInProcess = async (id) => {
    try {
      await updateAppointment(id, { status: "NeProces" });
      setAppointments(prev =>
        prev.map(app => app.appointmentId === id
          ? { ...app, status: "NeProces" }
          : app
        )
      );
    } catch (err) {
      alert("Failed to move appointment to In-Process.");
      console.error(err);
    }
  };

  const handleMoveNoShow = async (id) => {
    try {
      await updateAppointment(id, { status: "NukKaArdhur" });
      setAppointments(prev =>
        prev.map(app => app.appointmentId === id
          ? { ...app, status: "NukKaArdhur" }
          : app
        )
      );
    } catch (err) {
      alert("Failed to mark appointment as No-Show.");
      console.error(err);
    }
  };

  const handleProcessPayment = (appointmentId) => {
    navigate(`/receptionist/payments?appointment=${appointmentId}`);
};

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
      ) : error ? (
        <p className="text-center py-6 text-red-600">{error}</p>
      ) : (
        <AppointmentList
          appointments={appointments}
          onViewDetails={id =>
            statusFilter === "Kerkese"
              ? navigate(`/receptionist/appointmentrequests/${id}`)
              : navigate(`/receptionist/appointments/${id}`)
          }
          role={user.role}
          onMoveInProcess={handleMoveInProcess}
          onMoveNoShow={handleMoveNoShow}
          onProcessPayment={handleProcessPayment} 
        />
      )}
    </div>
  );
}
