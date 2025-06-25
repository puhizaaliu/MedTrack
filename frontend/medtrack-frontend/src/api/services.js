import api from "./client";

export function getAllServices() {
  return api.get("/api/Service").then(res => res.data);
}
