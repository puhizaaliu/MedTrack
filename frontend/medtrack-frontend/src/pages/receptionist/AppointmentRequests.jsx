import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointmentRequests, getAppointmentsByDoctor, updateAppointment } from '../../api/appointments';

export default function AppointmentRequests() {
  const { id } = useParams(); // appointmentId
  const navigate = useNavigate();

  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAppointmentRequests() // GET /api/Appointment/status/Kerkese
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
        console.log("Confirmed appointments:", confirmed);

        const today = new Date();
        const weekLater = new Date();
        weekLater.setDate(today.getDate() + 7);

        const filtered = confirmed.filter(a => {
          const appointmentDate = a.date.split('T')[0]; // "2025-08-19"
          const todayStr = new Date().toISOString().split('T')[0];
          const weekLaterStr = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

          return appointmentDate >= todayStr && appointmentDate <= weekLaterStr;
        });

          console.log("Filtered (next 7 days):", filtered);
          setSchedule(filtered);

      })
      .catch(err => setError(err.message || 'Failed loading request'))
      .finally(() => setLoading(false));
  }, [id]);

  // Double-booking validation
  useEffect(() => {
    if (!newDate || !newTime) return setIsBusy(false);

    const conflict = schedule.some(slot => {
      const slotDate = slot.date.split('T')[0];
      return (
        slotDate === newDate &&
        slot.time === newTime &&
        slot.appointmentId !== appt?.appointmentId
      );
    });

    setIsBusy(conflict);
    if (!conflict) setError(null); // ✅ Clear error when resolved
  }, [newDate, newTime, schedule]);


  const handleApprove = async e => {
    e.preventDefault();
    setError(null);

    if (isBusy) {
      setError('Selected slot is already booked. Please choose another time.');
      return;
    }

    try {
      const payload = {
        date: newDate,
        time: newTime,
        status: 'Konfirmuar'
      };

      console.log('Payload to send:', payload);
      await updateAppointment(appt.appointmentId, payload);
      navigate('/receptionist/appointments');

    } catch (err) {
      let backendError =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message;

      // Show custom message for 404 errors
      if (err.response?.status === 404) {
        backendError = 'The selected date and time is not available.';
      }

      setError(backendError || 'Something went wrong');
    }
  };

  // Check if the next 7 days are all busy (12 slots per day, 8am-8pm)
  const allNext7DaysBusy = (() => {
    if (schedule.length === 0) return false;
    const days = {};
    schedule.forEach(slot => {
      days[slot.date] = (days[slot.date] || 0) + 1;
    });
    // If any day in next 7 has less than, say, 12 slots, not fully busy
    const uniqueDays = Object.keys(days);
    if (uniqueDays.length < 7) return false;
    return uniqueDays.every(d => days[d] >= 12);
  })();

  if (loading) return <p className="text-center py-6">Loading request…</p>;
  if (!appt) return <p className="text-center py-6">No such request.</p>;

  
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
        &larr; Back to Requests
      </button>

      <h2 className="text-2xl font-semibold">Manage Appointment Request</h2>

      <section className="bg-gray-50 p-4 rounded shadow">
        <p><strong>Patient:</strong> {appt.patientName}</p>
        <p><strong>Service:</strong> {appt.serviceName}</p>
      </section>

      <form onSubmit={handleApprove} className="space-y-4">
        {error && (
          <p className="text-red-600 font-semibold">{error}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={newDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setNewDate(e.target.value)}
              required
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Time (8:00 - 20:00)</label>
            <select
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              required
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="">Select time</option>
              {generateTimeOptions().map(time => {
                const busy = schedule.some(slot => { 
                  const slotDate = slot.date.split('T')[0];
                 return (
                  slotDate === newDate &&
                  slot.time === time &&
                  slot.appointmentId !== appt?.appointmentId 
                );
                });
                return (
                  <option key={time} value={time} disabled={busy} className={busy ? 'text-gray-400' : ''}>
                    {time} {busy ? '(Busy)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <section>
          <h3 className="text-lg font-medium mb-2">Doctor’s Busy Slots (next 7 days)</h3>
          {schedule.length > 0 ? (
            <>
              <ul className="list-disc list-inside text-red-700">
                {schedule.map(slot => (
                  <li key={slot.appointmentId}>
                    {new Date(slot.date).toLocaleDateString()} at {slot.time === "00:00:00" ? "-" : slot.time}
                  </li>
                ))}
              </ul>
              {allNext7DaysBusy && (
                <button
                  type="button"
                  className="text-blue-700 underline mt-2"
                  onClick={() => navigate(`/receptionist/calendar/doctor/${appt.doctorId}`)}
                >
                  View full calendar for Dr. {appt.doctorName} {appt.doctorSurname}
                </button>
              )}
            </>
          ) : (
            <p className="text-gray-600">No confirmed slots in next 7 days.</p>
          )}
        </section>

        {isBusy && (
          <p className="text-red-600 font-bold">
            The doctor is already booked for this slot!
          </p>
        )}

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isBusy}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${isBusy ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Approve
          </button>
        </div>
      </form>
    </div>
  );

   function generateTimeOptions() {
    const times = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute of [0, 20, 40]) {
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        times.push(`${h}:${m}`);
      }
    }
    return times;
  }

}
