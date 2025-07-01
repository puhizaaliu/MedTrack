import api from './client'

/**
 * Fetch all family‐history conditions defined in the system (master list)
 */
export function getAllFamilyHistories() {
  return api.get('/api/FamilyHistory')
    .then(res => res.data)
}

/**
 * Fetch a given patient’s family‐history entries
 */
export function getFamilyHistoryByPatient(patientId) {
  return api.get(`/api/PatientFamilyHistory/patient/${patientId}`)
    .then(res => res.data)
}

/**
 * Add a family‐history entry to a patient
 * payload = { patientId, historyId, otherText }
 */
export function addFamilyHistory(payload) {
  return api.post('/api/PatientFamilyHistory', payload)
    .then(res => res.data)
}

/**
 * Remove a family‐history entry
 * payload = { patientId, historyId }
 */
export function deleteFamilyHistory(payload) {
  return api.delete('/api/PatientFamilyHistory', { data: payload })
    .then(res => res.data)
}

/**
 * Update a family‐history entry
 * PUT /api/PatientFamilyHistory/{entryId}
 * payload = { patientId, historyId, otherText }
 *
 * NOTE: make sure your backend implements a PUT handler for this route.
 */
export function updateFamilyHistory({ patientId, historyId, otherText }) {
  return api
    .put(
      `/api/PatientFamilyHistory/patient/${patientId}/history/${historyId}`,
      { patientId, historyId, otherText }
    )
    .then(res => res.data)
}



