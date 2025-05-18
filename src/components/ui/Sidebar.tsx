import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  enabledTabs: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ enabledTabs }) => {
  const location = useLocation();

  const tabs = [
    { name: 'dashboard', label: 'Home', path: '/institute/home' },
    { name: 'manageStudents', label: 'Manage Students', path: '/institute/managestudent' },
    { name: 'results', label: 'Results', path: '/institute/results' },
    { name: 'manageExams', label: 'Manage Exams', path: '/institute/manage-exams' },
    { name: 'createExam', label: 'View/Edit Exams', path: '/institute/viewExams' },
    { name: 'announcements', label: 'Announcements', path: '/institute/announcementPage' },
    { name: 'students', label: 'Students', path: '/institute/students' },

    { name: 'studenthome', label: 'Home', path: '/student/home' },
    { name: 'studentexams', label: 'Exams', path: '/student/exams' },
    { name: 'studentresults', label: 'Results', path: '/student/results' },
    { name: 'studentprofile', label: 'Profile', path: '/student/profile' },
    { name: 'student-announcements', label: 'Announcements', path: '/student/announcements' },
  ];

  return (
    <aside className="clean-sidebar w-64 bg-white border-r px-4 py-6">
      <ul className="space-y-2">
        {tabs
          .filter((tab) => enabledTabs.includes(tab.name))
          .map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <li key={tab.name}>
                <Link
                  to={tab.path}
                  className={`block px-4 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
      </ul>
    </aside>
  );
};

export default Sidebar;
