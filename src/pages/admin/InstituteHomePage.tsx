import React from 'react';
import { useAuth } from './../../context/AuthContext';
import { useInstituteDashboard } from '../../hooks/useInstituteDashboard';
import InstitutePageLayout from '../../components/layout/InstitutePageLayout';
import RecentExams from './RecentExams';

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="p-6 bg-white/80 shadow-md rounded-2xl border border-blue-100 hover:shadow-lg transition transform hover:-translate-y-1">
    <h4 className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wide">{title}</h4>
    <p className="text-3xl font-bold text-blue-700">{value}</p>
  </div>
);

const InstituteHomePage = () => {
  const { authState, isAuthenticated, isAuthInitialized } = useAuth();

  if (!isAuthInitialized || authState.currentRole !== 'institute' || !authState.institute) {
    return null;
  }

  const dashboard = useInstituteDashboard();

  return (
    <InstitutePageLayout
      enabledTabs={['dashboard', 'manageStudents', 'manageExams', 'results', 'announcements']}
    >
      <h2 className="text-2xl font-bold text-blue-800 mb-6">📊 Institute Dashboard</h2>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Exams Created" value={dashboard.totalExams} />
        <StatCard title="Students Enrolled" value={dashboard.totalStudents} />
        <StatCard title="Exams Enabled" value={dashboard.examsEnabled} />
        <StatCard title="Exams Scheduled Today" value={dashboard.examsToday} />
      </div>

      {/* Recent Exams */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📝 Upcoming / Recent Exams</h3>
        <RecentExams exams={dashboard.recentExams} />
      </div>
    </InstitutePageLayout>
  );
};

export default InstituteHomePage;
