import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocalHospital,
  MedicalServices,
  Science,
  Schedule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocalHospital fontSize="large" color="primary" />,
      title: 'Expert Doctors',
      description: 'Consult with experienced healthcare professionals',
    },
    {
      icon: <MedicalServices fontSize="large" color="primary" />,
      title: 'Quality Medicines',
      description: 'Access to high-quality, authentic medications',
    },
    {
      icon: <Science fontSize="large" color="primary" />,
      title: 'Lab Tests',
      description: 'Comprehensive diagnostic services',
    },
    {
      icon: <Schedule fontSize="large" color="primary" />,
      title: 'Easy Appointments',
      description: 'Book appointments at your convenience',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9))',
          position: 'relative',
          overflow: 'hidden',
          pt: 8,
          pb: 12,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: { xs: 4, md: 0 } }}>
                <img
                  src="/logo.png"
                  alt="Dr Agrawal Healthcare Clinic"
                  style={{ width: '200px', marginBottom: '2rem' }}
                />
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2,
                    color: 'primary.main',
                  }}
                >
                  Your Health, Our Priority
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    color: 'text.secondary',
                    lineHeight: 1.6,
                  }}
                >
                  Providing affordable and quality healthcare services for all
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/doctors')}
                  sx={{
                    mr: 2,
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                  }}
                >
                  Book Appointment
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/medicines')}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                  }}
                >
                  View Medicines
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    bottom: -20,
                    left: -20,
                    background: 'linear-gradient(45deg, #e3f2fd, #bbdefb)',
                    borderRadius: '50%',
                    zIndex: -1,
                  },
                }}
              >
                <img
                  src="/hero-image.png"
                  alt="Healthcare Services"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '500px',
                    objectFit: 'contain',
                    borderRadius: '10px',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          sx={{ mb: 6, fontWeight: 600 }}
        >
          Our Services
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4,
                  },
                }}
                elevation={2}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h3" gutterBottom>
                Ready to experience better healthcare?
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                Join thousands of satisfied patients who trust Dr Agrawal Healthcare Clinic
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                }}
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 