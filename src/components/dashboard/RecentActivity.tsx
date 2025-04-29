// File: src/components/dashboard/RecentActivity.tsx
import React from 'react';
import { Alert, Submission } from '../../types/dashboard';

type Props = {
  recentSubmissions: Submission[];
  systemAlerts: Alert[];
  upcomingCount: number;
};

const RecentActivity: React.FC<Props> = ({ recentSubmissions, systemAlerts, upcomingCount }) => {
  return (
    <div className="recent-activity mt-10">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Recent Activity / Notifications
      </h3>
  
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ul className="space-y-2 text-sm text-gray-700">
          {recentSubmissions.length > 0 ? (
            recentSubmissions.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2 text-green-500">✅</span>
                <span>
                  <span className="font-medium">{item.studentName}</span> submitted exam{' '}
                  <span className="font-medium">{item.examTitle}</span>
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No recent submissions</li>
          )}
  
          {systemAlerts.length > 0 &&
            systemAlerts.map((alert, idx) => (
              <li key={idx} className="flex items-start text-red-600">
                <span className="mr-2">⚠️</span>
                <span>{alert.message}</span>
              </li>
            ))}
  
          {upcomingCount > 0 && (
            <li className="flex items-start text-blue-600">
              <span className="mr-2">🕒</span>
              <span>{upcomingCount} exam{upcomingCount > 1 ? 's' : ''} coming up soon</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
  
};

export default RecentActivity;
