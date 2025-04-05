import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import { toast } from 'react-toastify';
import { adminApi } from '../../services/api';
import { Check as CheckIcon, Close as CloseIcon, Pending as PendingIcon } from '@mui/icons-material';

const ManageLabTestBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      console.log('Fetching lab test bookings...');
      const response = await adminApi.getLabTestBookings();
      console.log('Bookings response:', response.data);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch lab test bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [bookingId]: true }));
      await adminApi.updateLabTestBookingStatus(bookingId, newStatus);
      toast.success('Status updated successfully');
      
      // Update the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon />;
      case 'completed':
        return <CheckIcon />;
      case 'cancelled':
        return <CloseIcon />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <Typography variant="h4" gutterBottom>
        Lab Test Bookings
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Method</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>
                  {booking.patient?.name || 'Unknown Patient'}
                  <Typography variant="caption" display="block" color="textSecondary">
                    {booking.patient?.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  {booking.labTest?.name || 'Unknown Test'}
                  <Typography variant="caption" display="block" color="textSecondary">
                    Duration: {booking.labTest?.duration}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(booking.date)}</TableCell>
                <TableCell>₹{booking.price}</TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      disabled={updatingStatus[booking._id]}
                      startAdornment={
                        <Tooltip title={booking.status}>
                          <IconButton size="small" sx={{ mr: 1 }}>
                            {getStatusIcon(booking.status)}
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{booking.paymentMethod}</TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ManageLabTestBookings; 