import React from "react";

export default function Calendar() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">My Schedule</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Here you will see your calendar view with confirmed appointments filtered by day/week/month. This will be integrated with a calendar library and API data.</p>
        {/* Example Placeholder */}
        <div className="mt-4 border border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center text-gray-400">
          Calendar placeholder
        </div>
      </div>
    </div>
  );
}
