import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
