import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { patientsApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      // Check authentication before making request
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('MyAppointments - No token found');
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      setLoading(true);
      console.log('MyAppointments - Fetching appointments with token:', {
        token: token,
        user: user
      });

      const response = await patientsApi.getAppointments();
      console.log('MyAppointments - Raw appointment data:', response.data);
      
      const processedAppointments = response.data.map(appointment => {
        console.log('Processing appointment:', {
          id: appointment._id,
          rawStatus: appointment.status,
          processedStatus: appointment.status?.toLowerCase() || 'pending',
          canCancel: appointment.status?.toLowerCase() === 'pending' || appointment.status?.toLowerCase() === 'confirmed'
        });
        return {
          ...appointment,
          status: appointment.status?.toLowerCase() || 'pending',
          date: appointment.appointmentDate || new Date().toISOString(),
          time: appointment.timeSlot || 'Not specified'
        };
      });

      console.log('MyAppointments - Processed appointments:', processedAppointments);
      setAppointments(processedAppointments);
      setRetryCount(0);
    } catch (error) {
      console.error('MyAppointments - Error fetching appointments:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });

      if (error.response?.status === 401) {
        console.log('MyAppointments - Unauthorized, redirecting to login');
        localStorage.removeItem('token');
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      if (error.message.includes('timeout') && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`MyAppointments - Retrying in ${delay}ms (attempt ${retryCount + 1})`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, delay);
      } else {
        toast.error('Failed to fetch appointments. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, retryCount]);

  const handleCancelAppointment = (appointment) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Your session has expired. Please log in again.');
      navigate('/login');
      return;
    }
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const confirmCancelAppointment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      await patientsApi.cancelAppointment(selectedAppointment._id);
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        toast.error('Failed to cancel appointment');
      }
    } finally {
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const canCancelAppointment = (appointment) => {
    const status = appointment.status?.toLowerCase();
    console.log('Checking if appointment can be cancelled:', {
      id: appointment._id,
      status: status,
      canCancel: status === 'scheduled' || status === 'confirmed'
    });
    return status === 'scheduled' || status === 'confirmed';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        My Appointments
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>
                  {new Date(appointment.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {appointment.time || 'Not specified'}
                </TableCell>
                <TableCell>
                  {appointment.doctor?.name || 'Not specified'}
                </TableCell>
                <TableCell>
                  <Typography
                    color={
                      appointment.status === 'completed'
                        ? 'success.main'
                        : appointment.status === 'cancelled'
                        ? 'error.main'
                        : 'warning.main'
                    }
                  >
                    {appointment.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  {canCancelAppointment(appointment) && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleCancelAppointment(appointment)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this appointment?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No</Button>
          <Button onClick={confirmCancelAppointment} color="error">
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyAppointments; 