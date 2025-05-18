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
    <div className="institute-home">
      <div className="dashboard-container">
        <Sidebar enabledTabs={['studenthome', 'studentexams', 'studentresults', 'studentprofile', 'student-announcements']} />
        <main className="main-content px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">My Exams</h2>
              <p className="text-sm text-gray-600">{studentName} | {instituteName}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-xs text-gray-600">
                <tr>
                  <th className="px-4 py-3">Exam ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Taken Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Download</th>
                </tr>
              </thead>
              <tbody>
                {exams.length > 0 ? (
                  exams.map((exam: any) => (
                    <tr key={exam.exam_id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">{exam.id}</td>
                      <td className="px-4 py-3">{exam.title}</td>
                      <td className="px-4 py-3">{new Date(exam.taken_date).toLocaleString()}</td>
                      <td className="px-4 py-3">{exam.status}</td>
                      <td className="px-4 py-3">

                        {exam.status === 'submitted' && exam.downloadable ? (
                          <button
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black p-2 rounded-full shadow-md"
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
                            className="bg-gray-300 text-gray-500 p-2 rounded-full cursor-not-allowed"
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
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500">No exams available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentExams;