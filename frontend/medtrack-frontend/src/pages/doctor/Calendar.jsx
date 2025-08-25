import React, { useEffect, useState } from 'react';
import { getAppointmentsByDoctor } from '../../api/appointments';
import Calendar from '../../shared/Calendar';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function DoctorCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'Doctor') {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getAppointmentsByDoctor(user.userId)
      .then(data => {
        const confirmedAppointments = data.filter(a => a.status === 'Konfirmuar');
        const evts = confirmedAppointments.map(a => ({
          id: a.appointmentId,
          title: `${a.patientName || 'Patient'}`,
          start: `${a.date}T${a.time}`,
          end: `${a.date}T${a.time}`
        }));
        setEvents(evts);
        console.log("Doctor events:", evts);
      })
      .catch(err => console.error('Failed to load doctor appointments', err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== 'Doctor') {
    return <p className="text-red-600 text-center py-6">You are not authorized to view this page.</p>;
  }

  return (
    <div className="py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">My Calendar</h1>
      <Calendar
        events={events}
        initialView="timeGridWeek"
        onEventClick={info => {
          navigate(`/doctor/appointments/${info.event.id}`);
        }}
      />
    </div>
  );
}
