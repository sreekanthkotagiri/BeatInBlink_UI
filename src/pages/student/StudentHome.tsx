import React, { useEffect } from 'react';
import '../../App.css';
import API from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './../../context/AuthContext';
import { useStudentContext } from './../../context/StudentContext';
import Sidebar from '../../components/ui/Sidebar';

const StudentHomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const {
    studentName,
    setStudentName,
    enabledexams,
    setEnabledExams,
    studentdetails,
    setSubmissionStats
  } = useStudentContext();

  useEffect(() => {
    const fetchStudentDashboard = async () => {
      const userInfo = localStorage.getItem('student');
      const user = userInfo ? JSON.parse(userInfo) : null;
      if (user?.role !== 'student') {
        logout();
        navigate('/login');
      }
      if (!user || !user.id) {
        console.error('No student ID found');
        return;
      }
      setStudentName(user.name);

      try {
        const res = await API.get(`/auth/students?studentId=${user.id}`);
        const { enabledexams, studentdetails } = res.data[0] || { enabledexams: [], studentdetails: {} };
        setEnabledExams(enabledexams);
        setSubmissionStats(studentdetails);
      } catch (err) {
        console.error('Failed to fetch student dashboard:', err);
      }
    };
    fetchStudentDashboard();
  }, [setStudentName, setEnabledExams, setSubmissionStats]);

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="flex">
        <Sidebar enabledTabs={['studenthome','studentexams', 'studentresults', 'studentprofile','student-announcements']} />

        <main className="flex-1 px-8 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Student Dashboard</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold text-gray-700">Total Exams</h3>
              <p className="text-3xl font-bold text-blue-600">{studentdetails.totalExams}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold text-gray-700">Submitted</h3>
              <p className="text-3xl font-bold text-green-600">{studentdetails.submitted}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">{studentdetails.pending}</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Enabled Exams</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Exam ID</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Scheduled Date</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {enabledexams && enabledexams.length > 0 ? (
                    enabledexams.map((exam: any) => (
                      <tr key={exam.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">{exam.exam_id}</td>
                        <td className="px-4 py-3">{exam.title}</td>
                        <td className="px-4 py-3">{new Date(exam.scheduled_date).toLocaleString()}</td>
                        <td className="px-4 py-3">{exam.duration_min} mins</td>
                        <td className="px-4 py-3">
                          <Link to={`/student/submitExam/${exam.exam_id}`} className="text-blue-600 underline hover:text-blue-800">Start</Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No exams enabled</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Announcements</h3>
            <ul className="list-disc ml-6 text-gray-700">
              <li>📣 Check the latest updates in the announcements section.</li>
              <li>📅 Be on time for scheduled exams!</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentHomePage;