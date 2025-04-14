import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import { patientsApi } from '../../services/api';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await patientsApi.getAppointments();
      console.log('Raw appointments data:', JSON.stringify(response.data, null, 2));
      
      const transformedAppointments = response.data.map(appointment => {
        console.log('Processing appointment:', JSON.stringify(appointment, null, 2));
        return {
          ...appointment,
          date: appointment.date || appointment.appointmentDate,
          time: appointment.time || appointment.appointmentTime || appointment.slot || appointment.timeSlot || 'Not specified',
          status: (appointment.status || 'unknown').toLowerCase()
        };
      });
      
      console.log('Transformed appointments:', JSON.stringify(transformedAppointments, null, 2));
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await patientsApi.cancelAppointment(appointmentId);
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const canCancelAppointment = (status) => {
    if (!status) return false;
    const lowerStatus = status.toLowerCase();
    return lowerStatus === 'scheduled';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.log('Invalid date string:', dateString);
        return 'Date not set';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'Date string:', dateString);
      return 'Date not set';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString || timeString === 'Not specified') return timeString;
    
    try {
      if (typeof timeString === 'string') {
        if (timeString.includes('AM') || timeString.includes('PM')) {
          return timeString;
        }
        
        if (timeString.includes(':')) {
          const [hours, minutes] = timeString.split(':');
          const date = new Date();
          date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
          return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        }
      }
      
      if (typeof timeString === 'object') {
        return timeString.startTime || timeString.time || 'Not specified';
      }
      
      return timeString;
    } catch (error) {
      console.error('Error formatting time:', error, 'Time string:', timeString);
      return timeString;
    }
  };

  const getDoctorName = (doctor) => {
    if (!doctor) return 'Doctor not assigned';
    if (typeof doctor === 'string') return doctor;
    if (doctor.name) return doctor.name;
    if (doctor.firstName && doctor.lastName) {
      return `${doctor.firstName} ${doctor.lastName}`;
    }
    return 'Unknown Doctor';
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Appointments
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => {
                console.log('Rendering appointment:', JSON.stringify(appointment, null, 2));
                const canCancel = canCancelAppointment(appointment.status);
                console.log('Can cancel appointment:', canCancel, 'Status:', appointment.status);
                return (
                  <TableRow key={appointment._id}>
                    <TableCell>
                      {getDoctorName(appointment.doctor)}
                    </TableCell>
                    <TableCell>{formatDate(appointment.date)}</TableCell>
                    <TableCell>{formatTime(appointment.time)}</TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status || 'Unknown'}
                        color={getStatusColor(appointment.status)}
                      />
                    </TableCell>
                    <TableCell>
                      {canCancel && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleCancel(appointment._id)}
                          size="small"
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyAppointments; 