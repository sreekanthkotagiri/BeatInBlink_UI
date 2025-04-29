// File: src/pages/InstituteHomePage.tsx
import React from 'react';
import '../../App.css';
import { useAuth } from './../../context/AuthContext';
import Sidebar from '../../components/ui/Sidebar';
import { useInstituteDashboard } from '../../hooks/useInstituteDashboard';
import DashboardStats from '../../components/dashboard/DashboardStats';
import UpcomingExams from '../../components/dashboard/UpcomingExams';
import RecentActivity from '../../components/dashboard/RecentActivity';

const InstituteHomePage = () => {
  const { authState, isAuthenticated, isAuthInitialized } = useAuth();

  if (!isAuthInitialized || authState.currentRole !== 'institute' || !authState.institute) {
    return null;
  }

  const dashboard = useInstituteDashboard();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex">
        <Sidebar
          enabledTabs={[
            'dashboard',
            'manageStudents',
            'manageExams',
            'results',
            'announcements',
          ]}
        />
  
        <main className="flex-1 p-8">
  
          <DashboardStats dashboard={dashboard} />
  
          <div className="mt-10">
            <UpcomingExams upcomingExams={dashboard.upcomingExams} />
          </div>
  
          <div className="mt-10">
            <RecentActivity
              recentSubmissions={dashboard.recentSubmissions}
              systemAlerts={dashboard.systemAlerts}
              upcomingCount={dashboard.upcomingExams.length}
            />
          </div>
        </main>
      </div>
    </div>
  );
  
};

export default InstituteHomePage;