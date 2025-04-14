import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';

const preloadedState = {
  auth: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  },
  patient: {
    patients: [],
    loading: false,
    error: null
  }
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export { store }; 