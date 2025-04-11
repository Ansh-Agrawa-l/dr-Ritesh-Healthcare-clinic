import { authApi } from './api';

export const login = async (credentials) => {
  try {
    const response = await authApi.login(credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await authApi.register(userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await authApi.getProfile();
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};