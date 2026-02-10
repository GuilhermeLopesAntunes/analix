import { apiFetch } from './api';

export async function listUsers() {
  const res = await apiFetch('/users');
  return res.json();
}

export async function createUser(data: any) {
  return apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUser(id: number, data: any) {
  return apiFetch(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number) {
  return apiFetch(`/users/${id}`, {
    method: 'DELETE',
  });
}
