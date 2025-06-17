import React, { useEffect, useState } from 'react';
import { getAppointments } from '../../api/appointments';
import Calendar from '../../shared/Calendar';
import { useNavigate } from 'react-router-dom';

export default function ReceptionistCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch only confirmed appointments of all doctors
    getAppointments(null, 'Confirmed')
      .then(data => {
        setEvents(data.map(a => ({
          id: a.id,
          title: `${a.patientName} → Dr. ${a.doctorName}`,
          start: a.date,      // ISO string
          end:   a.date       // or compute end if you have duration
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading calendar…</p>;

  return (
    <div className="py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Receptionist Calendar</h1>
      <Calendar
        events={events}
        initialView="timeGridWeek"
        onEventClick={info => {
          navigate(`/receptionist/appointments/${info.event.id}`);
        }}
      />
    </div>
  );
}
