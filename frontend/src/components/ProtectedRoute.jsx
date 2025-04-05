import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log('ProtectedRoute - Auth State:', { isAuthenticated, user, token });
  console.log('ProtectedRoute - Allowed Roles:', allowedRoles);

  // Check if we have a token in localStorage as a fallback
  const localStorageToken = localStorage.getItem('token');

  // If not authenticated and no token in localStorage, redirect to login
  if (!isAuthenticated && !localStorageToken) {
    console.log('ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we have a user but their role is not allowed, redirect to home
  if (user && !allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute - User role not allowed, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // If we have a token but no user data, try to fetch the user profile
  if (localStorageToken && !user) {
    console.log('ProtectedRoute - Token exists but no user data, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;