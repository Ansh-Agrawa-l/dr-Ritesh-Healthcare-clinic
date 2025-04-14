import axios from 'axios';

// Update the baseURL to use the correct backend URL
const baseURL = import.meta.env.VITE_API_URL || 'https://dr-ritesh-healthcare-clinic.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // Increased timeout to 30 seconds
});

// Helper function to get and validate token
const getValidToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('API - No token found in localStorage');
    return null;
  }
  return token;
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Skip token check for login and register endpoints
    if (config.url === '/auth/login' || config.url === '/auth/register') {
      console.log('API - Request - Skipping token for auth endpoints');
      return config;
    }

    const token = getValidToken();
    
    if (token) {
      // Ensure token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      // Log the exact token format being sent
      console.log('API - Request - Token details:', {
        url: config.url,
        method: config.method,
        tokenLength: formattedToken.length,
        tokenPrefix: formattedToken.substring(0, 20) + '...',
        fullHeaders: {
          ...config.headers,
          Authorization: formattedToken
        }
      });

      config.headers.Authorization = formattedToken;
    } else {
      console.warn('API - Request - No token available for:', {
        url: config.url,
        method: config.method,
        currentHeaders: config.headers
      });
    }
    
    return config;
  },
  (error) => {
    console.error('API - Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API - Response - Success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      code: error.code
    };
    
    console.error('API - Response - Error:', errorDetails);
    
    if (error.code === 'ECONNABORTED') {
      console.error('API - Request was aborted:', {
        url: error.config.url,
        timeout: error.config.timeout
      });
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    
    if (error.response?.status === 401) {
      console.log('API - Response - Unauthorized, clearing token and redirecting');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API endpoints with improved error handling
export const authApi = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        console.log('API - Login - Token stored successfully');
      }
      return response;
    } catch (error) {
      console.error('API - Login error:', error.response?.data);
      throw error;
    }
  },
  register: (userData) => api.post('/auth/register', userData),
  getProfile: async () => {
    const token = getValidToken();
    if (!token) throw new Error('No authentication token available');
    return api.get('/auth/profile');
  },
};

export const doctorsApi = {
  getAll: () => api.get('/doctors'),
  getProfile: () => api.get('/doctors/profile'),
  updateProfile: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.patch('/doctors/profile', formData, config);
  },
  getAppointments: () => api.get('/doctors/appointments'),
  updateAppointmentStatus: (id, status) => api.patch(`/doctors/appointments/${id}`, { status }),
  getMedicines: () => api.get('/medicines'),
};

export const patientsApi = {
  getAppointments: async () => {
    try {
      const token = getValidToken();
      if (!token) {
        console.error('API - getAppointments - No token available');
        throw new Error('No authentication token available');
      }
      console.log('API - getAppointments - Making request with token');
      const response = await api.get('/appointments');
      console.log('API - getAppointments - Response received:', response.data);
      return response;
    } catch (error) {
      console.error('API - getAppointments - Error:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
      throw error;
    }
  },
  bookAppointment: async (data) => {
    const token = getValidToken();
    if (!token) throw new Error('No authentication token available');
    return api.post('/appointments', data);
  },
  cancelAppointment: async (id) => {
    const token = getValidToken();
    if (!token) throw new Error('No authentication token available');
    return api.patch(`/appointments/${id}/cancel`);
  },
  getProfile: async () => {
    const token = getValidToken();
    if (!token) throw new Error('No authentication token available');
    return api.get('/patients/profile');
  },
  updateProfile: async (data) => {
    const token = getValidToken();
    if (!token) throw new Error('No authentication token available');
    return api.put('/patients/profile', data);
  },
  getLabTests: async () => {
    const token = getValidToken();
    if (!token) throw new Error('No authentication token available');
    return api.get('/lab-tests');
  },
  bookLabTest: async (data) => {
    const token = getValidToken();
    if (!token) throw new Error('No authentication token available');
    return api.post('/patients/lab-tests/book', data);
  },
  getLabTestHistory: async () => {
    const token = getValidToken();
    if (!token) throw new Error('No authentication token available');
    return api.get('/lab-tests/history');
  },
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getDoctors: () => api.get('/admin/doctors'),
  getAppointments: () => api.get('/admin/appointments'),
  addDoctor: (formData) => {
    return api.post('/admin/doctors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  updateDoctor: (id, formData) => {
    return api.put(`/admin/doctors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
  getMedicines: () => api.get('/medicines'),
  getLabTests: () => api.get('/admin/lab-tests'),
  createLabTest: (data) => api.post('/admin/lab-tests', data),
  updateLabTest: (id, data) => api.put(`/admin/lab-tests/${id}`, data),
  deleteLabTest: (id) => api.delete(`/admin/lab-tests/${id}`),
  getLabTestBookings: () => api.get('/admin/lab-tests/bookings'),
  updateLabTestBookingStatus: (id, status) => 
    api.patch(`/admin/lab-tests/bookings/${id}/status`, { status }),
  createMedicine: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log('Upload progress:', percentCompleted);
      }
    };
    return api.post('/medicines/admin', formData, config);
  },
  updateMedicine: (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.put(`/medicines/admin/${id}`, formData, config);
  },
  deleteMedicine: (id) => api.delete(`/medicines/admin/${id}`),
};

// Medicines API
export const medicinesApi = {
  getAll: () => api.get('/medicines'),
  getOrders: () => api.get('/medicines/orders'),
  orderMedicine: (data) => api.post('/medicines', data),
};

// Lab Tests API
export const labTestsApi = {
  getAllLabTests: () => api.get('/lab-tests'),
  getLabTestById: (id) => api.get(`/lab-tests/${id}`),
  bookLabTest: (data) => api.post('/lab-tests/book', data),
  getBookings: () => api.get('/lab-tests/bookings'),
};

export default api;