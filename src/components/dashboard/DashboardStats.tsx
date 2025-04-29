// File: src/components/dashboard/DashboardStats.tsx
import React from 'react';

type Props = {
  dashboard: {
    studentsCount: number;
    examsCount: number;
    submissionsCount: number;
  };
};

const DashboardStats: React.FC<Props> = ({ dashboard }) => {
  return (
    <div className="dashboard-stats mb-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Students</h3>
        <p className="text-2xl font-bold text-gray-800">{dashboard.studentsCount}</p>
      </div>
  
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Exams</h3>
        <p className="text-2xl font-bold text-gray-800">{dashboard.examsCount}</p>
      </div>
  
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Submissions</h3>
        <p className="text-2xl font-bold text-gray-800">{dashboard.submissionsCount}</p>
      </div>
    </div>
  );
  
};

export default DashboardStats;
