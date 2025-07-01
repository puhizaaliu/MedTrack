import axios from 'axios'

/**
 * Fetch a patient’s medical info
 * GET /api/MedicalInfo/{patientId}
 */
export function getMedicalInfo(patientId) {
  return axios
    .get(`/api/MedicalInfo/${patientId}`)
    .then(res => res.data)
}

/**
 * Create a new medical info record
 * POST /api/MedicalInfo
 * payload = { patientId, allergies, medications, smoking, alcohol, physicalActivity }
 */
export function createMedicalInfo(payload) {
  return axios
    .post('/api/MedicalInfo', payload)
    .then(res => res.data)
}

/**
 * Update an existing medical info record
 * PUT /api/MedicalInfo/{patientId}
 * payload = { allergies, medications, smoking, alcohol, physicalActivity }
 */
export function updateMedicalInfo(patientId, payload) {
  return axios
    .put(`/api/MedicalInfo/${patientId}`, payload)
    .then(res => res.data)
}

/**
 * Delete a patient’s medical info record
 * DELETE /api/MedicalInfo/{patientId}
 */
export function deleteMedicalInfo(patientId) {
  return axios
    .delete(`/api/MedicalInfo/${patientId}`)
    .then(res => res.data)
}
