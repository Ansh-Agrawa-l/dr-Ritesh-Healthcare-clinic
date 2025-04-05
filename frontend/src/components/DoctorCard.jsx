import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating
} from '@mui/material';
import config from '../config';

const DoctorCard = ({ doctor, onBookAppointment }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={doctor.photo ? `${config.UPLOADS_URL}/doctors/${doctor.photo}` : '/default-doctor.jpg'}
        alt={doctor.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {doctor.name}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {doctor.specialization}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {doctor.qualification}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {doctor.experience} years of experience
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={4.5} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            (4.5)
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {doctor.address}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => onBookAppointment(doctor)}
          disabled={!doctor.isAvailable}
        >
          {doctor.isAvailable ? 'Book Appointment' : 'Not Available'}
        </Button>
      </Box>
    </Card>
  );
};

export default DoctorCard; 