import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Event as EventIcon,
  Science as ScienceIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';
import { patientsApi } from '../../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await patientsApi.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'rescheduled':
        return 'warning';
      default:
        return 'default';
    }
  };

  const quickActions = [
    {
      title: 'Book Appointment',
      icon: <EventIcon fontSize="large" />,
      path: '/patient/book-appointment',
      color: 'primary.main',
    },
    {
      title: 'Order Medicine',
      icon: <LocalHospitalIcon fontSize="large" />,
      path: '/patient/medicines',
      color: 'secondary.main',
    },
    {
      title: 'Book Lab Test',
      icon: <ScienceIcon fontSize="large" />,
      path: '/patient/lab-tests',
      color: 'success.main',
    },
  ];

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
      <Typography variant="h4" gutterBottom>
        Patient Dashboard
      </Typography>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={4} key={action.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(action.path)}
            >
              <Box sx={{ color: action.color, mb: 2 }}>{action.icon}</Box>
              <Typography variant="h6" component="h3" align="center">
                {action.title}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Upcoming Appointments */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upcoming Appointments
          </Typography>
          {appointments.length > 0 ? (
            <List>
              {appointments
                .filter((apt) => apt.status !== 'completed' && apt.doctor)
                .slice(0, 5)
                .map((appointment) => (
                  <ListItem
                    key={appointment._id}
                    divider
                    secondaryAction={
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    }
                  >
                    <ListItemText
                      primary={`Dr. ${appointment.doctor?.name || 'Unknown Doctor'}`}
                      secondary={`${new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()} - ${appointment.timeSlot}`}
                    />
                  </ListItem>
                ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              No upcoming appointments
            </Typography>
          )}
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/patient/appointments')}
          >
            View All Appointments
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <List>
            {appointments
              .filter((apt) => apt.status === 'completed' && apt.doctor)
              .slice(0, 3)
              .map((appointment) => (
                <ListItem key={appointment._id} divider>
                  <ListItemText
                    primary={`Appointment with Dr. ${appointment.doctor?.name || 'Unknown Doctor'}`}
                    secondary={`Completed on ${new Date(
                      appointment.appointmentDate
                    ).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard; 