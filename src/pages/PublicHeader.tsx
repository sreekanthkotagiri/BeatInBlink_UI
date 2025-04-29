// src/components/headers/PublicHeader.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const PublicHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <img src="/beatinblink.png" alt="Logo" className="w-44 object-contain" />
        <nav className="space-x-6 text-gray-700 font-medium flex items-center">
          <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default PublicHeader;
