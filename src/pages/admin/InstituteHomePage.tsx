import React from 'react';
import { useAuth } from './../../context/AuthContext';
import { useInstituteDashboard } from '../../hooks/useInstituteDashboard';
import InstitutePageLayout from '../../components/layout/InstitutePageLayout';
import RecentExams from './RecentExams';

const StatCard = ({ title, value, icon }: { title: string; value: number; icon: string }) => (
  <div className="p-8 bg-gradient-to-br from-white to-blue-50/50 shadow-xl rounded-3xl border border-blue-100/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-10 -mt-10"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm text-gray-600 font-semibold mb-2 uppercase tracking-wider">{title}</h4>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{value}</p>
    </div>
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
      <div className="mb-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">📊 Institute Dashboard</h2>
        <p className="text-lg text-gray-600">Welcome back! Here's an overview of your institute's performance.</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard title="Total Exams Created" value={dashboard.totalExams} icon="📝" />
        <StatCard title="Students Enrolled" value={dashboard.totalStudents} icon="👥" />
        <StatCard title="Exams Enabled" value={dashboard.examsEnabled} icon="✅" />
        <StatCard title="Exams Scheduled Today" value={dashboard.examsToday} icon="📅" />
      </div>

      {/* Recent Exams */}
      <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-3xl shadow-xl border border-gray-100/50 p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-3xl">📝</span>
          Upcoming / Recent Exams
        </h3>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden">
          <RecentExams exams={dashboard.recentExams} />
        </div>
      </div>
    </InstitutePageLayout>
  );
};

export default InstituteHomePage;
