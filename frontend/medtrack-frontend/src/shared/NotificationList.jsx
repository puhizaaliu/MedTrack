import React from 'react';
/**
 * Props:
 *  - notifications: Array of {
 *      id, type, message, appointmentId?, medicalReportId?,
 *      isRead, createdAt
 *    }
 *  - onViewNotification: (id) => void
 *  - onMarkAsRead?: (id) => void
 */
export default function NotificationList({notifications,onViewNotification,onMarkAsRead})
{
  if (!notifications || notifications.length === 0) {
    return <p className="text-gray-600">No notifications.</p>;
  }

  return (
    <ul className="space-y-2">
      {notifications.map(n => {
        const date = new Date(n.createdAt).toLocaleString();
        const isNew = !n.isRead;
        //console.log('notif:', n);
        return (
          <li
            key={n.id}
            className={`p-3 rounded border ${
              isNew ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            } flex justify-between items-start`}
          >
            <div
              onClick={() => onViewNotification(n)}
              className="flex-1 cursor-pointer"
            >
              <p className={`font-medium ${isNew ? 'text-gray-800' : 'text-gray-600'}`}>
                {n.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">{date}</p>
            </div>
            {onMarkAsRead && isNew && (
              <button
                onClick={() => onMarkAsRead(n.id)}
                className="ml-4 text-sm text-blue-600 hover:underline"
              >
                Mark read
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
