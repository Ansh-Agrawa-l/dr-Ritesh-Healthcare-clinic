import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { adminApi } from '../../services/api';

const ManageLabTests = () => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchLabTests();
  }, []);

  const fetchLabTests = async () => {
    try {
      const response = await adminApi.getLabTests();
      setLabTests(response.data);
    } catch (error) {
      toast.error('Failed to fetch lab tests');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = () => {
    setSelectedTest(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
    });
    setOpenDialog(true);
  };

  const handleEditTest = (test) => {
    setSelectedTest(test);
    setFormData({
      name: test.name,
      description: test.description,
      price: test.price,
      duration: test.duration,
      category: test.category,
    });
    setOpenDialog(true);
  };

  const handleDeleteTest = async (id) => {
    if (window.confirm('Are you sure you want to delete this lab test?')) {
      try {
        await adminApi.deleteLabTest(id);
        toast.success('Lab test deleted successfully');
        fetchLabTests();
      } catch (error) {
        toast.error('Failed to delete lab test');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedTest) {
        await adminApi.updateLabTest(selectedTest._id, formData);
        toast.success('Lab test updated successfully');
      } else {
        await adminApi.createLabTest(formData);
        toast.success('Lab test added successfully');
      }
      setOpenDialog(false);
      fetchLabTests();
    } catch (error) {
      toast.error('Failed to save lab test');
    }
  };

  const handleStatusMenuOpen = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleStatusMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const handleStatusUpdate = async (status) => {
    try {
      await adminApi.updateLabTestBookingStatus(selectedBooking._id, status);
      toast.success('Lab test status updated successfully');
      handleStatusMenuClose();
      fetchLabTests();
    } catch (error) {
      toast.error('Failed to update lab test status');
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Manage Lab Tests</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddTest}
        >
          Add Lab Test
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labTests.map((test) => (
              <TableRow key={test._id}>
                <TableCell>{test.name}</TableCell>
                <TableCell>{test.description}</TableCell>
                <TableCell>₹{test.price}</TableCell>
                <TableCell>{test.duration}</TableCell>
                <TableCell>{test.category}</TableCell>
                <TableCell>
                  {test.status && (
                    <Chip
                      label={test.status}
                      color={getStatusColor(test.status)}
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditTest(test)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTest(test._id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={(e) => handleStatusMenuOpen(e, test)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{selectedTest ? 'Edit Lab Test' : 'Add Lab Test'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Duration"
            fullWidth
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Category"
            fullWidth
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedTest ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleStatusMenuClose}
      >
        <MenuItem onClick={() => handleStatusUpdate('pending')}>Mark as Pending</MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('completed')}>Mark as Completed</MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('cancelled')}>Mark as Cancelled</MenuItem>
      </Menu>
    </Container>
  );
};

export default ManageLabTests; 