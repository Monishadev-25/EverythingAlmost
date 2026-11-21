import { apiRequest } from './client';

export function fetchHealth(signal) {
  return apiRequest('/health', { signal });
}

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function loginUser(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function fetchCurrentUser(signal) {
  return apiRequest('/auth/me', { signal });
}

export function logoutUser() {
  return apiRequest('/auth/logout', {
    method: 'POST',
  });
}

