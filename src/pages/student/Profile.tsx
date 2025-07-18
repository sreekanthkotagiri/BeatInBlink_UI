import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';

const StudentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    id: '',
    name: '',
    email: '',
    branch: ''
  });

  useEffect(() => {
    const storedStudent = localStorage.getItem('student');
    const parsedStudent = storedStudent ? JSON.parse(storedStudent) : null;
    if (!parsedStudent || parsedStudent.role !== 'student') {
      navigate('/login');
      return;
    }
    setStudent({
      id: parsedStudent.id,
      name: parsedStudent.name,
      email: parsedStudent.email,
      branch: parsedStudent.branch_name || 'N/A'
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen w-full">
      <div className="flex">
      <Sidebar enabledTabs={['studenthome','studentexams', 'studentresults', 'studentprofile','student-announcements']} />


        <main className="flex-1 px-8 py-10 relative">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">👤 My Profile</h2>
              <p className="text-lg text-gray-600">View and manage your personal information</p>
            </div>

            <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl shadow-2xl border border-blue-100/50 p-10 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
              <div>
                <label className="block text-base font-bold text-gray-700 mb-3">Student ID</label>
                <div className="text-gray-800 font-semibold bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 rounded-2xl border border-blue-100/50 text-lg">{student.id}</div>
              </div>

              <div>
                <label className="block text-base font-bold text-gray-700 mb-3">Name</label>
                <div className="text-gray-800 font-semibold bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 rounded-2xl border border-blue-100/50 text-lg">{student.name}</div>
              </div>

              <div>
                <label className="block text-base font-bold text-gray-700 mb-3">Email</label>
                <div className="text-gray-800 font-semibold bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 rounded-2xl border border-blue-100/50 text-lg">{student.email}</div>
              </div>

              <div>
                <label className="block text-base font-bold text-gray-700 mb-3">Branch</label>
                <div className="text-gray-800 font-semibold bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 rounded-2xl border border-blue-100/50 text-lg">{student.branch}</div>
              </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentProfilePage;