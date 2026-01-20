import { apiFetch } from './api';

export function listLabels() {
  return apiFetch('/label').then(response => response.json());
}

export async function createLabel(data: { name: string; colorRgb: string }) {
  const response = await apiFetch('/label', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    status: response.status,
    ok: response.ok,
    data: await response.json(),
  };
}
