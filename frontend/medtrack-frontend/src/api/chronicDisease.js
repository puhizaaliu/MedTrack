import api from './client'

export const listChronicDiseases = () =>
  api.get('/api/ChronicDisease').then(r => r.data)

export const createChronicDisease = (payload) =>
  api.post('/api/ChronicDisease', payload).then(r => r.data)

export const updateChronicDiseaseMaster = (id, payload) =>
  api.put(`/api/ChronicDisease/${id}`, payload).then(r => r.data)

export const deleteChronicDiseaseMaster = (id) =>
  api.delete(`/api/ChronicDisease/${id}`).then(r => r.data)
