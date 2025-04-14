import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Grid,
  Link,
  CircularProgress
} from '@mui/material';
import { authApi } from '../../services/api';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient' // Default role
  });

  const handleLogin = async () => {
    if (loading) return; // Prevent multiple submissions
    
    setLoading(true);
    dispatch(loginStart());

    try {
      console.log('Login - Attempting login with:', { ...formData, password: '[REDACTED]' });
      const response = await authApi.login(formData);
      
      // Validate response structure
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      if (!response.data.token) {
        throw new Error('No token received from server');
      }
      
      if (!response.data.user) {
        throw new Error('No user data received from server');
      }

      console.log('Login - Server response validated, dispatching login success');
      
      // Dispatch login success with the validated data
      dispatch(loginSuccess(response.data));

      // Verify token was stored
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        throw new Error('Token was not stored in localStorage');
      }
      
      console.log('Login - Token verified in localStorage');

      toast.success('Login successful!');
      
      // Navigate based on the role from the server
      const userRole = response.data.user.role;
      console.log('Login - Navigating based on role:', userRole);
      
      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'patient':
          navigate('/patient/dashboard');
          break;
        default:
          console.warn('Login - Unknown role:', userRole);
          navigate('/');
      }
    } catch (error) {
      console.error('Login - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Clear any existing token on error
      localStorage.removeItem('token');
      
      dispatch(loginFailure(error.response?.data?.message || error.message || 'Login failed'));
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box 
          sx={{ mt: 1, width: '100%' }}
        >
          <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
            <FormLabel component="legend">Login As</FormLabel>
            <RadioGroup
              aria-label="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              row
            >
              <FormControlLabel 
                value="patient" 
                control={<Radio />} 
                label="Patient" 
              />
              <FormControlLabel 
                value="doctor" 
                control={<Radio />} 
                label="Doctor" 
              />
              <FormControlLabel 
                value="admin" 
                control={<Radio />} 
                label="Admin" 
              />
            </RadioGroup>
          </FormControl>

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button
            onClick={handleLogin}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;