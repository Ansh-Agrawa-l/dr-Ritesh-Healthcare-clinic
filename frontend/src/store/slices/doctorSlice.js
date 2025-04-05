import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorsApi } from '../../services/api';

export const getAllDoctors = createAsyncThunk(
  'doctor/getAllDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorsApi.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);

export const getDoctorProfile = createAsyncThunk(
  'doctor/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorsApi.getProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateDoctorProfile = createAsyncThunk(
  'doctor/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await doctorsApi.updateProfile(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const getAllMedicines = createAsyncThunk(
  'doctor/getAllMedicines',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorsApi.getMedicines();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch medicines');
    }
  }
);

const initialState = {
  doctors: [],
  medicines: [],
  currentDoctor: null,
  loading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Doctors
      .addCase(getAllDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(getAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Doctor Profile
      .addCase(getDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoctor = action.payload;
      })
      .addCase(getDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Doctor Profile
      .addCase(updateDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDoctor = action.payload;
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Medicines
      .addCase(getAllMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
      })
      .addCase(getAllMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = doctorSlice.actions;
export default doctorSlice.reducer; 