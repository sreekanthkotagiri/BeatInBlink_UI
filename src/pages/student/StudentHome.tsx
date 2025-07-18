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
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen w-full">
      <div className="flex">
        <Sidebar enabledTabs={['studenthome', 'studentexams', 'studentresults', 'studentprofile', 'student-announcements']} />

        <main className="flex-1 px-8 py-8">
          <div className="mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">🎓 Student Dashboard</h2>
            <p className="text-lg text-gray-600">Welcome back, {studentName}! Track your exam progress here.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-white to-blue-50/50 p-8 rounded-3xl shadow-xl text-center border border-blue-100/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Exams</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{studentdetails.totalExams}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-green-50/50 p-8 rounded-3xl shadow-xl text-center border border-green-100/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Submitted</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{studentdetails.submitted}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-yellow-50/50 p-8 rounded-3xl shadow-xl text-center border border-yellow-100/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-4">⏳</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{studentdetails.pending}</p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-3xl shadow-xl border border-gray-100/50 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                Enabled Exams
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 text-sm font-semibold">
                  <tr>
                    <th className="px-6 py-4">Exam ID</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(enabledExams) && enabledExams.length > 0 ? (
                    enabledExams.map((exam: any) => (
                      <tr key={exam.exam_id} className="border-t border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                        <td className="px-6 py-4 font-medium text-gray-800">{exam.id}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{exam.title}</td>
                        <td className="px-6 py-4 text-gray-600">{exam.created_at ? new Date(exam.created_at).toLocaleString() : 'NA' }</td>
                        <td className="px-6 py-4 text-gray-600">{exam.duration_min ? exam.duration_min : 'NA'} mins</td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/student/submitExam/${exam.id}`}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            Start Exam
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-gray-500 text-lg font-medium">No exams enabled</p>
                        <p className="text-gray-400 text-sm mt-2">Check back later for new assignments</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl shadow-xl border border-blue-100/50 p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">📢</span>
              Quick Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📣</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Stay Updated</h4>
                    <p className="text-gray-600">Check the latest updates in the announcements section.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100/50 hover:shadow-xl transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📅</div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Be Punctual</h4>
                    <p className="text-gray-600">Be on time for scheduled exams!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentHomePage;
