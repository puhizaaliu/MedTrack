import api from './client';

// Fetch notifications for the logged-in user
export function getNotifications(userId, limit = null) {
  return api
    .get('/notifications', { params: { userId, limit } })
    .then(res => res.data);
}

// Fetch a single notification by ID
export function getNotificationById(id) {
  return api
    .get(`/notifications/${id}`)
    .then(res => res.data);
}

// Create a new notification
export function createNotification(payload) {
  return api
    .post('/notifications', payload)
    .then(res => res.data);
}

// Update an existing notification (e.g. mark-as-read)
export function updateNotification(id, payload) {
  return api
    .put(`/notifications/${id}`, payload)
    .then(res => res.data);
}

// Delete a notification
export function deleteNotification(id) {
  return api
    .delete(`/notifications/${id}`)
    .then(res => res.data);
}
