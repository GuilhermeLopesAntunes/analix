import { apiFetch, clearTokens } from './api';
import { jwtDecode } from 'jwt-decode';


interface JwtPayload {
  sub: number;
  email: string;
  routePolicies: string;
  exp: number;
  iat: number;
}

export async function login(email: string, password: string) {
  const response = await apiFetch('/auth', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!data.access_token || !data.refresh_token) {
    throw new Error('Tokens inválidos');
  }

  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);

  return data;
}

export function logout() {
  clearTokens();
  window.location.href = '/login';
}

export function getUserRoutePolicies() {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  const decoded = jwtDecode<JwtPayload>(token);
  return decoded.routePolicies;
}