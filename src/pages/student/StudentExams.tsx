import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Sidebar from '../../components/ui/Sidebar';
import { useAuth } from '../../context/AuthContext';

const StudentExams = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [exams, setAllExams] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [instituteName, setInstituteName] = useState('');

  useEffect(() => {
    const fetchStudentExams = async () => {
      const storedStudent = localStorage.getItem('student');
      const student = storedStudent ? JSON.parse(storedStudent) : null;

      if (!student?.id) return;

      setStudentName(student.name);
      setInstituteName(student.institute_name);

      try {
        const res = await API.get(`/auth/student/allStudentExams?studentId=${student.id}`);
        const response = Array.isArray(res.data) ? res.data[0] : res.data;
        setAllExams(response.exams || []);
      } catch (err) {
        console.error('Failed to fetch exams:', err);
      }
    };

    fetchStudentExams();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDownload = async (examId: number) => {
    try {
      const res = await API.get(`/auth/student/downloadExam?studentId=2&examId=${examId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `exam_result_${examId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download result:', err);
      alert('Download failed.');
    }
  };

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
              <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-3">Exam ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Scheduled Date</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted At</th>
                  <th className="px-4 py-3">Download</th>
                </tr>
              </thead>
              <tbody>
                {exams.length > 0 ? (
                  exams.map((exam: any) => (
                    <tr key={exam.exam_id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">{exam.examId}</td>
                      <td className="px-4 py-3">{exam.title}</td>
                      <td className="px-4 py-3">{new Date(exam.scheduledDate).toLocaleString()}</td>
                      <td className="px-4 py-3">{exam.durationMin} mins</td>
                      <td className="px-4 py-3 font-semibold text-blue-600">{exam.score || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${exam.status === 'Pass' ? 'text-green-600' : exam.status === 'Fail' ? 'text-red-600' : 'text-gray-500'}`}>
                          {exam.status || (exam.hasSubmitted ? 'Evaluating' : 'Pending')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{exam.submittedAt ? new Date(exam.submittedAt).toLocaleString() : '-'}</td>
                      <td className="px-4 py-3">
                        {exam.hasSubmitted && (
                          <button
                            onClick={() => handleDownload(exam.examId)}
                            className="text-blue-600 hover:underline text-xs"
                            title="Download result"
                          >
                            📥
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