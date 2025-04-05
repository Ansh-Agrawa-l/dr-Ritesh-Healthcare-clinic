import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { toast } from 'react-toastify';
import { patientsApi } from '../../services/api';

const MyLabTests = () => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabTests();
  }, []);

  const fetchLabTests = async () => {
    try {
      const response = await patientsApi.getLabTestHistory();
      console.log('Lab test history response:', response);
      setLabTests(response.data);
    } catch (error) {
      console.error('Error fetching lab tests:', error);
      toast.error('Failed to fetch lab test history');
    } finally {
      setLoading(false);
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
        My Lab Tests
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Name</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Method</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labTests.map((test) => (
              <TableRow key={test._id}>
                <TableCell>{test.labTest?.name || 'Unknown Test'}</TableCell>
                <TableCell>
                  {formatDate(test.date)}
                </TableCell>
                <TableCell>₹{test.price}</TableCell>
                <TableCell>
                  <Chip
                    label={test.status}
                    color={getStatusColor(test.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{test.paymentMethod}</TableCell>
              </TableRow>
            ))}
            {labTests.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No lab tests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyLabTests; 