import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  // Redirect to role-specific dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.role === 'doctor') {
    return <Navigate to="/doctor/dashboard" replace />;
  } else if (user?.role === 'patient') {
    return <Navigate to="/patient/dashboard" replace />;
  }

  // If no role is set, redirect to login
  return <Navigate to="/login" replace />;
}

export default Dashboard; 