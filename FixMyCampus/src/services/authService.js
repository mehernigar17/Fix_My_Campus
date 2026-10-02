// Service: Handles all API calls related to authentication
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach JWT token to every request if available
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('fmc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Login user (student or admin)
 * @param {{ email: string, password: string, role: string }} credentials
 * @returns {Promise<{ token: string, user: Object }>}
 */
export const loginUser = async ({ email, password, role }) => {
  const { data } = await authApi.post('/auth/login', { email, password, role });
  if (data.token) {
    localStorage.setItem('fmc_token', data.token);
    localStorage.setItem('fmc_user', JSON.stringify(data.user));
  }
  return data;
};

/**
 * Logout current user
 */
export const logoutUser = () => {
  localStorage.removeItem('fmc_token');
  localStorage.removeItem('fmc_user');
};

/**
 * Get current authenticated user from localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('fmc_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('fmc_token');
};
