import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../store/slices/authSlice';
import api from '../services/api';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          dispatch(setCredentials({ user: response.data, token }));
        } catch (error) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    initializeAuth();
  }, [dispatch, navigate]);

  return <>{children}</>;
};

export default AuthInitializer; 