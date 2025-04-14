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
  People as PeopleIcon,
  CalendarMonth as CalendarIcon,
  MedicalServices as MedicalIcon,
} from '@mui/icons-material';
import { fetchDashboardStats } from '../store/slices/adminSlice';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);
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
            Admin Dashboard
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
          {/* Doctors Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MedicalIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Doctors</Typography>
                </Box>
                <Typography variant="h4">{stats?.doctors || 0}</Typography>
                <Typography color="text.secondary">
                  Active doctors in the system
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Patients Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Patients</Typography>
                </Box>
                <Typography variant="h4">{stats?.patients || 0}</Typography>
                <Typography color="text.secondary">
                  Registered patients
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Appointments Stats */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Appointments</Typography>
                </Box>
                <Typography variant="h4">{stats?.appointments || 0}</Typography>
                <Typography color="text.secondary">
                  Total appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {/* Add activity list component here */}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default AdminDashboard; 