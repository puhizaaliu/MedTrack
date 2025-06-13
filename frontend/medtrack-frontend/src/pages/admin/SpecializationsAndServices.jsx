import React from "react";

export default function SpecializationsAndServices() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Specializations & Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specializations Section */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-700">Specializations</h2>
            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">+ Add</button>
          </div>
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2">Cardiology</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              {/* More rows... */}
            </tbody>
          </table>
        </div>

        {/* Services Section */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-700">Services</h2>
            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">+ Add</button>
          </div>
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Specialization</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2">ECG Test</td>
                <td className="px-4 py-2">Cardiology</td>
                <td className="px-4 py-2 space-x-2">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
              {/* More rows... */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
