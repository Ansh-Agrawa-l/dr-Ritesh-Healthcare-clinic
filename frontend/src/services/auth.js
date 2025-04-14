import { api } from './api';

export const handleLogin = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;
    
    // Ensure token is properly formatted before storing
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    
    // Store the token
    localStorage.setItem('token', formattedToken);
    console.log('Auth - Token stored successfully:', {
      tokenLength: formattedToken.length,
      tokenPrefix: formattedToken.substring(0, 20) + '...'
    });
    
    return response.data;
  } catch (error) {
    console.error('Auth - Login error:', error);
    throw error;
  }
};

export const handleLogout = () => {
  localStorage.removeItem('token');
  console.log('Auth - Token removed from localStorage');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Check if token is properly formatted
  const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  localStorage.setItem('token', formattedToken); // Update token format if needed
  
  return true;
};

export const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  // Ensure token is properly formatted
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
};