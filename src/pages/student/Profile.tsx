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
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="flex">
      <Sidebar enabledTabs={['studenthome','studentexams', 'studentresults', 'studentprofile','student-announcements']} />


        <main className="flex-1 px-8 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">👤 My Profile</h2>

            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Student ID</label>
                <div className="text-gray-800 font-medium bg-gray-100 px-4 py-2 rounded-lg">{student.id}</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
                <div className="text-gray-800 font-medium bg-gray-100 px-4 py-2 rounded-lg">{student.name}</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                <div className="text-gray-800 font-medium bg-gray-100 px-4 py-2 rounded-lg">{student.email}</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Branch</label>
                <div className="text-gray-800 font-medium bg-gray-100 px-4 py-2 rounded-lg">{student.branch}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentProfilePage;