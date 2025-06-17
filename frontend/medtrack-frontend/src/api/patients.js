import api from './client';

// List all patients
export function getAllPatients() {
  return api.get('/patients').then(res => res.data);
}

// Get a single patient
export function getPatientById(id) {
  return api.get(`/patients/${id}`).then(res => res.data);
}

// Create a new patient
export function createPatient(payload) {
  return api.post('/patients', payload).then(res => res.data);
}

// Update an existing patient
export function updatePatient(id, payload) {
  return api.put(`/patients/${id}`, payload).then(res => res.data);
}

// Delete a patient
export function deletePatient(id) {
  return api.delete(`/patients/${id}`).then(res => res.data);
}
