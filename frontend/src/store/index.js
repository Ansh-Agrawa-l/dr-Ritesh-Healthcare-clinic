import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import doctorReducer from './slices/doctorSlice';
import medicineReducer from './slices/medicineSlice';
import labTestReducer from './slices/labTestSlice';
import appointmentReducer from './slices/appointmentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    medicine: medicineReducer,
    labTest: labTestReducer,
    appointment: appointmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store; 