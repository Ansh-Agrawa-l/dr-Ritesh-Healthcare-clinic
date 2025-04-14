import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from './utils/theme';
import { store } from './store';
import AuthInitializer from './components/AuthInitializer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import ManageAppointments from './pages/ManageAppointments';
import ManagePatients from './pages/ManagePatients';
import ManageDoctors from './pages/ManageDoctors';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return (
    <div role="alert" style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Something went wrong:</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, user } = store.getState().auth;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Router>
              <AuthInitializer>
                <AppRoutes />
              </AuthInitializer>
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
      </Provider>
    </ErrorBoundary>
  );
}

export default App;