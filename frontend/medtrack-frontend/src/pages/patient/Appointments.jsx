import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentList from "../../shared/AppointmentList";
import { getAppointmentsForPatient } from "../../api/appointments";
import { useAuth } from "../../hooks/useAuth";

const PATIENT_STATUSES = ["Kerkese", "Konfirmuar", "Paguar"];

const ALL_STATUSES = [
  "Kerkese",
  "Konfirmuar",
  "NeProces",
  "Kryer",
  "Paguar",
  "NukKaArdhur"
];

const STATUS_LABELS = {
  Kerkese: "Pending",
  Konfirmuar: "Confirmed",
  NeProces: "In-Process",
  Kryer: "Completed",
  Paguar: "Paid",
  NukKaArdhur: "No-Show"
};
export default function Appointments() {
  const { user } = useAuth();
  const navigate = useNavigate(); 

  const statusList = user?.role === "Patient" ? PATIENT_STATUSES : ALL_STATUSES;
  const [statusFilter, setStatusFilter] = useState(statusList[0]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
  
  getAppointmentsForPatient(user.userId)
      .then((all) => {
        // Filter appointments by status
        const filtered = all.filter((a) => statusList.includes(a.status));
        setAppointments(
          statusFilter ? filtered.filter((a) => a.status === statusFilter) : filtered
        );
      })
      .catch(() => setAppointments([]))
      .finally(() => isMounted && setLoading(false));

    return () => { isMounted = false }
  }, [user?.userId, statusFilter]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <button
          onClick={() => navigate("/patient/bookappointment")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Book Appointment
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {statusList.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-lg text-sm font-semibold ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-center py-8 text-gray-500">Loading appointments…</p>
      ) : (
        <AppointmentList
          appointments={appointments}
          onViewDetails={(id) => navigate(`/patient/appointments/${id}`)}
          role={user?.role}
        />
      )}
    </div>
  );
}
