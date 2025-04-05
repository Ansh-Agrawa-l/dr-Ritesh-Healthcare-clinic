import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Public Pages
import Home from '../pages/Home';
import DoctorsList from '../pages/DoctorsList';
import MedicinesList from '../pages/MedicinesList';
import LabTestsList from '../pages/LabTestsList';

// Patient Pages
import PatientDashboard from '../pages/patient/Dashboard';
import BookAppointment from '../pages/patient/BookAppointment';
import MyAppointments from '../pages/patient/MyAppointments';
import OrderMedicine from '../pages/patient/OrderMedicine';
import LabTests from '../pages/patient/LabTests';
import Orders from '../pages/patient/Orders';
import Profile from '../pages/patient/Profile';
import MyLabTests from '../pages/patient/MyLabTests';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/Dashboard';
import ManageAppointments from '../pages/doctor/ManageAppointments';
import DoctorProfile from '../pages/doctor/Profile';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageDoctors from '../pages/admin/ManageDoctors';
import ManageMedicines from '../pages/admin/ManageMedicines';
import ManageLabTests from '../pages/admin/ManageLabTests';
import ManageLabTestBookings from '../pages/admin/ManageLabTestBookings';
import ManageUsers from '../pages/admin/ManageUsers';

const AppRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<DoctorsList />} />
        <Route path="/medicines" element={<MedicinesList />} />
        <Route path="/lab-tests" element={<LabTestsList />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
        />
      </Route>

      {/* Protected Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
        <Route path="/patient" element={<MainLayout />}>
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="medicines" element={<OrderMedicine />} />
          <Route path="medicines/:id" element={<OrderMedicine />} />
          <Route path="lab-tests" element={<LabTests />} />
          <Route path="lab-tests/:id" element={<LabTests />} />
          <Route path="my-lab-tests" element={<MyLabTests />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Protected Doctor Routes */}
      <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
        <Route path="/doctor" element={<MainLayout />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<ManageAppointments />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<MainLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="medicines" element={<ManageMedicines />} />
          <Route path="lab-tests" element={<ManageLabTests />} />
          <Route path="lab-test-bookings" element={<ManageLabTestBookings />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="appointments" element={<ManageAppointments />} />
        </Route>
      </Route>

      {/* Dashboard Redirect */}
      <Route
        path="/dashboard"
        element={
          <Navigate
            to={
              user?.role === 'admin'
                ? '/admin/dashboard'
                : user?.role === 'doctor'
                ? '/doctor/dashboard'
                : '/patient/dashboard'
            }
          />
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;