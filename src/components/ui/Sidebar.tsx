import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  enabledTabs: string[]; // Controls which tabs are visible
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
    <aside className="clean-sidebar">
      <ul className="clean-sidebar-list">
        {tabs
          .filter((tab) => enabledTabs.includes(tab.name))
          .map((tab) => (
            <li key={tab.name}>
              <Link
                to={tab.path}
                className={`clean-sidebar-link ${
                  location.pathname === tab.path ? 'active' : ''
                }`}
              >
                {tab.label}
              </Link>
            </li>
          ))}
      </ul>
    </aside>
  );
  
  
  
};

export default Sidebar;
