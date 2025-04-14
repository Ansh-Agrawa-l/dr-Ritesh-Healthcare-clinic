import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://dr-ritesh-healthcare-clinic.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 60000,
  retry: 3,
  retryDelay: 2000
});

// Add retry interceptor
api.interceptors.response.use(null, async (error) => {
  if (error.code === 'ECONNABORTED' || error.response?.status === 504) {
    const config = error.config;
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;
    if (config.retryCount >= config.retry) {
      return Promise.reject(error);
    }

    config.retryCount += 1;
    console.log(`Retrying request (${config.retryCount}/${config.retry})`);
    
    const delayRetry = new Promise(resolve => {
      setTimeout(resolve, config.retryDelay || 2000);
    });

    await delayRetry;
    return api(config);
  }
  return Promise.reject(error);
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle validation errors
      if (error.response.status === 400 && error.response.data.errors) {
        const validationErrors = error.response.data.errors;
        console.error('Validation errors:', validationErrors);
        // You can handle validation errors here, e.g., show them to the user
        return Promise.reject({
          message: 'Validation failed',
          errors: validationErrors
        });
      }
      
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('Request error:', {
        message: error.message,
        code: error.code,
        config: error.config
      });
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
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
  getAppointments: () => api.get('/appointments'),
  bookAppointment: (data) => api.post('/appointments', data),
  cancelAppointment: (id) => api.patch(`/appointments/${id}/cancel`),
  getProfile: () => api.get('/patients/profile'),
  updateProfile: (data) => api.put('/patients/profile', data),
  getLabTests: () => api.get('/lab-tests'),
  bookLabTest: (data) => api.post('/patients/lab-tests/book', data),
  getLabTestHistory: () => api.get('/lab-tests/history'),
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