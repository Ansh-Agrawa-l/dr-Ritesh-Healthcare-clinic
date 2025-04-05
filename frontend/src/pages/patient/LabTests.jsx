import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import { patientsApi } from '../../services/api';

const LabTests = () => {
  const { id } = useParams();
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    prescription: '',
    date: '',
    time: '',
    paymentMethod: 'cash',
  });

  useEffect(() => {
    fetchLabTests();
  }, []);

  const fetchLabTests = async () => {
    try {
      const response = await patientsApi.getLabTests();
      setLabTests(response.data);
      if (id) {
        const test = response.data.find((test) => test._id === id);
        if (test) {
          setSelectedTest(test);
          setOpenDialog(true);
        }
      }
    } catch (error) {
      toast.error('Failed to fetch lab tests');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTest = (test) => {
    setSelectedTest(test);
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await patientsApi.bookLabTest({
        testId: selectedTest._id,
        prescription: formData.prescription,
        date: formData.date,
        time: formData.time,
        paymentMethod: formData.paymentMethod,
      });
      toast.success('Lab test booked successfully!');
      handleCloseDialog();
      fetchLabTests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book lab test');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTest(null);
    setFormData({
      prescription: '',
      date: '',
      time: '',
      paymentMethod: 'cash',
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
        Available Lab Tests
      </Typography>

      <Grid container spacing={3}>
        {labTests.map((test) => (
          <Grid item key={test._id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {test.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {test.description}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  ₹{test.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {test.duration}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => handleBookTest(test)}
                >
                  Book Test
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Book Lab Test</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedTest?.name}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {selectedTest?.description}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            ₹{selectedTest?.price}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Prescription"
            name="prescription"
            fullWidth
            multiline
            rows={4}
            value={formData.prescription}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Date"
            name="date"
            type="date"
            fullWidth
            value={formData.date}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Time"
            name="time"
            type="time"
            fullWidth
            value={formData.time}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Payment Method</InputLabel>
            <Select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              label="Payment Method"
              required
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="netbanking">Net Banking</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Book Test
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LabTests; 