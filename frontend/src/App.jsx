import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from './utils/theme';
import StoreProvider from './store/Provider';
import AuthInitializer from './components/AuthInitializer';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManagePatients from './pages/admin/ManagePatients';
import ManageAppointments from './pages/admin/ManageAppointments';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import PatientAppointments from './pages/patient/PatientAppointments';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { useSelector } from 'react-redux';

function LoadingFallback() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
}

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={3}
    >
      <h2>Something went wrong:</h2>
      <pre style={{ color: 'red', maxWidth: '100%', overflow: 'auto' }}>
        {error.message}
      </pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </Box>
  );
}

function AppRoutes() {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={`/${user?.role}/dashboard`} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          isAuthenticated && user?.role === 'admin' ? (
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="doctors" element={<ManageDoctors />} />
              <Route path="patients" element={<ManagePatients />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Doctor Routes */}
      <Route
        path="/doctor/*"
        element={
          isAuthenticated && user?.role === 'doctor' ? (
            <Routes>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="appointments" element={<ManageAppointments />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Patient Routes */}
      <Route
        path="/patient/*"
        element={
          isAuthenticated && user?.role === 'patient' ? (
            <Routes>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="appointments" element={<ManageAppointments />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      <StoreProvider>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Router>
              <Suspense fallback={<LoadingFallback />}>
                <AuthInitializer>
                  <AppRoutes />
                </AuthInitializer>
              </Suspense>
            </Router>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </LocalizationProvider>
        </ThemeProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
}

export default App;