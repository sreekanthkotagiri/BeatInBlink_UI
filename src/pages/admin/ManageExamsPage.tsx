import React, { useState } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import SearchExamsTab from './SearchExamsTab';
import AssignBranchTab from './AssignBranchTab';
import AssignStudentTab from './AssignStudentTab';
import ExamSettingsTab from './ExamSettingsTab';


const ManageExamsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'branch' | 'student' | 'settings'>('search');

  return (
    <div className="institute-home bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="dashboard-container">
        <Sidebar enabledTabs={['dashboard', 'manageStudents', 'manageExams', 'results', 'announcements']} />

        <main className="main-content p-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            {/* Horizontal Tabs */}
            <div className="flex gap-6 mb-6 border-b">
              {['search', 'branch', 'student', 'settings'].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 border-b-4 capitalize ${
                    activeTab === tab ? 'border-blue-600 text-blue-800 font-semibold' : 'border-transparent text-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab as any)}
                >
                  {tab === 'search' && 'Search Exams'}
                  {tab === 'branch' && 'Assign to Branch'}
                  {tab === 'student' && 'Assign to Students'}
                  {tab === 'settings' && 'Create/Edit/Settings'}
                </button>
              ))}
            </div>

            {activeTab === 'search' && <SearchExamsTab />}
            {activeTab === 'branch' && <AssignBranchTab />}
            {activeTab === 'student' && <AssignStudentTab />}
            {activeTab === 'settings' && <ExamSettingsTab />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageExamsPage;