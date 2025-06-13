import React, { useState } from "react";

export default function Dashboard() {
  const [tab, setTab] = useState("profile");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Doctor Dashboard</h1>

      {/* Tab Buttons */}
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setTab("profile")}
          className={`px-4 py-2 font-medium ${
            tab === "profile" ? "border-b-2 border-green-500 text-green-600" : "text-gray-600"
          }`}
        >
          My Info
        </button>
        <button
          onClick={() => setTab("patients")}
          className={`px-4 py-2 font-medium ${
            tab === "patients" ? "border-b-2 border-green-500 text-green-600" : "text-gray-600"
          }`}
        >
          My Patients
        </button>
        <button
          onClick={() => setTab("reports")}
          className={`px-4 py-2 font-medium ${
            tab === "reports" ? "border-b-2 border-green-500 text-green-600" : "text-gray-600"
          }`}
        >
          My Reports
        </button>
      </div>

      {/* Tab Content */}
      {tab === "profile" && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          <p>Name: Dr. John Doe</p>
          <p>Email: johndoe@example.com</p>
          <p>Specialization: Cardiology</p>
        </div>
      )}

      {tab === "patients" && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Assigned Patients</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Patient A</li>
            <li>Patient B</li>
            <li>Patient C</li>
          </ul>
        </div>
      )}

      {tab === "reports" && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Issued Reports</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Report #1 - 2024-06-05</li>
            <li>Report #2 - 2024-06-01</li>
            <li>Report #3 - 2024-05-28</li>
          </ul>
        </div>
      )}
    </div>
  );
}
