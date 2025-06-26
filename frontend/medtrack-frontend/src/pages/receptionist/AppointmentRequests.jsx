// src/pages/receptionist/AppointmentRequests.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getAppointmentRequests, getAppointmentsByDoctor, updateAppointment, rejectRequest} from '../../api/appointments';

export default function AppointmentRequests() {
  const { id } = useParams();       // appointmentId
  const navigate = useNavigate();

  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    setLoading(true);
    getAppointmentRequests()    // GET /api/Appointment/status/Kerkese
      .then(list => {
        const found = list.find(a => a.appointmentId === +id);
        if (!found) throw new Error('Request not found');
        setAppt(found);
        // Decide what to prefill for date & time:
        const today = new Date();

        let dateVal = found.date;
        if (!dateVal || dateVal.startsWith('0001')) {
          dateVal = today.toISOString().slice(0, 10); // YYYY-MM-DD
        }
        let timeVal = found.time;
        if (!timeVal || timeVal === '00:00:00') { // format current time as "HH:MM"
          const hh = String(today.getHours()).padStart(2, '0');
          const mm = String(today.getMinutes()).padStart(2, '0');
          timeVal = `${hh}:${mm}`;
        }

        setNewDate(dateVal);
        setNewTime(timeVal);
        return found;
      })
      .then(found => getAppointmentsByDoctor(found.doctorId))
      .then(all => {
        const confirmed = all.filter(a => a.status === 'Konfirmuar');
        const today     = new Date();
        const weekLater = new Date();
        weekLater.setDate(today.getDate() + 7);

        setSchedule(
          confirmed
            .filter(a => {
              const d = new Date(a.date);
              return d >= today && d <= weekLater;
            })
        );
      })
      .catch(err => setError(err.message || 'Failed loading request'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async e => {
    e.preventDefault();
    setError(null);
    try {
      await updateAppointment(appt.appointmentId, {
        date:   newDate,      // YYYY-MM-DD
        time:   newTime,      // HH:mm
        status: 'Konfirmuar'
      });
      navigate('/receptionist/appointments');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleReject = async () => {
    setError(null);
    try {
      await rejectRequest(appt.appointmentId);
      navigate('/receptionist/appointments');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <p className="text-center py-6">Loading request…</p>;
  if (error)   return <p className="text-red-600 text-center py-6">{error}</p>;
  if (!appt)   return <p className="text-center py-6">No such request.</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
        &larr; Back to Requests
      </button>

      <h2 className="text-2xl font-semibold">Manage Appointment Request</h2>

      <section className="bg-gray-50 p-4 rounded shadow">
        <p><strong>Patient:</strong> {appt.patientName}</p>
        <p><strong>Service:</strong> {appt.serviceName}</p>
        <p>
          <strong>Requested:</strong>{' '}
          {new Date(appt.date).toLocaleDateString()} at {appt.time}
        </p>
      </section>

      <form onSubmit={handleApprove} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">New Date</label>
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              required
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">New Time</label>
            <input
              type="time"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              required
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
        </div>

        <section>
          <h3 className="text-lg font-medium mb-2">Doctor’s Busy Slots (next 7 days)</h3>
          {schedule.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {schedule.map(slot => (
                <li key={slot.appointmentId}>
                  {new Date(slot.date).toLocaleDateString()} @ {slot.time}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No confirmed slots in next 7 days.</p>
          )}
        </section>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={handleReject}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </form>
    </div>
  );
}
