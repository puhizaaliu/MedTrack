import api from './client';

// — Login (returns { accessToken, refreshToken, user })
export function login(credentials) {
  return api.post('/auth/login', credentials).then(res => res.data);
}

// — Refresh accessToken
export function refreshToken(token) {
  return api.post('/auth/refresh', { refreshToken: token }).then(res => res.data);
}
