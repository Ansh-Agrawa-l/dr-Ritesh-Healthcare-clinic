import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import { adminApi } from '../../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    totalLabTests: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalMedicines: 0,
    lowStockMedicines: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminApi.getStats();
      setStats(response.data);
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
          Admin Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Total Doctors */}
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
              Total Doctors
            </Typography>
            <Typography variant="h4">
              {stats.totalDoctors}
            </Typography>
          </Paper>
        </Grid>

        {/* Total Patients */}
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
              Total Patients
            </Typography>
            <Typography variant="h4">
              {stats.totalPatients}
            </Typography>
          </Paper>
        </Grid>

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

        {/* Total Lab Tests */}
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
              Total Lab Tests
            </Typography>
            <Typography variant="h4">
              {stats.totalLabTests}
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

        {/* Total Medicines */}
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
              Total Medicines
            </Typography>
            <Typography variant="h4">
              {stats.totalMedicines}
            </Typography>
          </Paper>
        </Grid>

        {/* Low Stock Medicines */}
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
              Low Stock Medicines
            </Typography>
            <Typography variant="h4">
              {stats.lowStockMedicines}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 