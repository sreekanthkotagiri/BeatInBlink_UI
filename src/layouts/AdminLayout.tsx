import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">EduExamine - Admin</h1>
        <LogoutButton />
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-200 p-2 flex space-x-4">
        <Link to="/admin/dashboard" className="text-gray-800 hover:underline">
          Dashboard
        </Link>
        <Link to="/admin/students" className="text-gray-800 hover:underline">
          Students
        </Link>
        <Link to="/admin/exams" className="text-gray-800 hover:underline">
          Exams
        </Link>
        <Link to="/admin/results" className="text-gray-800 hover:underline">
          Results
        </Link>
      </nav>

      {/* Page Content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
