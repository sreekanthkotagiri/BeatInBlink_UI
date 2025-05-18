import React, { useEffect, useState } from 'react';
import '../../App.css';
import API from '../../services/api';
import { Branch } from '../../types/branch';
import { Student, NewStudent } from '../../types/student';

import InstitutePageLayout from '../../components/layout/InstitutePageLayout';
import StudentTable from '../../components/manageStudents/StudentTable';
import StudentModals from '../../components/manageStudents/StudentModals';
import BulkUploadStudent from './BulkUploadStudent';
import AddStudentTab from './AddStudent';
import AddBranchTab from './AddBranchTab';
import TabbedSection from '../../components/layout/TabbedSection';
import { Users, UserPlus, Building2, UploadCloud } from 'lucide-react';

const ManageStudentAccessPage: React.FC = () => {
  const tabs = [
    { key: 'access', label: 'Enable/Disable Students', icon: Users },
    { key: 'addStudent', label: 'Add Student', icon: UserPlus },
    { key: 'addBranch', label: 'Add Branch', icon: Building2 },
    { key: 'bulkUpload', label: 'Bulk Upload Students', icon: UploadCloud },
  ] as const;
  type TabKey = typeof tabs[number]['key'];

  const [activeTab, setActiveTab] = useState<TabKey>('access');

  const [students, setStudents] = useState<Student[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [editedStudents, setEditedStudents] = useState<Student[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchBranch, setSearchBranch] = useState('');

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);

  const [newStudent, setNewStudent] = useState<NewStudent>({
    name: '',
    email: '',
    password: '',
    branchId: '',
  });
  const [newBranch, setNewBranch] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const institute = JSON.parse(localStorage.getItem('institute') || '{}');
    try {
      const res = await API.get(`/auth/institute/branches?instituteId=${institute.id}`);
      setBranches(res.data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const handleSearch = async () => {
    const clientFiltered = students.filter((student) => {
      const matchesBranch = searchBranch ? student.branch === searchBranch : true;
      const matchesText =
        student.name.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase());
      return matchesBranch && matchesText;
    });

    if (clientFiltered.length > 0) {
      setFiltered(clientFiltered);
      setEditedStudents(clientFiltered);
    } else {
      try {
        const institute = JSON.parse(localStorage.getItem('institute') || '{}');
        const res = await API.get(`/auth/student/getstudentwithsearch?instituteId=${institute.id}`, {
          params: {
            branch: searchBranch,
            query: searchText,
          },
        });
        const data = res.data;
        setStudents(data);
        setFiltered(data);
        setEditedStudents(data);
      } catch (error) {
        console.error('Error fetching from backend:', error);
      }
    }
  };

  const handleToggleAccess = async (student: Student) => {
    const updated = editedStudents.map((s) =>
      Number(s.id) === Number(student.id) ? { ...s, is_enabled: !s.is_enabled } : s
    );
    setEditedStudents(updated);
    setFiltered(updated);

    const toggledStudent = updated.find((s) => String(s.id) === String(student.id));
    if (!toggledStudent) return;

    try {
      await API.post('/auth/student/updateStudent', toggledStudent);
    } catch (error) {
      console.error('❌ Error syncing toggle with backend:', error);
    }
  };

  const handleStudentBranchChange = (studentId: number, newBranch: string) => {
    const updated = editedStudents.map((student) =>
      student.id === studentId ? { ...student, branch: newBranch } : student
    );
    setEditedStudents(updated);
    setFiltered(updated);
  };

  return (
    <InstitutePageLayout enabledTabs={['dashboard', 'manageStudents', 'manageExams', 'results', 'announcements']}>
      <TabbedSection<TabKey> tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'access' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="space-y-4 col-span-1">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <select
              value={searchBranch}
              onChange={(e) => setSearchBranch(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm w-full transition"
            >
              Search
            </button>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <StudentTable
              students={filtered}
              onToggleAccess={handleToggleAccess}
              branches={branches}
              onBranchChange={handleStudentBranchChange}
            />
          </div>
        </div>
      )}

      {activeTab === 'addStudent' && <AddStudentTab />}
      {activeTab === 'addBranch' && <AddBranchTab />}
      {activeTab === 'bulkUpload' && <BulkUploadStudent />}

      <StudentModals
        showStudentModal={showStudentModal}
        setShowStudentModal={setShowStudentModal}
        showBranchModal={showBranchModal}
        setShowBranchModal={setShowBranchModal}
        newStudent={newStudent}
        setNewStudent={setNewStudent}
        newBranch={newBranch}
        setNewBranch={setNewBranch}
        branches={branches}
        handleRegisterStudent={() => {}}
        handleCreateBranch={() => {}}
        handleBulkUpload={() => {}}
        handleCSVUpload={() => {}}
      />
    </InstitutePageLayout>
  );
};

export default ManageStudentAccessPage;