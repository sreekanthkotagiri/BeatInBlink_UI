import React from 'react';

interface Props {
  recentSubmissions: { studentName: string; examTitle: string }[];
  systemAlerts: string[];
}

const RecentActivityPanel: React.FC<Props> = ({ recentSubmissions, systemAlerts }) => (
  <div className="bg-white shadow rounded p-4">
    <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
    {recentSubmissions.length === 0 && systemAlerts.length === 0 ? (
      <p className="text-gray-500 italic">No recent activity</p>
    ) : (
      <ul className="list-disc pl-5 text-gray-700 space-y-1">
        {systemAlerts.map((alert, i) => (
          <li key={`alert-${i}`}>{alert}</li>
        ))}
        {recentSubmissions.map((sub, i) => (
          <li key={`sub-${i}`}>
            {sub.studentName} submitted <strong>{sub.examTitle}</strong>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default RecentActivityPanel;
