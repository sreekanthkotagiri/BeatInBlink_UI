// src/layouts/RoleBasedLayout.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import InstituteHeader from '../pages/admin/InstHeader';
import StudentHeader from '../pages/student/StudentHeader';

const RoleBasedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.currentRole) {
      logout();
      navigate('/login');
    }
  }, [authState.currentRole]);

  return (
    <>
      {authState.currentRole === 'institute' && <InstituteHeader />}
      {authState.currentRole === 'student' && <StudentHeader />}
      {children}
    </>
  );
};

export default RoleBasedLayout;
