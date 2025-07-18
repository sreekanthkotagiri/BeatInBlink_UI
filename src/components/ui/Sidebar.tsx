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
    <aside className="clean-sidebar w-64 bg-white/95 backdrop-blur-sm border-r border-gray-100/50 px-6 py-8">
      <ul className="space-y-3">
        {tabs
          .filter((tab) => enabledTabs.includes(tab.name))
          .map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <li key={tab.name}>
                <Link
                  to={tab.path}
                  className={`block px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:shadow-md hover:scale-102'
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
