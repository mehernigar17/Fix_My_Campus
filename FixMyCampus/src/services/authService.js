// Service: Handles all API calls related to authentication
import { api, TOKEN_KEY, USER_KEY, getStoredToken } from './apiClient';

const persistSession = ({ token, user }) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Login user (student or admin)
 * @param {{ email: string, password: string, role: string }} credentials
 * @returns {Promise<{ token: string, user: Object }>}
 * @throws  axios error carrying the API's message (401/403 from the server)
 */
export const loginUser = async ({ email, password, role }) => {
  const { data } = await api.post('/auth/login', {
    email: (email || '').trim(),
    password,
    role,
  });

  persistSession({ token: data.token, user: data.user });
  return data;
};

/**
 * Register a new account. The API returns a token straight away,
 * so the new user lands already signed in.
 */
export const registerUser = async ({ name, email, password, role }) => {
  const { data } = await api.post('/auth/register', {
    name: (name || '').trim(),
    email: (email || '').trim(),
    password,
    role,
  });

  persistSession({ token: data.token, user: data.user });
  return data;
};

/**
 * Verify the stored token against GET /auth/me (e.g. on page reload).
 */
export const fetchCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  if (data?.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data?.user || null;
};

/**
 * Logout current user
 */
export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get current authenticated user from localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => !!getStoredToken();