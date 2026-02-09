

const BASE_URL = 'http://localhost:3001';



export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function clearTokens() {
 
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

}

async function refreshToken() {
  const refresh_token = getRefreshToken();

  if (!refresh_token) {
    clearTokens();
    
      window.location.href = '/login';
 
    throw new Error('Refresh token ausente');
  }

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token }),
  });

  if (!response.ok) {
    clearTokens();
  
      window.location.href = '/login';
    
    throw new Error('Refresh token inválido');
  }

  const data = await response.json();

  
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
  

  return data.access_token;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  let token = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    try {
      token = await refreshToken();
      headers['Authorization'] = `Bearer ${token}`;

      response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
      });
    } catch {
      throw new Error('Sessão expirada');
    }
  }

  return response;
}
