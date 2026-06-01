const API_BASE_URL = '/api';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function notifyAuthChanged() {
  window.dispatchEvent(new Event('auth:changed'));
}

function persistAuth(data) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  notifyAuthChanged();
}

/**
 * Login user and store JWT token
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();

  persistAuth(data);
  
  return data;
};

/**
 * Logout user and clear stored data
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthChanged();
};

/**
 * Get stored JWT token
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get stored user data
 * @returns {object|null}
 */
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Check if user is admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  const user = getUser();
  return user && user.role === 'admin';
};

/**
 * Make authenticated API request
 * @param {string} url
 * @param {object} options - fetch options
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, clear stored auth data
  if (response.status === 401 || response.status === 403) {
    logout();
    throw new Error('Authentication expired. Please login again.');
  }

  return response;
};
