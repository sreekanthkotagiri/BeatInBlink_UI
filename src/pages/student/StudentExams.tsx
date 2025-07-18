import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Sidebar from '../../components/ui/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/input';
import { Download } from 'lucide-react';

const StudentExams = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [exams, setAllExams] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [instituteName, setInstituteName] = useState('');

  useEffect(() => {
    const fetchStudentExams = async () => {
      const storedStudent = localStorage.getItem('student');
      const student = storedStudent ? JSON.parse(storedStudent) : null;

      if (!student?.id) return;

      setStudentName(student.name);
      setStudentId(student.id);
      setInstituteName(student.institute_name);

      try {
        const res = await API.get(`/auth/student/exams?studentId=${student.id}`);
        const response = Array.isArray(res.data) ? res.data[0] : res.data;
        setAllExams(response.exams || []);
      } catch (err) {
        console.error('Failed to fetch exams:', err);
      }
    };

    fetchStudentExams();
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
      <div className="dashboard-container">
        <Sidebar enabledTabs={['studenthome', 'studentexams', 'studentresults', 'studentprofile', 'student-announcements']} />
        <main className="main-content px-8 py-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">📝 My Exams</h2>
              <p className="text-lg text-gray-600">{studentName} | {instituteName}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-3xl shadow-2xl border border-gray-100/50 p-8">
            <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50 text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-6 py-4">Exam ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Taken Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Download</th>
                </tr>
              </thead>
              <tbody>
                {exams.length > 0 ? (
                  exams.map((exam: any) => (
                    <tr key={exam.exam_id} className="border-t border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                      <td className="px-6 py-4 font-medium text-gray-800">{exam.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{exam.title}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(exam.taken_date).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          exam.status === 'submitted' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">

                        {exam.status === 'submitted' && exam.downloadable ? (
                          <button
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                            onClick={async () => {
                              try {
                                const response = await API.get(`/auth/student/downloadExam?studentId=${studentId}&examId=${exam.id}`, {
                                  responseType: 'blob',
                                });

                                const blob = new Blob([response.data], {
                                  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'exam_result.docx';
                                a.click();
                                window.URL.revokeObjectURL(url);
                              } catch (err) {
                                alert('❌ Failed to download exam paper.');
                                console.error('Download error:', err);
                              }
                            }}
                            title="Download Exam Paper"
                          >
                            <Download size={20} />
                          </button>
                        ) : (
                          <button
                            className="bg-gray-200 text-gray-400 p-3 rounded-full cursor-not-allowed opacity-50"
                            disabled
                            title="Download Disabled by Institute"
                          >
                            <Download size={20} />
                          </button>
                        )}

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-6xl mb-4">📝</div>
                      <p className="text-gray-500 text-lg font-medium">No exams available</p>
                      <p className="text-gray-400 text-sm mt-2">Your completed exams will appear here</p>
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

export default StudentExams;