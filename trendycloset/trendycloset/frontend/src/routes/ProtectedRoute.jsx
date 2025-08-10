import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Usage:
 *  <ProtectedRoute>
 *    <DashboardUser />
 *  </ProtectedRoute>
 *
 *  <ProtectedRoute allow={['PARTNER']}>
 *    <DashboardPartner />
 *  </ProtectedRoute>
 */
export default function ProtectedRoute({ children, allow = null }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  // Not logged in -> go to login, remember where you came from
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // If allow is provided, enforce role
  if (Array.isArray(allow) && allow.length > 0 && !allow.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
