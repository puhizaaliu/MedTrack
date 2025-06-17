// src/pages/patient/BookAppointment.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { createAppointment } from "../../api/appointments";

export default function BookAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState("");
  const [doctor, setDoctor]   = useState("");
  const [date, setDate]       = useState("");
  const [time, setTime]       = useState("");
  const [error, setError]     = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // don’t render form until user is loaded
  if (!user?.userId) {
    return <p className="text-center py-6">Loading user...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createAppointment({
        patientId: user.userId,
        serviceId: service,
        doctorId: doctor,
        date,
        time
      });
      navigate("/patient/appointments");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Book Appointment</h1>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Service</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="">Select service</option>
            {/* TODO: replace static options with dynamic list from API */}
            <option value="General Checkup">General Checkup</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Cardiology">Cardiology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Doctor</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          >
            <option value="">Select doctor</option>
            {/* TODO: replace static options with dynamic list from API */}
            <option value="1">Dr. Smith</option>
            <option value="2">Dr. Jane</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
