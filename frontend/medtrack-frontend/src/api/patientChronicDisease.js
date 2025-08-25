// import api from './client';

// export function getAllChronicDiseases() {
//   return api.get('/api/ChronicDisease')
//     .then(res => res.data);
// }

// export function getChronicDiseasesByPatient(patientId) {
//   return api.get(`/api/PatientChronicDisease/patient/${patientId}`)
//     .then(res => res.data);
// }

// export function addChronicDisease(payload) {
//   return api.post('/api/PatientChronicDisease', payload)
//     .then(res => res.data);
// }

// export function deleteChronicDisease(payload) {
//   return api.delete('/api/PatientChronicDisease', { data: payload })
//     .then(res => res.data);
// }

// export function updateChronicDisease(diseaseId, payload) {
//   return api.put(`/api/PatientChronicDisease/${diseaseId}`, payload)
//     .then(res => res.data);
// }
import api from './client'

export const listPatientChronicDiseases = (patientId) =>
  api.get(`/api/PatientChronicDisease/patient/${patientId}`).then(r => r.data)

export const addPatientChronicDisease = (payload /* { patientId, diseaseId, otherText? } */) =>
  api.post('/api/PatientChronicDisease', payload).then(r => r.data)

export const removePatientChronicDisease = ({ patientId, diseaseId }) =>
  api.delete('/api/PatientChronicDisease', {
    params: { patientId, diseaseId }
  }).then(r => r.data)

