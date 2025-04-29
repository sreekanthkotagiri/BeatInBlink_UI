// src/components/headers/StudentHeader.tsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentHeader: React.FC = () => {
  const { isAuthenticated, logout, authState } = useAuth();
   const navigate = useNavigate();
 
   useEffect(() => {
     if (authState?.currentRole !== 'student') {
       logout();
       navigate('/login');
     }
   }, [authState]);
 
   const handleLogout = () => {
     logout();
     navigate('/');
   };

  return isAuthenticated && authState?.currentRole === 'student' ? (
      <header className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 sticky top-0 z-10 h-24">
    <div className="w-full h-full flex justify-between items-center px-0">
      
      {/* Force logo to occupy full height and hug left */}
      <div className="h-full pl-6 flex items-center">
        <img
          src="/beatinblink3.png"
          alt="BeatInBlink Logo"
          className="h-full object-contain"
          style={{ maxWidth: '320px' }} // 🛠️ Adjust this for the right width
        />
      </div>
  
      {/* Right side nav */}
      <nav className="flex items-center gap-6 pr-6 text-sm font-medium text-gray-700">
        <span className="text-gray-600 hidden sm:inline">
          👋 Hello, <span className="font-semibold text-green-700">{authState.student?.name}, {authState.student?.institute_name} {authState.student?.branch_name}</span>
        </span>
  
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-sm transition-all"
        >
          Logout
        </button>
      </nav>
    </div>
  </header>
  
    ) : null;
  };

export default StudentHeader;
