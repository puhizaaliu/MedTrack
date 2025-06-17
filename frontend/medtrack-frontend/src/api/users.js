import api from './client';

// List all users
export function getAllUsers() {
  return api.get('/users').then(res => res.data);
}

// Get a single user
export function getUserById(id) {
  return api.get(`/users/${id}`).then(res => res.data);
}

// Create a new user
export function createUser(payload) {
  return api.post('/users', payload).then(res => res.data);
}

// Update an existing user
export function updateUser(id, payload) {
  return api.put(`/users/${id}`, payload).then(res => res.data);
}

// Delete a user
export function deleteUser(id) {
  return api.delete(`/users/${id}`).then(res => res.data);
}
