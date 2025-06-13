import React from "react";

export default function Calendar() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Appointment Calendar</h1>

      {/* masanej e vendosim nje calendar ketu */}
      <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
        📅 Calendar view coming soon... You can implement a real calendar (e.g. with FullCalendar or React Big Calendar).
      </div>

      {/* i shtojme pastaj filtering per secilen */}
      <div className="mt-6 text-sm text-gray-400">
        <p>You will be able to filter appointments by:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Doctor</li>
          <li>Status (Confirmed only)</li>
          <li>Time range (Day / Week / Month)</li>
        </ul>
      </div>
    </div>
  );
}
