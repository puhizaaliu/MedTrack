import React, { useEffect, useState } from 'react';
import { getAppointmentsByDoctor } from '../../api/appointments';
import Calendar from '../../shared/Calendar';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function DoctorCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    // 1) Merr të gjitha terminet për doktorin
    getAppointmentsByDoctor(user.userId)
      .then(data => {
        //console.log(data); - me vertetu qe po vijne appointments
        // 2) Filtron vetëm të konfirmuarat
        const confirmed = data.filter(app => app.status === 'Konfirmuar');

        // 3) Map-on në formatin që Calendar pret
        setEvents(confirmed.map(a => ({
          id:    a.id,
          title: a.patientName,
          start: a.date,
          end:   a.date
        })));
      })
      .catch(err => console.error('Error loading doctor appointments', err))
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
