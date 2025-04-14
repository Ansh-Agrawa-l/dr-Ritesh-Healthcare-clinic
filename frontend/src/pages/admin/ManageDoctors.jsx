import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { adminApi } from '../../services/api';
import config from '../../config';
import { UPLOADS_URL } from '../../config';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    qualification: '',
    experience: '',
    phone: '',
    address: '',
    photo: null
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await adminApi.getDoctors();
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch doctors');
      setLoading(false);
    }
  };

  const handleOpen = (doctor = null) => {
    if (doctor) {
      setSelectedDoctor(doctor);
      setFormData({
        name: doctor.name,
        email: doctor.email,
        password: '',
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        phone: doctor.phone,
        address: doctor.address,
        photo: null
      });
    } else {
      setSelectedDoctor(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        specialization: '',
        qualification: '',
        experience: '',
        phone: '',
        address: '',
        photo: null
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDoctor(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      specialization: '',
      qualification: '',
      experience: '',
      phone: '',
      address: '',
      photo: null
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Validate required fields
      const requiredFields = ['name', 'email', 'password', 'specialization', 'qualification', 'experience', 'phone', 'address'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'photo' && formData[key]) {
          formDataToSend.append('photo', formData[key]);
        } else if (key !== 'password' || (key === 'password' && formData[key])) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedDoctor) {
        await adminApi.updateDoctor(selectedDoctor._id, formDataToSend);
        toast.success('Doctor updated successfully');
      } else {
        await adminApi.addDoctor(formDataToSend);
        toast.success('Doctor added successfully');
      }
      handleClose();
      fetchDoctors();
    } catch (error) {
      console.error('Error saving doctor:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save doctor';
      const missingFields = error.response?.data?.fields;
      if (missingFields) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await adminApi.deleteDoctor(id);
        toast.success('Doctor deleted successfully');
        fetchDoctors();
      } catch (error) {
        toast.error('Failed to delete doctor');
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Manage Doctors</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Doctor
        </Button>
      </Box>

      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid item key={doctor._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                sx={{
                  height: 300,
                  width: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
                image={doctor.photo ? `${config.UPLOADS_URL}/doctors/${doctor.photo}` : '/default-doctor.jpg'}
                alt={doctor.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {doctor.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {doctor.specialization}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {doctor.qualification}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Experience: {doctor.experience} years
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone: {doctor.phone}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Address: {doctor.address}
                </Typography>
              </CardContent>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  color="primary"
                  onClick={() => handleOpen(doctor)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(doctor._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                {!selectedDoctor && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                )}
                {!selectedDoctor && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={!selectedDoctor}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Experience (years)"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={handlePhotoChange}
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                    >
                      {formData.photo ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                  </label>
                  {formData.photo && (
                    <Typography variant="body2" mt={1}>
                      Selected file: {formData.photo.name}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedDoctor ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageDoctors; 