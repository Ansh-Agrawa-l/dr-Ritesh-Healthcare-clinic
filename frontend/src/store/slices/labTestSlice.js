import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { labTestsApi } from '../../services/api';

export const getAllLabTests = createAsyncThunk(
  'labTests/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await labTestsApi.getAllLabTests();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lab tests');
    }
  }
);

const labTestSlice = createSlice({
  name: 'labTests',
  initialState: {
    labTests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllLabTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllLabTests.fulfilled, (state, action) => {
        state.loading = false;
        state.labTests = action.payload;
      })
      .addCase(getAllLabTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default labTestSlice.reducer; 