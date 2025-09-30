import api from './client';

// Get reports for a specific patient
export function getReportsByPatient(patientId) {
  return api.get(`api/MedicalReports/patient/${patientId}`).then(res => res.data);
}

// Get reports for a specific doctor
export function getReportsByDoctor(doctorId) {
  return api.get(`api/MedicalReports/doctor/${doctorId}`).then(res => res.data);
}

// — For doctors/admins: get all reports (server-side will scope by role!)
export function getAllReports() {
  return api.get('api/MedicalReports').then(res => res.data);
}

// — Single-report fetch (used in ReportDetails)
export function getReportById(id) {
  return api.get(`api/MedicalReports/${id}`).then(res => res.data);
}

// — Doctor submits a new report
export function createMedicalReport(payload) {
  return api.post('api/MedicalReports', payload).then(res => res.data);
}
