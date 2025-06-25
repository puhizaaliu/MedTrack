import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { createAppointment } from "../../api/appointments";
import { getAllServices } from "../../api/services";
import { getDoctorsByService } from "../../api/doctors";

export default function BookAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [service, setService] = useState("");
  const [doctor, setDoctor] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (err) {
        setError("Could not load services!");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    if (!service) {
      setDoctors([]);
      setDoctor("");
      return;
    }
    async function fetchDoctors() {
      setLoadingDoctors(true);
      try {
        const data = await getDoctorsByService(service);
        setDoctors(data);
        setDoctor(""); // Reset selection if service changes
      } catch (err) {
        setError("Could not load doctors for this service!");
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    }
    fetchDoctors();
  }, [service]);

  if (!user?.userId) {
    return <p className="text-center py-6">Loading user...</p>;
  }
  if (loading) {
    return <p className="text-center py-6">Loading services...</p>;
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
        // mos dërgo date/time
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
            {services.map((s) => (
              <option key={s.serviceId} value={s.serviceId}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Doctor</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
            disabled={!service || loadingDoctors}
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.userId} value={d.userId}>
                Dr. {d.name} {d.surname}
              </option>
            ))}
          </select>
          {loadingDoctors && (
            <p className="text-sm text-gray-500 mt-1">Loading doctors...</p>
          )}
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
