import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';

const preloadedState = {
  auth: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    token: null
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
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.token'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.token']
      },
      immutableCheck: false
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export { store }; 