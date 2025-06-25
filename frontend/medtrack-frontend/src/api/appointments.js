import api from './client';

// Për pacientin e kyçur (useri sheh vetëm terminet e veta)
export function getAppointments(status = null) {
  const url = `/api/Appointment`;
  return api.get(url).then(res => {
    let data = res.data;
    if (status) {
      data = data.filter(app => app.status === status);
    }
    return data;
  });
}

// Për admin/receptionist/doktor që sheh terminet e një pacienti specifik
export function getAppointmentsForPatient(patientId, status = null) {
  const url = `/api/Appointment/patient/${patientId}`;
  return api.get(url).then(res => {
    let data = res.data;
    if (status) {
      data = data.filter(app => app.status === status);
    }
    return data;
  });
}

// (Opsionale) Për doktorin mund të kesh një tjetër endpoint sipas nevojës:
// export function getAppointmentsByDoctor(doctorId, status = null) {
//   const url = `/api/Appointment/doctor/${doctorId}`;
//   return api.get(url).then(res => {
//     let data = res.data;
//     if (status) {
//       data = data.filter(app => app.status === status);
//     }
//     return data;
//   });
// }


// Merr detajet e një termini të vetëm
export function getAppointmentById(id) {
  return api.get(`/api/Appointment/${id}`).then(res => res.data);
}

// Krijon një termin të ri
export function createAppointment(payload) {
  return api.post('/api/Appointment', payload).then(res => res.data);
}

// Merr terminet për një doktor të caktuar
export function getAppointmentsByDoctor(doctorId) {
  const url = `/api/Appointment/doctor/${doctorId}`;
  return api.get(url).then(res => res.data);
}

// Merr të gjitha terminet (për përdoruesin e kyçur - zakonisht admin ose receptionist)
export function getAllAppointments() {
  return api.get('/api/Appointment').then(res => res.data);
}

// Përditëson një termin ekzistues
export function updateAppointment(id, payload) {
  return api.put(`/api/Appointment/${id}`, payload).then(res => res.data);
}

// Fshin një termin
export function deleteAppointment(id) {
  return api.delete(`/api/Appointment/${id}`);
}

// Merr detajet ekzistuese të appointment-it, ndrysho statusin dhe dërgo PUT
export async function approveRequest(id) {
  const appointment = await api.get(`/api/Appointment/${id}`).then(res => res.data);
  appointment.status = "Confirmed";
  return api.put(`/api/Appointment/${id}`, appointment);
}

export async function rejectRequest(id) {
  const appointment = await api.get(`/api/Appointment/${id}`).then(res => res.data);
  appointment.status = "Rejected";
  return api.put(`/api/Appointment/${id}`, appointment);
}

// Merr të gjitha appointment requests me status "Pending"
export function getAppointmentRequests() {
  return api.get('/api/Appointment/status/Pending').then(res => res.data);
}
