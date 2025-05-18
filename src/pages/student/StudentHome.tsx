import React, { useEffect, useState } from 'react';
import '../../App.css';
import API from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './../../context/AuthContext';
import { useStudentContext } from './../../context/StudentContext';
import Sidebar from '../../components/ui/Sidebar';

const StudentHomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [enabledExams, setEnabledExams] = useState<any[]>([]);
  const {
    studentName,
    setStudentName,
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
        // Step 1: Fetch student profile
        const profileRes = await API.get(`/auth/student/profile?studentId=${user.id}`);
        const profile = profileRes.data;
        setSubmissionStats({
          studentId: profile.studentId,
          studentName: profile.studentName,
          instituteName: profile.instituteName,
          totalExams: profile.totalExams,
          submitted: profile.submitted,
          pending: profile.pending,
        });

        // Step 2: Fetch exam summary to get submission stats
        const statsRes = await API.get(`/auth/student/exams?studentId=${user.id}&examStatus=submitted`);
        const closed = statsRes.data.exams.length;

        const pendingRes = await API.get(`/auth/student/exams?studentId=${user.id}&examStatus=pending`);
        const pending = pendingRes.data.exams.length;



        // Step 3: Fetch enabled exams (i.e. pending)
        setEnabledExams(pendingRes.data.exams || []);
      } catch (err) {
        console.error('Failed to fetch student dashboard:', err);
      }
    };

    fetchStudentDashboard();
  }, [setStudentName, setEnabledExams, setSubmissionStats]);

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="flex">
        <Sidebar enabledTabs={['studenthome', 'studentexams', 'studentresults', 'studentprofile', 'student-announcements']} />

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

          <div className="mb-10 px-4 md:px-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Enabled Exams</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 text-xs">
                  <tr>
                    <th className="px-4 py-3">Exam ID</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Created Date</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(enabledExams) && enabledExams.length > 0 ? (
                    enabledExams.map((exam: any) => (
                      <tr key={exam.exam_id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">{exam.id}</td>
                        <td className="px-4 py-3">{exam.title}</td>
                        <td className="px-4 py-3">{exam.created_at ? new Date(exam.created_at).toLocaleString() : 'NA' }</td>
                        <td className="px-4 py-3">{exam.duration_min ? exam.duration_min : 'NA'} mins</td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/student/submitExam/${exam.exam_id}`}
                            className="text-blue-600 underline hover:text-blue-800"
                          >
                            Start
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                        No exams enabled
                      </td>
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
