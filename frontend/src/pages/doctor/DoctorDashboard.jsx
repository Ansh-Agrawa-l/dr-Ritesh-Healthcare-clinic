import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { doctorApi } from '../../services/api';
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
      const response = await doctorApi.get('/appointments');
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

  const todayAppointments = appointments.filter(
    (apt) =>
      new Date(apt.appointmentDate).toDateString() === new Date().toDateString()
  );

  const upcomingAppointments = appointments.filter(
    (apt) =>
      new Date(apt.appointmentDate) > new Date() &&
      apt.status !== 'cancelled' &&
      apt.status !== 'completed'
  );

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
        Doctor Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's Appointments
              </Typography>
              <Typography variant="h3">
                {todayAppointments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Upcoming Appointments
              </Typography>
              <Typography variant="h3">
                {upcomingAppointments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Patients
              </Typography>
              <Typography variant="h3">
                {new Set(appointments.map((apt) => apt.patient._id)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Schedule
              </Typography>
              {todayAppointments.length > 0 ? (
                <Timeline>
                  {todayAppointments
                    .sort((a, b) => {
                      const timeA = new Date(`2000/01/01 ${a.timeSlot}`);
                      const timeB = new Date(`2000/01/01 ${b.timeSlot}`);
                      return timeA - timeB;
                    })
                    .map((appointment, index) => (
                      <TimelineItem key={appointment._id}>
                        <TimelineSeparator>
                          <TimelineDot
                            color={getStatusColor(appointment.status)}
                          />
                          {index < todayAppointments.length - 1 && (
                            <TimelineConnector />
                          )}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Typography variant="subtitle2">
                            {appointment.timeSlot}
                          </Typography>
                          <Typography>
                            {appointment.patient.name}
                          </Typography>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                </Timeline>
              ) : (
                <Typography color="textSecondary">
                  No appointments scheduled for today
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Upcoming Appointments</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/doctor/appointments')}
                >
                  View All
                </Button>
              </Box>
              {upcomingAppointments.slice(0, 5).map((appointment) => (
                <Box
                  key={appointment._id}
                  sx={{
                    p: 2,
                    mb: 1,
                    border: 1,
                    borderColor: 'grey.200',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2">
                    {new Date(
                      appointment.appointmentDate
                    ).toLocaleDateString()}{' '}
                    - {appointment.timeSlot}
                  </Typography>
                  <Typography>{appointment.patient.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {appointment.reason}
                  </Typography>
                </Box>
              ))}
              {upcomingAppointments.length === 0 && (
                <Typography color="textSecondary">
                  No upcoming appointments
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 