import api from './client';

// List all doctors
export function getAllDoctors() {
  return api.get('/doctors').then(res => res.data);
}

// Get a single doctor
export function getDoctorById(id) {
  return api.get(`/doctors/${id}`).then(res => res.data);
}

// Create a new doctor
export function createDoctor(payload) {
  return api.post('/doctors', payload).then(res => res.data);
}

// Update an existing doctor
export function updateDoctor(id, payload) {
  return api.put(`/doctors/${id}`, payload).then(res => res.data);
}

// Delete a doctor
export function deleteDoctor(id) {
  return api.delete(`/doctors/${id}`).then(res => res.data);
}

// Get doctor by the service he provides
export function getDoctorsByService(serviceId) {
  return api.get(`/api/Doctor/by-service/${serviceId}`).then(res => res.data);
}
