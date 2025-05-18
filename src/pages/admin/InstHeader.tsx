import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InstituteHeader = () => {
  const { isAuthenticated, logout, authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState?.currentRole !== 'institute') {
      logout();
      navigate('/login');
    }
  }, [authState]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return isAuthenticated && authState?.currentRole === 'institute' ? (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10 h-20">
      <div className="h-full flex justify-between items-center px-6">
        {/* Logo */}
        <div className="h-full flex items-center">
          <img
            src="/beatinblink3.png"
            alt="BeatInBlink Logo"
            className="h-full object-contain"
            style={{ maxWidth: '280px' }}
          />
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-6 text-sm text-gray-700 font-medium">
          <span className="hidden sm:block">
            👋 Hello, <span className="text-blue-700 font-semibold">{authState.institute?.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  ) : null;
};

export default InstituteHeader;
