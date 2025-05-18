import React, { useState } from 'react';
import SearchExamsTab from './SearchExamsTab';
import AssignBranchTab from './AssignBranchTab';
import AssignStudentTab from './AssignStudentTab';
import ExamSettingsTab from './ExamSettingsTab';
import InstitutePageLayout from '../../components/layout/InstitutePageLayout';
import TabbedSection from '../../components/layout/TabbedSection';
import { Search, Network, Users, SlidersHorizontal } from 'lucide-react';

const ManageExamsPage: React.FC = () => {
  const tabs = [
    { key: 'search', label: 'Search Exam', icon: Search },
    { key: 'branch', label: 'Assign To Branch', icon: Network },
    { key: 'student', label: 'Assign To Students', icon: Users },
    { key: 'settings', label: 'Create/Edit/Settings', icon: SlidersHorizontal },
  ] as const;

  type TabKey = typeof tabs[number]['key'];
  const [activeTab, setActiveTab] = useState<TabKey>('search');

  return (
    <InstitutePageLayout enabledTabs={['dashboard', 'manageStudents', 'manageExams', 'results', 'announcements']}>
      <TabbedSection<TabKey> tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'search' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <SearchExamsTab />
          </div>
        )}
        {activeTab === 'branch' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <AssignBranchTab />
          </div>
        )}
        {activeTab === 'student' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <AssignStudentTab />
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <ExamSettingsTab />
          </div>
        )}
      </div>
    </InstitutePageLayout>
  );
};

export default ManageExamsPage;