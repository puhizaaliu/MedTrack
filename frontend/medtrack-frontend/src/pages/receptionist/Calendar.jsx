import React, { useEffect, useState } from 'react';
import { getAppointmentsByStatus } from '../../api/appointments';
import Calendar from '../../shared/Calendar';
import { useNavigate } from 'react-router-dom';

export default function ReceptionistCalendar() {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
  setLoading(true);

  getAppointmentsByStatus('Konfirmuar')
    .then(data => {
      const evts = data.map(a => ({
        id:    a.appointmentId,
        title: `${a.patientName} → Dr. ${a.doctorName}`,
        start: `${a.date}T${a.time}`,
        end:   `${a.date}T${a.time}`
      }));
      setEvents(evts);
      console.log("Fetched appointments:", data);
    })
    .catch(err => console.error('Error loading appointments', err))
    .finally(() => setLoading(false));
}, []);


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
