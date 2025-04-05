import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { medicinesApi } from '../../services/api';

export const getAllMedicines = createAsyncThunk(
  'medicines/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await medicinesApi.getAllMedicines();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch medicines');
    }
  }
);

const medicineSlice = createSlice({
  name: 'medicines',
  initialState: {
    medicines: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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

export default medicineSlice.reducer; 