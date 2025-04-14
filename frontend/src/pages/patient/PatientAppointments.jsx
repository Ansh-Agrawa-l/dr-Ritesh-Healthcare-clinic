import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Card, CardContent, Typography, Button } from '@mui/material';
import { patientsApi } from '../../services/api';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await patientsApi.getAppointments();
        
        // Extract and transform the data
        const appointmentData = response.data || [];
        const processedData = appointmentData.map(appointment => ({
          id: appointment._id,
          doctorName: appointment.doctor?.name || 'N/A',
          appointmentDate: appointment.appointmentDate, // Keep the original date string
          timeSlot: appointment.timeSlot,
          status: appointment.status,
          reason: appointment.reason,
          original: appointment
        }));
        
        setAppointments(processedData);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    try {
      await patientsApi.cancelAppointment(id);
      setAppointments(prev => prev.filter(app => app.id !== id));
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const columns = [
    {
      field: 'doctorName',
      headerName: 'Doctor',
      width: 200
    },
    {
      field: 'appointmentDate',
      headerName: 'Date',
      width: 150,
      renderCell: (params) => {
        // Parse and format the date string
        const date = dayjs(params.value);
        return date.isValid() ? date.format('DD/MM/YYYY') : 'N/A';
      }
    },
    {
      field: 'timeSlot',
      headerName: 'Time',
      width: 150
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        params.row.status === 'scheduled' && (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleCancelAppointment(params.row.id)}
          >
            Cancel
          </Button>
        )
      )
    }
  ];

  return (
    <Container maxWidth="lg">
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            My Appointments
          </Typography>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={appointments}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              loading={loading}
              autoHeight
              disableSelectionOnClick
              components={{
                NoRowsOverlay: () => (
                  <Typography sx={{ padding: 2 }}>
                    No appointments found
                  </Typography>
                )
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default MyAppointments;