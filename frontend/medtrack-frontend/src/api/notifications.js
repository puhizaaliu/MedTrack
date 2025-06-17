import api from './client';

// — Fetch notifications for the logged-in user
export function getNotifications(userId, limit = null) {
  return api
    .get('/notifications', { params: { userId, limit } })
    .then(res => res.data);
}
