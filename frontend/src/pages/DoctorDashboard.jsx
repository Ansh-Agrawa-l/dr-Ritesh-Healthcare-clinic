import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { fetchDashboardStats } from '../store/slices/doctorSlice';
import { toast } from 'react-toastify';

function DoctorDashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.doctor);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        await dispatch(fetchDashboardStats()).unwrap();
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      }
    };
    loadStats();
  }, [dispatch, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Doctor Dashboard
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Today's Appointments */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Today's Appointments</Typography>
                </Box>
                <Typography variant="h4">{stats?.todayAppointments || 0}</Typography>
                <Typography color="text.secondary">
                  Appointments scheduled for today
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Patients */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Patients</Typography>
                </Box>
                <Typography variant="h4">{stats?.totalPatients || 0}</Typography>
                <Typography color="text.secondary">
                  Patients under your care
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Appointments */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Pending Appointments</Typography>
                </Box>
                <Typography variant="h4">{stats?.pendingAppointments || 0}</Typography>
                <Typography color="text.secondary">
                  Appointments awaiting confirmation
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Appointments */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Appointments
              </Typography>
              {/* Add appointments list component here */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default DoctorDashboard; 