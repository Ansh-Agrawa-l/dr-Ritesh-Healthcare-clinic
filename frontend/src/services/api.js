import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Base API instance
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin API instance
export const adminApi = axios.create({
  baseURL: `${baseURL}/admin`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Doctor API instance
export const doctorApi = axios.create({
  baseURL: `${baseURL}/doctor`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patient API instance
export const patientApi = axios.create({
  baseURL: `${baseURL}/patient`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Common interceptor function
const setupInterceptors = (instance) => {
  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['x-auth-token'] = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Setup interceptors for all instances
setupInterceptors(api);
setupInterceptors(adminApi);
setupInterceptors(doctorApi);
setupInterceptors(patientApi);

export default api;