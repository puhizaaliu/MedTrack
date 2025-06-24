import api from './client';

// Login: map AuthResponse → { accessToken, refreshToken, user }
export async function login(credentials) {
  const { data } = await api.post('/api/auth/login', credentials);
  return {
    accessToken:  data.accessToken,
    refreshToken: data.refreshToken,
    user: {
      userId: data.userId,
      role:   data.role,
      // note: AuthResponse doesn’t include name/surname; add if you need them server-side
    }
  };
}

// Refresh: POST { token: ... } and remap
export async function refreshToken(accessToken, refreshToken) {
  const { data } = await api.post('/api/auth/refresh', { accessToken, refreshToken }); // property is "token"
  return {
    accessToken:  data.accessToken,
    refreshToken: data.refreshToken,
    user: {
      userId: data.userId,
      role:   data.role
    }
  };
}
