// src/pages/receptionist/ReceptionistCalendar.jsx

import React, { useEffect, useState } from 'react';
import { getAppointments }       from '../../api/appointments';
import Calendar                  from '../../shared/Calendar';
import { useNavigate }           from 'react-router-dom';

export default function ReceptionistCalendar() {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate               = useNavigate();

  useEffect(() => {
    setLoading(true);

    // Fetch every doctor's confirmed appointments
    getAppointments('Konfirmuar')
      .then(data => {
        // Map into FullCalendar event shape
        const evts = data.map(a => ({
          id:    a.appointmentId,                           // use the real primary key
          title: `${a.patientName} → Dr. ${a.doctorName}`,  // show patient → doctor
          start: a.date,                                    // ISO DateOnly string
          end:   a.date
        }));
        setEvents(evts);
      })
      .catch(err => console.error('Error loading appointments', err))
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
          // Navigate to a per-appointment page (e.g. to view or edit)
          navigate(`/receptionist/appointments/${info.event.id}`);
        }}
      />
    </div>
  );
}
