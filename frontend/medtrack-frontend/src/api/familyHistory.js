import api from './client'

export const listFamilyHistories = () =>
  api.get('/api/FamilyHistory').then(r => r.data)

export const createFamilyHistory = (payload) =>
  api.post('/api/FamilyHistory', payload).then(r => r.data)

export const updateFamilyHistory = (id, payload) =>
  api.put(`/api/FamilyHistory/${id}`, payload).then(r => r.data)

export const deleteFamilyHistoryMaster = (id) =>
  api.delete(`/api/FamilyHistory/${id}`).then(r => r.data)
