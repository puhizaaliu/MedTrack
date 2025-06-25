import api from './client';

// Fetch notifications for the logged-in user
export function getNotifications(userId, limit = null) {
  const url = `api/Notifications/user/${userId}`;
  const config = {};

  if (limit != null) {
    config.params = { limit };
  }

  return api
    .get(url, config)
    .then(res => res.data);
}

// Fetch a single notification by ID
export function getNotificationById(id) {
  return api
    .get(`api/Notifications/${id}`)
    .then(res => res.data);
}

// Create a new notification
export function createNotification(payload) {
  return api
    .post('api/Notifications', payload)
    .then(res => res.data);
}

// Update an existing notification (e.g. mark-as-read)
export function updateNotification(id, payload) {
  return api
    .put(`api/Notifications/${id}`, payload)
    .then(res => res.data);
}

// Delete a notification
export function deleteNotification(id) {
  return api
    .delete(`api/Notifications/${id}`)
    .then(res => res.data);
}
