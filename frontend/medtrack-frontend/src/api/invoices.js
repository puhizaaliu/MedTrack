// api/invoices.js
import api from './client'; 

export function getAllInvoices() {
  return api.get('/api/Invoice').then(res => res.data);
}
export function getPaidInvoices() {
  return api.get('/api/Invoice/paid').then(res => res.data);
}
export function getUnpaidInvoices() {
  return api.get('/api/Invoice/unpaid').then(res => res.data);
}
export function getInvoiceById(id) {
  return api.get(`/api/Invoice/${id}`).then(res => res.data);
}
export function createInvoice(payload) {
  return api.post('/api/Invoice', payload).then(res => res.data);
}
export function updateInvoice(id, payload) {
  return api.put(`/api/Invoice/${id}`, payload).then(res => res.data);
}
export function deleteInvoice(id) {
  return api.delete(`/api/Invoice/${id}`).then(res => res.data);
}
