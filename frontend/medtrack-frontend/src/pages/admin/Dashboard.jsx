import React from "react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
      {/*si shembuj qka munet me u shfaq te dashboardi i adminit  */}
      {/* Statistika tshpejta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold text-gray-700">Patients</h2>
          <p className="text-3xl text-green-500">120</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold text-gray-700">Doctors</h2>
          <p className="text-3xl text-green-500">15</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold text-gray-700">Receptionists</h2>
          <p className="text-3xl text-green-500">5</p>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold text-gray-700">Appointments</h2>
          <p className="text-3xl text-green-500">342</p>
        </div>
      </div>

      {/* Terminet e fundit */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Appointments</h2>
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Patient</th>
              <th className="p-2 border">Doctor</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border">
              <td className="p-2 border">Arta Jashari</td>
              <td className="p-2 border">Dr. Driton Berisha</td>
              <td className="p-2 border">2025-06-13</td>
              <td className="p-2 border text-green-600">Confirmed</td>
            </tr>
            <tr className="border">
              <td className="p-2 border">Bujar Gashi</td>
              <td className="p-2 border">Dr. Valbona Hoxha</td>
              <td className="p-2 border">2025-06-12</td>
              <td className="p-2 border text-yellow-600">Pending</td>
            </tr>
            <tr className="border">
              <td className="p-2 border">Lirika Miftari</td>
              <td className="p-2 border">Dr. Ilir Morina</td>
              <td className="p-2 border">2025-06-11</td>
              <td className="p-2 border text-red-500">No-Show</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
