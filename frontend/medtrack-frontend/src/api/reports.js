import api from './client';

// — For patients: all reports for that patient
export function getReports(patientId, limit = null) {
  return api
    .get('/medicalreports', { params: { patientId, limit } })
    .then(res => res.data);
}

// — For doctors/admins: get all reports (server-side will scope by role!)
export function getAllReports() {
  return api.get('/medicalreports').then(res => res.data);
}

// — Single-report fetch (used in ReportDetails)
export function getReportById(id) {
  return api.get(`/medicalreports/${id}`).then(res => res.data);
}

// — Doctor submits a new report
export function createMedicalReport(payload) {
  return api.post('/medicalreports', payload).then(res => res.data);
}
