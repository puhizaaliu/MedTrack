// api/specializations.js
import api from './client';

export function getSpecializations() {
  return api.get('/api/Specialization').then(res => res.data);
}

export function createSpecialization(payload) {
  return api.post('/api/Specialization', payload).then(res => res.data);
}

export function updateSpecialization(id, payload) {
  return api.put(`/api/Specialization/${id}`, payload).then(res => res.data);
}

export function deleteSpecialization(id) {
  return api.delete(`/api/Specialization/${id}`);
}
