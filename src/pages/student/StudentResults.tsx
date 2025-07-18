import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Sidebar from '../../components/ui/Sidebar';
import { useAuth } from '../../context/AuthContext';

const StudentResults = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [exams, setExamResults] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [instituteName, setInstituteName] = useState('');

  useEffect(() => {
    const fetchStudentResults = async () => {
      const storedStudent = localStorage.getItem('student');
      const student = storedStudent ? JSON.parse(storedStudent) : null;

      if (!student?.id) return;

      setStudentName(student.name);
      setInstituteName(student.institute_name);

      try {
        const res = await API.get(`/auth/student/student-results?studentId=${student.id}`);
        const response = Array.isArray(res.data) ? res.data[0] : res.data;
        setExamResults(response.exams || []);
      } catch (err) {
        console.error('Failed to fetch exam results:', err);
      }
    };

    fetchStudentResults();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      <div className="dashboard-container">
        <Sidebar enabledTabs={['studenthome', 'studentexams', 'studentresults', 'studentprofile', 'student-announcements']} />
        <main className="main-content px-8 py-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">📊 My Results</h2>
              <p className="text-lg text-gray-600">{studentName} | {instituteName}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-3xl shadow-2xl border border-gray-100/50 p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">📈</span>
              Performance Summary
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50 text-sm font-semibold text-gray-700">
                  <tr>
                    <th className="px-6 py-4">Exam ID</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Scheduled Date</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.length > 0 ? (
                    exams.map((exam: any) => (
                      <tr key={exam.exam_id} className="border-t border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                        <td className="px-6 py-4 font-medium text-gray-800">{exam.examId}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{exam.title}</td>
                        <td className="px-6 py-4 text-gray-600">{new Date(exam.scheduledDate).toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-600">{exam.durationMin} mins</td>
                        <td className="px-6 py-4 font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{exam.score}</td>
                        <td className="px-6 py-4">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            exam.status === 'Pass' 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {exam.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{new Date(exam.submittedAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <p className="text-gray-500 text-lg font-medium">No exam results available</p>
                        <p className="text-gray-400 text-sm mt-2">Your results will appear here after completing exams</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentResults;
