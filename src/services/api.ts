export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

const getAdminPassword = (): string | null => {
  return sessionStorage.getItem('voserdem_admin_password') || import.meta.env.VITE_ADMIN_PASSKEY || null;
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers || {});

  // Set Content-Type to JSON only if body is a string (and we haven't overridden it)
  if (!headers.has('Content-Type') && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const adminPassword = getAdminPassword();
  if (adminPassword) {
    headers.set('x-admin-password', adminPassword);
  }

  try {
    const response = await fetch(endpoint, { ...options, headers });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `Error ${response.status}: ${response.statusText}`,
        status: response.status,
      };
    }

    return {
      success: true,
      data,
      status: response.status,
    };
  } catch (err) {
    return {
      success: false,
      error: 'Error de conexión con el servidor',
      status: 500,
    };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
