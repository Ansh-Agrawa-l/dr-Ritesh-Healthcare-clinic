import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import doctorReducer from './slices/doctorSlice';
import medicineReducer from './slices/medicineSlice';
import labTestReducer from './slices/labTestSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    medicine: medicineReducer,
    labTest: labTestReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store; 