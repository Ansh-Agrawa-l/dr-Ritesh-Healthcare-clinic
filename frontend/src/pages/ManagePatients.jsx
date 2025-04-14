import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { fetchPatients, updatePatient, deletePatient } from '../store/slices/patientSlice';
import { toast } from 'react-toastify';

function ManagePatients() {
  const dispatch = useDispatch();
  const { patients, loading } = useSelector((state) => state.patient);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    medicalHistory: '',
  });

  useEffect(() => {
    const loadPatients = async () => {
      try {
        await dispatch(fetchPatients()).unwrap();
      } catch (error) {
        toast.error('Failed to load patients');
      }
    };
    loadPatients();
  }, [dispatch]);

  const handleOpenDialog = (patient = null) => {
    if (patient) {
      setSelectedPatient(patient);
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        address: patient.address || '',
        medicalHistory: patient.medicalHistory || '',
      });
    } else {
      setSelectedPatient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        medicalHistory: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPatient) {
        await dispatch(updatePatient({
          id: selectedPatient._id,
          ...formData,
        })).unwrap();
        toast.success('Patient updated successfully');
      }
      handleCloseDialog();
    } catch (error) {
      toast.error(error.message || 'Failed to update patient');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await dispatch(deletePatient(id)).unwrap();
        toast.success('Patient deleted successfully');
      } catch (error) {
        toast.error('Failed to delete patient');
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient._id}>
                  <TableCell>
                    <Avatar src={patient.avatar} alt={patient.name} />
                  </TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.address}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(patient)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(patient._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedPatient ? 'Edit Patient' : 'Add Patient'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
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
                rows={2}
              />
              <TextField
                fullWidth
                label="Medical History"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedPatient ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default ManagePatients; 