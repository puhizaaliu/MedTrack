import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getAppointmentsByDoctor } from "../../api/appointments";

export default function AppointmentInProgress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAppointmentsByDoctor(user.userId)
      .then(data => {
        const inProgress = data.filter(app => app.status === "NeProces");
        setAppointments(inProgress);
      })
      .catch(err => console.error("Error loading appointments:", err))
      .finally(() => setLoading(false));
  }, [user.userId]);

  if (loading) {
    return <p className="text-center py-6">Loading appointments…</p>;
  }
  if (!appointments.length) {
    return (
      <div className="flex flex-col items-center mt-12">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">In-Process Appointments</h2>
        <p className="text-gray-600">No in-progress appointments at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">
        In-Process Appointment{appointments.length > 1 ? "s" : ""}
      </h2>
      {appointments.map(app => (
        <div
          key={app.appointmentId}
          className="bg-white rounded-xl shadow p-6 mb-4 flex flex-col gap-3"
        >
          <div>
            <span className="font-bold text-gray-800">Patient:</span>{" "}
            {app.patientName} {app.patientSurname}
          </div>
          <div>
            <span className="font-bold text-gray-800">Service:</span>{" "}
            {app.serviceName}
          </div>
          <div>
            <span className="font-bold text-gray-800">Date:</span>{" "}
            {app.date && app.date !== "0001-01-01" ? new Date(app.date).toLocaleDateString() : "—"}
            {" | "}
            <span className="font-bold text-gray-800">Time:</span>{" "}
            {app.time && app.time !== "00:00:00" ? app.time.slice(0,5) : "—"}
          </div>
          <button
            className="mt-3 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold shadow"
            onClick={() => navigate(`/doctor/newreport/${app.appointmentId}`)}
          >
            Create Medical Report
          </button>
        </div>
      ))}
    </div>
  );
}
