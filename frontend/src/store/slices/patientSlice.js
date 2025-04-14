import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients');
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patient/updatePatient',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/patients/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient');
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patient/deletePatient',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/patients/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete patient');
    }
  }
);

// Slice
const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    patients: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Patients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Patient
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = state.patients.map((patient) =>
          patient._id === action.payload._id ? action.payload : patient
        );
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Patient
      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = state.patients.filter(
          (patient) => patient._id !== action.payload
        );
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = patientSlice.actions;
export default patientSlice.reducer; 