import api from './client';

// — List appointments (optionally filtered by patientId, status, doctorId)
export function getAppointments(patientId = null, status = null, doctorId = null) {
  return api
    .get('/appointments', { params: { patientId, status, doctorId } })
    .then(res => res.data);
}

// — Get a single appointment’s details
export function getAppointmentById(id) {
  return api.get(`/appointments/${id}`).then(res => res.data);
}

// — Create a new appointment
export function createAppointment(payload) {
  return api.post('/appointments', payload).then(res => res.data);
}

// — List the “pending” appointment requests
export function getAppointmentRequests() {
  return api.get('/appointments/requests').then(res => res.data);
}

// — Approve / reject a pending request
export function approveRequest(id) {
  return api.post(`/appointments/${id}/approve`);
}
export function rejectRequest(id) {
  return api.post(`/appointments/${id}/reject`);
}
