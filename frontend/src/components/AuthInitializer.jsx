import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials, setLoading } from '../store/slices/authSlice';
import api from '../services/api';
import { CircularProgress, Box } from '@mui/material';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(setLoading(true));
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch(setLoading(false));
        setInitializing(false);
        return;
      }

      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/me');
        dispatch(setCredentials({ user: response.data, token }));
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        navigate('/login');
      } finally {
        dispatch(setLoading(false));
        setInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch, navigate]);

  if (initializing) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer; 