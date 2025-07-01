// api/services.js
import api from "./client";

export function getAllServices() {
  return api.get("/api/Service").then(res => res.data);
}

//fetch all (serviceId, specializationId) pairs for one spec
export function getSpecializationServices(specId) {
  return api
    .get(`/api/SpecializationService/${specId}`)
    .then(res => res.data);
}

export function createService(payload) {
  return api.post("/api/Service", payload).then(res => res.data);
}

export function updateService(id, payload) {
  return api.put(`/api/Service/${id}`, payload).then(res => res.data);
}

export function deleteService(id) {
  return api.delete(`/api/Service/${id}`);
}

export function addServiceToSpecialization(specId, serviceId) {
  return api.post(
    `/api/SpecializationService?specializationId=${specId}&serviceId=${serviceId}`
  );
}

export function removeServiceFromSpecialization(specId, serviceId) {
  return api.delete(
    `/api/SpecializationService?specializationId=${specId}&serviceId=${serviceId}`
  );
}