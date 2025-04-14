import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      console.log('AuthSlice - Login Start');
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      console.log('AuthSlice - Login Success - Full Payload:', action.payload);
      
      if (!action.payload || !action.payload.token) {
        console.error('AuthSlice - Login Success - Missing token in payload');
        return;
      }

      // Store token in localStorage first
      localStorage.setItem('token', action.payload.token);
      console.log('AuthSlice - Token stored in localStorage');
      
      // Update state
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      console.log('AuthSlice - Login Success - State updated');
    },
    loginFailure: (state, action) => {
      console.log('AuthSlice - Login Failure:', action.payload);
      
      // Clear token from localStorage
      localStorage.removeItem('token');
      console.log('AuthSlice - Token cleared from localStorage');
      
      // Update state
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      
      console.log('AuthSlice - Login Failure - State reset');
    },
    logout: (state) => {
      console.log('AuthSlice - Logout');
      
      // Clear token from localStorage
      localStorage.removeItem('token');
      console.log('AuthSlice - Token cleared from localStorage');
      
      // Update state
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      
      console.log('AuthSlice - Logout - State reset');
    },
    updateUser: (state, action) => {
      console.log('AuthSlice - Update User:', action.payload);
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;

export default authSlice.reducer; 