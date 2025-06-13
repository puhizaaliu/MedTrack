import React, { useState } from "react";

export default function Users() {
  const [activeTab, setActiveTab] = useState("patients");

  const renderTable = () => {
    switch (activeTab) {
      case "patients":
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">Jane Doe</td>
                  <td className="px-4 py-2">jane@example.com</td>
                  <td className="px-4 py-2">+38344123456</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="text-blue-600 hover:underline">View</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
                {/* more rows */}
              </tbody>
            </table>
          </div>
        );
      case "doctors":
        return <p>List of Doctors (table here)</p>;
      case "receptionists":
        return <p>List of Receptionists (table here)</p>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">User Management</h1>

      <div className="flex gap-4 border-b pb-2">
        {[
          ["patients", "Patients"],
          ["doctors", "Doctors"],
          ["receptionists", "Receptionists"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === key
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {renderTable()}
    </div>
  );
}
