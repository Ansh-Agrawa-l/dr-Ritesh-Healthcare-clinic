import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { doctorsApi } from '../../services/api';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    notes: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await doctorsApi.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointment = async () => {
    try {
      await doctorsApi.updateAppointmentStatus(selectedAppointment._id, updateForm.status);
      toast.success('Appointment updated successfully');
      setOpenUpdateDialog(false);
      fetchAppointments();
    } catch (error) {
      console.error('Update appointment error:', error);
      toast.error(error.response?.data?.message || 'Failed to update appointment');
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

  const columns = [
    {
      field: 'patient',
      headerName: 'Patient',
      flex: 1,
      valueGetter: (params) => params.row.patient.name,
    },
    {
      field: 'appointmentDate',
      headerName: 'Date',
      flex: 1,
      valueGetter: (params) =>
        new Date(params.row.appointmentDate).toLocaleDateString(),
    },
    { field: 'timeSlot', headerName: 'Time', flex: 1 },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setSelectedAppointment(params.row);
            setUpdateForm({
              status: params.row.status,
              notes: params.row.notes || '',
            });
            setOpenUpdateDialog(true);
          }}
        >
          Update
        </Button>
      ),
    },
  ];

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus =
      filterStatus === 'all' ? true : apt.status === filterStatus;
    const matchesDate = filterDate
      ? dayjs(apt.appointmentDate).format('YYYY-MM-DD') ===
        filterDate.format('YYYY-MM-DD')
      : true;
    return matchesStatus && matchesDate;
  });

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
        Manage Appointments
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="rescheduled">Rescheduled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Filter by Date"
              value={filterDate}
              onChange={setFilterDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={filteredAppointments}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              getRowId={(row) => row._id}
              disableSelectionOnClick
            />
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={updateForm.status}
                label="Status"
                onChange={(e) =>
                  setUpdateForm({ ...updateForm, status: e.target.value })
                }
              >
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="rescheduled">Rescheduled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={4}
              value={updateForm.notes}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, notes: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateAppointment} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageAppointments; 