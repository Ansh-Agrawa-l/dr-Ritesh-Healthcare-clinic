import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: 'My Appointments',
      description: 'View and manage your appointments',
      path: '/doctor/appointments',
    },
    {
      title: 'Patient Records',
      description: 'Access and update patient records',
      path: '/doctor/patients',
    },
    {
      title: 'Schedule',
      description: 'Manage your availability and schedule',
      path: '/doctor/schedule',
    },
    {
      title: 'Profile',
      description: 'Update your doctor profile',
      path: '/doctor/profile',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Doctor Dashboard
      </Typography>
      <Grid container spacing={3}>
        {dashboardItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {item.title}
                </Typography>
                <Typography color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DoctorDashboard; 