const API_ROOT_URL = ((import.meta.env.VITE_BACKEND_URL) || "http://localhost:8000") + "/api";
export const API_BASE_URL = API_ROOT_URL + "/v1";

export const getToken = () => {
  return (
    localStorage.getItem('auth_token') ||
    sessionStorage.getItem('auth_token') ||
    ''
  );
};
export const setToken = (t, persistent = true) => {
  // Xóa ở nơi còn lại để tránh lẫn lộn
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  if (!t) return;
  if (persistent) localStorage.setItem('auth_token', t);
  else sessionStorage.setItem('auth_token', t);
};
export const clearToken = () => {
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
};

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

