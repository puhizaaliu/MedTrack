import api from './client';

/**
 * Fetch all chronic‐diseases defined in the system (master list)
 */
export function getAllChronicDiseases() {
  return api.get('/api/ChronicDisease')
    .then(res => res.data);
}

/**
 * Fetch a given patient’s chronic diseases
 */
export function getChronicDiseasesByPatient(patientId) {
  return api.get(`/api/PatientChronicDisease/patient/${patientId}`)
    .then(res => res.data);
}

/**
 * Add a chronic disease to a patient
 * payload = { patientId, diseaseId, otherText }
 */
export function addChronicDisease(payload) {
  return api.post('/api/PatientChronicDisease', payload)
    .then(res => res.data);
}

/**
 * Remove a chronic‐disease entry
 * payload = { patientId, diseaseId }
 */
export function deleteChronicDisease(payload) {
  return api.delete('/api/PatientChronicDisease', { data: payload })
    .then(res => res.data);
}

/**
 * Update a chronic‐disease entry
 * diseaseId = the id of the patient‐disease record
 * payload = { patientId, otherText }
 */
export function updateChronicDisease(diseaseId, payload) {
  return api.put(`/api/PatientChronicDisease/${diseaseId}`, payload)
    .then(res => res.data);
}
