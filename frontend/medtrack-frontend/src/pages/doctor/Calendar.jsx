import React, { useEffect, useState } from 'react';
import { getAppointments } from '../../api/appointments';
import Calendar from '../../shared/Calendar';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function DoctorCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // fetch only confirmed appointments for this doctor
    getAppointments(null, 'Confirmed', user.userId)
      .then(data => {
        setEvents(data.map(a => ({
          id: a.id,
          title: a.patientName,
          start: a.date,
          end:   a.date
        })));
      })
      .finally(() => setLoading(false));
  }, [user.userId]);

  if (loading) return <p>Loading calendar…</p>;

  return (
    <div className="py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">My Calendar</h1>
      <Calendar
        events={events}
        initialView="timeGridWeek"
        onEventClick={info => {
          navigate(`/doctor/reportform/${info.event.id}`);
        }}
      />
    </div>
  );
}
