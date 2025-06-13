import React from "react";

export default function UserDetails({ user }) {
  if (!user) {
    return <p>No user data available.</p>;
  }

  return (
    <div className="bg-white rounded shadow p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        User Details
      </h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p><strong>Name:</strong> {user.name} {user.surname}</p>
        <p><strong>Parent Name:</strong> {user.parentName}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
        <p><strong>Personal Number:</strong> {user.personalNumber}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {/* Role-specific Info */}
      {user.role === "Doctor" && user.doctor && (
        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Doctor Info</h3>
          <p><strong>Specialization:</strong> {user.doctor.specialization?.name || "Not assigned"}</p>
        </div>
      )}

      {user.role === "Patient" && user.patient && (
        <div className="space-y-8">
      {/* Section 1: Medical Information */}
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

      {/* Section 2: Family History */}
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

      {/* Section 3: Medical Reports */}
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
      )}
    </div>
  );
}
