import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';

// Initialize store with default values
const preloadedState = {
  auth: {
    isAuthenticated: false,
    user: null,
    loading: true, // Start with loading true
    error: null,
    token: localStorage.getItem('token') // Get token from localStorage
  },
  patient: {
    patients: [],
    loading: false,
    error: null
  }
};

// Create store with middleware configuration
export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'auth/login/fulfilled',
          'auth/register/fulfilled',
          'auth/setCredentials'
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.token', 'meta.arg'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.token']
      },
      immutableCheck: {
        ignoredPaths: ['auth.token']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
}); 