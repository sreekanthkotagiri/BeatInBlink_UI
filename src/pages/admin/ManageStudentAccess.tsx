import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import '../../App.css';
import Sidebar from '../../components/ui/Sidebar';
import StudentTable from '../../components/manageStudents/StudentTable';
import StudentModals from '../../components/manageStudents/StudentModals';
import { Branch } from '../../types/branch';
import { Student, NewStudent } from '../../types/student';
import API from '../../services/api';

const ManageStudentAccessPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [bulkStudents, setBulkStudents] = useState<any[]>([]);
  const [searchBranch, setSearchBranch] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filtered, setFiltered] = useState<Student[]>([]);
  const [editedStudents, setEditedStudents] = useState<Student[]>([]);

  const [newStudent, setNewStudent] = useState<NewStudent>({
    name: '',
    email: '',
    password: '',
    branchId: '',
  });

  const [newBranch, setNewBranch] = useState('');

  useEffect(() => {
    // fetchStudents();
    fetchBranches();
  }, []);

  // const fetchStudents = async () => {
  //   try {
  //     const res = await API.get('/auth/students');
  //     const data = res.data || [];
  //     setStudents(data);
  //     setFiltered(data);
  //     setEditedStudents(data);
  //   } catch (err) {
  //     console.error('Error fetching students:', err);
  //   }
  // };

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
    if (!editedStudents.length) {
      console.warn('⚠️ Cannot toggle: editedStudents is empty.');
      return;
    }

    const updated = editedStudents.map((s) =>
      Number(s.id) === Number(student.id) ? { ...s, is_enabled: !s.is_enabled } : s
    );

    setEditedStudents(updated);
    setFiltered(updated);

    const toggledStudent =
      updated.find((s) => String(s.id) === String(student.id)) ||
      updated.find((s) => s.email === student.email);

    if (!toggledStudent) {
      console.error('❌ Still no matching student found. Toggle failed.');
      return;
    }

    try {
      console.log('✅ Sending to backend:', JSON.stringify(toggledStudent));
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
    <div className="flex min-h-screen bg-gray-50">
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Manage Student Access
        </h2>
  
        <div className="flex gap-4 mb-6 items-end">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border border-gray-300 bg-white px-4 py-2 rounded-md text-sm w-1/2 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
  
          <select
            value={searchBranch}
            onChange={(e) => setSearchBranch(e.target.value)}
            className="border border-gray-300 bg-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
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
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition"
          >
            Search
          </button>
        </div>
  
        <StudentTable
          students={filtered}
          onToggleAccess={handleToggleAccess}
          branches={branches}
          onBranchChange={handleStudentBranchChange}
        />
  
        <h3 className="text-lg font-semibold text-gray-700 mt-10 mb-3">Actions</h3>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setShowStudentModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm"
          >
            Add Student
          </button>
          <button
            onClick={() => setShowBranchModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md text-sm"
          >
            Add Branch
          </button>
        </div>
  
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
      </main>
    </div>
  );
  
};

export default ManageStudentAccessPage;
