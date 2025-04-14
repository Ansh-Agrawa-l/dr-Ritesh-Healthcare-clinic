import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import { doctorsApi } from '../../services/api';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await doctorsApi.getAppointments();
      const appointments = response.data;
      
      const stats = {
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(a => a.status === 'pending').length,
        completedAppointments: appointments.filter(a => a.status === 'completed').length,
        cancelledAppointments: appointments.filter(a => a.status === 'cancelled').length,
      };
      
      setStats(stats);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Doctor Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Total Appointments */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" gutterBottom>
              Total Appointments
            </Typography>
            <Typography variant="h4">
              {stats.totalAppointments}
            </Typography>
          </Paper>
        </Grid>

        {/* Pending Appointments */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              backgroundColor: 'warning.light',
            }}
          >
            <Typography color="text.secondary" gutterBottom>
              Pending Appointments
            </Typography>
            <Typography variant="h4">
              {stats.pendingAppointments}
            </Typography>
          </Paper>
        </Grid>

        {/* Completed Appointments */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              backgroundColor: 'success.light',
            }}
          >
            <Typography color="text.secondary" gutterBottom>
              Completed Appointments
            </Typography>
            <Typography variant="h4">
              {stats.completedAppointments}
            </Typography>
          </Paper>
        </Grid>

        {/* Cancelled Appointments */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              backgroundColor: 'error.light',
            }}
          >
            <Typography color="text.secondary" gutterBottom>
              Cancelled Appointments
            </Typography>
            <Typography variant="h4">
              {stats.cancelledAppointments}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDashboard; 