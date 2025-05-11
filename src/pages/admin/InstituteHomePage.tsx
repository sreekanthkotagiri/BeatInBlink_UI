// File: src/pages/InstituteHomePage.tsx
import React from 'react';
import '../../App.css';
import { useAuth } from './../../context/AuthContext';
import Sidebar from '../../components/ui/Sidebar';
import { useInstituteDashboard } from '../../hooks/useInstituteDashboard';
import { StatCard } from '../../components/ui/input';
import RecentExams from './RecentExams';

const InstituteHomePage = () => {
  const { authState, isAuthenticated, isAuthInitialized } = useAuth();

  if (!isAuthInitialized || authState.currentRole !== 'institute' || !authState.institute) {
    return null;
  }

  const dashboard = useInstituteDashboard();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          enabledTabs={[
            'dashboard',
            'manageStudents',
            'manageExams',
            'results',
            'announcements',
          ]}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Dashboard Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Exams Created" value={dashboard.totalExams} />
            <StatCard title="Students Enrolled" value={dashboard.totalStudents} />
            <StatCard title="Exams Enabled" value={dashboard.examsEnabled} />
            <StatCard title="Exams Scheduled Today" value={dashboard.examsToday} />
          </div>

          {/* Action Buttons */}
          {/* <div className="mt-6 flex flex-wrap gap-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => navigate('/institute/manage-exams')}
            >
              Create Exam
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Register Student</button>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded">Bulk Upload</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">View All Results</button>
          </div> */}

          <div className="mt-8">
            <RecentExams exams={dashboard.recentExams} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstituteHomePage;
