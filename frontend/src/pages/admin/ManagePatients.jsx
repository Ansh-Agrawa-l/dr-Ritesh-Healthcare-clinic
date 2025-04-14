import { useState, useEffect } from 'react';
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
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { adminApi } from '../../services/api';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    medicalHistory: '',
    bloodGroup: '',
    allergies: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await adminApi.get('/patients');
      setPatients(response.data);
    } catch (error) {
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        medicalHistory: patient.medicalHistory || '',
        bloodGroup: patient.bloodGroup || '',
        allergies: patient.allergies || '',
      });
    } else {
      setEditingPatient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        medicalHistory: '',
        bloodGroup: '',
        allergies: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPatient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      medicalHistory: '',
      bloodGroup: '',
      allergies: '',
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatient) {
        await adminApi.put(`/patients/${editingPatient._id}`, formData);
        toast.success('Patient updated successfully');
      } else {
        await adminApi.post('/patients', formData);
        toast.success('Patient added successfully');
      }
      handleCloseDialog();
      fetchPatients();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save patient');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await adminApi.delete(`/patients/${id}`);
        toast.success('Patient deleted successfully');
        fetchPatients();
      } catch (error) {
        toast.error('Failed to delete patient');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            Manage Patients
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Patient
          </Button>
        </Box>

        <Grid container spacing={3}>
          {patients.map((patient) => (
            <Grid item xs={12} sm={6} md={4} key={patient._id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6">{patient.name}</Typography>
                      <Typography color="textSecondary">{patient.email}</Typography>
                      <Typography color="textSecondary">{patient.phone}</Typography>
                      <Typography color="textSecondary">{patient.address}</Typography>
                      {patient.bloodGroup && (
                        <Typography color="textSecondary">
                          Blood Group: {patient.bloodGroup}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <IconButton onClick={() => handleOpenDialog(patient)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(patient._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingPatient ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
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
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Medical History"
                    name="medicalHistory"
                    multiline
                    rows={3}
                    value={formData.medicalHistory}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Blood Group"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingPatient ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ManagePatients; 