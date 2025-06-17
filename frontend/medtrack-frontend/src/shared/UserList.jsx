import React from 'react';

/**
 * komponent per listimin e users ne tabele
 * Props:
 *  - users: Array of { userId, name, surname, email, role }
 *  - onViewUser: function(userId) => void
 */
export default function UserList({ users, onViewUser }) {
  if (!users || users.length === 0) {
    return <p className="text-gray-600">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.userId} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 align-middle">
                {user.name} {user.surname}
              </td>
              <td className="px-4 py-2 align-middle">{user.email}</td>
              <td className="px-4 py-2 align-middle capitalize">{user.role}</td>
              <td className="px-4 py-2 align-middle text-right">
                <button
                  onClick={() => onViewUser(user.userId)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
