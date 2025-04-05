import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authApi } from '../services/api';
import { loginSuccess, loginFailure } from '../store/slices/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authApi.getProfile();
          // Ensure we have both user data and token
          if (response.data) {
            dispatch(loginSuccess({ 
              user: response.data,
              token: token
            }));
          } else {
            throw new Error('No user data received');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          dispatch(loginFailure(error.message));
          // Clear invalid token
          localStorage.removeItem('token');
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return children;
};

export default AuthInitializer; 