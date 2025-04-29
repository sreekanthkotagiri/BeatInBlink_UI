import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const StudentLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">EduExamine - Student</h1>
        <LogoutButton />
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-blue-100 p-2 flex space-x-4">
        <Link to="/student/dashboard" className="text-blue-700 hover:underline">
          Dashboard
        </Link>
        <Link to="/student/exams" className="text-blue-700 hover:underline">
          Exams
        </Link>
        <Link to="/student/results" className="text-blue-700 hover:underline">
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

export default StudentLayout;
