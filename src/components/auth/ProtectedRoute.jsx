// --- Archivo: src/components/auth/ProtectedRoute.jsx ---
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div></div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
export default ProtectedRoute;