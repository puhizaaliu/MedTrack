import React from "react";

export default function PatientDashboard() {
  return (
    <div className="space-y-8">
      {/* Section 1: Personal Information */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#46F072]">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Full Name:</strong> {/* Full Name here */}</p>
          <p><strong>Phone:</strong> {/* Phone */}</p>
          <p><strong>Email:</strong> {/* Email */}</p>
          <p><strong>Address:</strong> {/* Address */}</p>
          <p><strong>Date of Birth:</strong> {/* Date of Birth */}</p>
          <p><strong>Gender:</strong> {/* Gender */}</p>
        </div>
      </section>

      {/* Section 2: Medical Information */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#46F072]">Medical Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Height:</strong> {/* Height */}</p>
          <p><strong>Weight:</strong> {/* Weight */}</p>
          <p><strong>Blood Type:</strong> {/* Blood Type */}</p>
          <p><strong>Allergies:</strong> {/* Allergies */}</p>
          <p><strong>Medications:</strong> {/* Medications */}</p>
        </div>
      </section>

      {/* Section 3: Family History */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#46F072]">Family History</h2>
        <div className="space-y-2 text-gray-700">
          {/* Loop through family history items */}
          <div className="border-b pb-2">
            <p><strong>Disease:</strong> {/* Disease */}</p>
            <p><strong>Relation:</strong> {/* Relation */}</p>
            <p><strong>Description:</strong> {/* Description */}</p>
          </div>
        </div>
      </section>

      {/* Section 4: Medical Reports */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#46F072]">Medical Reports</h2>
        <div className="space-y-4">
          {/* Loop through reports */}
          <div className="border-b pb-2 text-gray-700">
            <p><strong>Date:</strong> {/* Date */}</p>
            <p><strong>Diagnosis:</strong> {/* Diagnosis */}</p>
            <p><strong>Treatment Plan:</strong> {/* Treatment */}</p>
            <button className="text-sm text-blue-600 hover:underline">View Full Report</button>
          </div>
        </div>
      </section>
    </div>
  );
}
