import React, { useState } from "react";

export default function BookAppointment() {
  const [service, setService] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // ma vone e lidhi me databaze
    console.log({ service, doctor, date, time });
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Book Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Service</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          >
            <option value="">Select service</option>
            <option value="General Checkup">General Checkup</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Cardiology">Cardiology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Doctor</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          >
            <option value="">Select doctor</option>
            <option value="Dr. Smith">Dr. Smith</option>
            <option value="Dr. Jane">Dr. Jane</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#46F072] hover:bg-[#3cd366] text-white font-semibold py-2 px-4 rounded"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
