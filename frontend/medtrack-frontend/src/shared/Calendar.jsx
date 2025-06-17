import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

/**
 * Props:
 *  - events: Array of { id, title, start: ISO, end: ISO }
 *  - initialView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
 *  - onDateClick?: (info) => void
 *  - onEventClick?: (info) => void
 */
export default function Calendar({
  events,
  initialView = 'dayGridMonth',
  onDateClick,
  onEventClick
}) {
  const calendarRef = useRef(null);

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={initialView}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      events={events}
      eventClick={onEventClick}
      dateClick={onDateClick}
      height="auto"
    />
  );
}
