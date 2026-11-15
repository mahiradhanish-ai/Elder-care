import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Bearer token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eldercare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor for 401 handling & human-readable network diagnostics
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage only if not already on the login or register page
      const path = window.location.pathname;
      if (!path.startsWith('/login') && !path.startsWith('/register')) {
        localStorage.removeItem('eldercare_token');
        localStorage.removeItem('eldercare_user');
      }
    } else if (!error.response || error.code === 'ERR_NETWORK') {
      // Server down or port 5000 disconnected
      console.warn('Backend server connectivity error:', error.message);
      error.friendlyMessage =
        'Unable to connect to the ElderCare backend API server. Please verify that port 5000 is running.';
    }
    return Promise.reject(error);
  }
);

export default api;
