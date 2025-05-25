import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user } = useContext(AuthContext);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection (if any)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
