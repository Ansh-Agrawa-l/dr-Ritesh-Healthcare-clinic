import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  People,
  LocalHospital,
  Event,
  Science,
  Warning,
} from '@mui/icons-material';
import { adminApi } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, appointmentsResponse] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAppointments(),
      ]);
      setStats(statsResponse.data);
      setRecentAppointments(appointmentsResponse.data.slice(0, 5)); // Get latest 5 appointments
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: <People fontSize="large" color="primary" />,
    },
    {
      title: 'Total Doctors',
      value: stats?.totalDoctors || 0,
      icon: <LocalHospital fontSize="large" color="primary" />,
    },
    {
      title: 'Today\'s Appointments',
      value: stats?.todayAppointments || 0,
      icon: <Event fontSize="large" color="primary" />,
    },
    {
      title: 'Pending Lab Tests',
      value: stats?.pendingLabTests || 0,
      icon: <Science fontSize="large" color="primary" />,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid item key={card.title} xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>{card.icon}</Box>
                  <Typography variant="h6" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Appointments */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Appointments
          </Typography>
          <List>
            {recentAppointments.map((appointment, index) => (
              <Box key={appointment._id}>
                <ListItem>
                  <ListItemIcon>
                    <Event color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${appointment.patient?.name || 'Unknown Patient'} - ${appointment.doctor?.name || 'Unknown Doctor'}`}
                    secondary={`Date: ${new Date(appointment.appointmentDate).toLocaleDateString()} | Status: ${appointment.status}`}
                  />
                </ListItem>
                {index < recentAppointments.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Alerts
          </Typography>
          <List>
            {stats?.alerts?.map((alert, index) => (
              <Box key={alert.id}>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={alert.title}
                    secondary={alert.message}
                  />
                </ListItem>
                {index < stats.alerts.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard; 