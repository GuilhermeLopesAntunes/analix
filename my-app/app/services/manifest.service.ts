import { apiFetch } from './api';

const BASE_URL = 'http://localhost:3001';

export function listManifest() {
  return apiFetch('/manifestacoes').then(response => response.json());
}

export async function createManifest(data: any) {
  const response = await apiFetch('/manifestacoes', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return {
    status: response.status,
    data: await response.json()
  }
}

export function updateStatus(id: number, status: string) {
  return apiFetch(`/manifestacoes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }).then(response => response.json());
}

export function removeManifest(id: number) {
  return apiFetch(`/manifestacoes/${id}`, {
    method: 'DELETE',
  }).then(response => response.json());
}

export function updateManifestLabel(manifestId: number, labelId: number) {
  return apiFetch(`/manifestacoes/${manifestId}/label`, {
    method: 'PATCH',
    body: JSON.stringify({ labelId }),
  }).then(response => response.json());
}


export async function uploadManifestFile(file: File) {
  const token = localStorage.getItem('access_token');

  const formData = new FormData();
  formData.append('file', file); 

  const response = await fetch(
    `${BASE_URL}/manifestacoes/upload-manifest`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, 
      },
      body: formData,
    }
  );

  if (!response.ok) {
    let message = 'Erro ao fazer upload do arquivo';
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}
