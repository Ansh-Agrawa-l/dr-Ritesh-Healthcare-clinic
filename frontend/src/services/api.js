import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://dr-ritesh-healthcare-clinic.vercel.app/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
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