import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
} from '@mui/material';
import { updateProfile } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{ width: 100, height: 100, mr: 2 }}
              src={user?.avatar}
            />
            <Typography variant="h4" component="h1">
              Profile Settings
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Update Profile
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Profile; 