// Service: Single axios instance shared by every FixMyCampus API call
import axios from 'axios';

// Base URL comes from .env (VITE_API_URL) and points at the API root,
// e.g. http://localhost:5000/api
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Uploaded photos are served by the API host itself at /uploads/<filename>,
// so strip the trailing /api to get the origin we prefix those paths with.
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const TOKEN_KEY = 'fmc_token';
export const USER_KEY = 'fmc_user';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || '';

/**
 * Turn a relative API asset path into a fully-qualified URL.
 * Absolute URLs (e.g. seeded Unsplash photos) are returned untouched.
 */
export const resolveAssetUrl = (path) => {
  if (!path) return null;
  if (/^(https?:)?\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
});

// Attach the stored JWT to every request.
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A rejected/expired token should drop the stale session instead of leaving
// the UI stuck on failed requests. Requests without a token (login/register)
// are left alone so their own error messages surface.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const wasAuthenticated = !!getStoredToken();
    const isAuthAttempt = /\/auth\/(login|register|signup)\b/.test(error?.config?.url || '');

    if (status === 401 && wasAuthenticated && !isAuthAttempt) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Pull a human-readable message out of an axios error.
 */
export const apiErrorMessage = (err, fallback) =>
  err?.response?.data?.message || fallback || 'Something went wrong. Please try again.';