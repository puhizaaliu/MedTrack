// import api from './client'

// export function getAllFamilyHistories() {
//   return api.get('/api/FamilyHistory')
//     .then(res => res.data)
// }

// export function getFamilyHistoryByPatient(patientId) {
//   return api.get(`/api/PatientFamilyHistory/patient/${patientId}`)
//     .then(res => res.data)
// }

// export function addFamilyHistory(payload) {
//   return api.post('/api/PatientFamilyHistory', payload)
//     .then(res => res.data)
// }

// export function deleteFamilyHistory(payload) {
//   return api.delete('/api/PatientFamilyHistory', { data: payload })
//     .then(res => res.data)
// }

// export function updateFamilyHistory({ patientId, historyId, otherText }) {
//   return api
//     .put(
//       `/api/PatientFamilyHistory/patient/${patientId}/history/${historyId}`,
//       { patientId, historyId, otherText }
//     )
//     .then(res => res.data)
// }

import api from './client'

export const listPatientFamilyHistory = (patientId) =>
  api.get(`/api/PatientFamilyHistory/patient/${patientId}`).then(r => r.data)

export const addPatientFamilyHistory = (payload /* { patientId, historyId, otherText? } */) =>
  api.post('/api/PatientFamilyHistory', payload).then(r => r.data)

export const removePatientFamilyHistory = ({ patientId, historyId }) =>
  api.delete('/api/PatientFamilyHistory', {
    params: { patientId, historyId }
  }).then(r => r.data)
