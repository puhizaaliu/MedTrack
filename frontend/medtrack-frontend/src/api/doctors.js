import api from './client';

// List all doctors
export function getAllDoctors() {
  return api.get('/api/Doctor').then(res => res.data);
}

// Get a single doctor
export function getDoctorById(id) {
  return api.get(`/api/Doctor/${id}`).then(res => res.data);
}

//Create a doctor
export function createDoctor(payload) {
  return api.post('/api/Doctor', payload).then(res => res.data)
}
// Update a doctor
export function updateDoctor(id, payload) {
  return api.put(`/api/Doctor/${id}`, payload).then(res => res.data)
}

// Delete a doctor
export function deleteDoctor(id) {
  return api.delete(`/api/Doctor/${id}`).then(res => res.data);
}

// Get doctor by the service he provides
export function getDoctorsByService(serviceId) {
  return api.get(`/api/Doctor/by-service/${serviceId}`).then(res => res.data);
}
