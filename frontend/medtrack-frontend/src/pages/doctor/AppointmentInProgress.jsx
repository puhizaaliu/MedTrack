import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAppointments } from "../../api/appointments";
import AppointmentList from "../../shared/AppointmentList";

export default function AppointmentInProgress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch appointments In-Process for this doctor
    getAppointments(null, "In-Process", user.id)
      .then(data => setAppointments(data))
      .catch(err => console.error("Error loading appointments:", err))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) {
    return <p className="text-center py-6">Loading appointments...</p>;
  }

  if (!appointments.length) {
    return <p className="text-center py-6">No in-progress appointments.</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold text-green-600">In-Process Appointments</h2>
      <AppointmentList
        appointments={appointments}
        onViewDetails={id => navigate(`/doctor/reportform/${id}`)}
      />
    </div>
  );
}
