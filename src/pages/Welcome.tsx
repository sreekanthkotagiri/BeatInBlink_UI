import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 Welcome to EduExamine!</h1>
        <p className="text-gray-700 mb-6">You are successfully logged in.</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Welcome;
