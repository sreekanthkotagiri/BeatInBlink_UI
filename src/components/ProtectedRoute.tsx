// src/components/ProtectedRoute.tsx
import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
  children: JSX.Element;
  role: 'student' | 'institute';
};

const ProtectedRoute = ({ children, role }: Props) => {
  const { authState, isAuthenticated, isAuthInitialized } = useAuth();

  if (!isAuthInitialized) {
    // Wait until auth has been initialized (localStorage loaded, etc.)
    return null; // or <LoadingSpinner />
  }

  if (!isAuthenticated || authState.currentRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
