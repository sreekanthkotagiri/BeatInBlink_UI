import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/ui/Sidebar';
import API from '../../services/api';
import { Exam, ExamsWithQuestion } from '../../types/exam';
import ExamDrawer from './ExamDrawer';
import EnableExamDrawer from './EnableExamDrawer';

const ManageExamsLayout = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamsWithQuestion | null>(null);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit' | null>(null);
  const [enableExamId, setEnableExamId] = useState<number | null>(null);
  const [toggledExamId, setToggledExamId] = useState<number | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      const storedInstitute = localStorage.getItem('institute');
      const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
      if (!institute || !institute.id) return;

      try {
        const res = await API.get(`/auth/institute/exams?instituteId=${institute.id}`);
        setExams(res.data);
      } catch (err) {
        console.error('Error fetching exams:', err);
      }
    };

    fetchExams();
  }, []);

  const handleView = async (examId: number) => {
    try {
      const res = await API.get(`/auth/institute/viewexam/${examId}`);
      setSelectedExam(res.data);
      setDrawerMode('view');
    } catch (err) {
      console.error('Error fetching exam details:', err);
    }
  };

  const handleEdit = async (examId: number) => {
    try {
      const res = await API.get(`/auth/institute/viewexam/${examId}`);
      const examData = res.data;
      const isEnabled = examData?.student_enrollments?.some((e: any) => e.is_enabled);
      setSelectedExam(examData);
      setDrawerMode(isEnabled ? 'view' : 'edit');
    } catch (err) {
      console.error('Error fetching exam details:', err);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedExam(null);
    setDrawerMode(null);
    setEnableExamId(null);
    setToggledExamId(null);
  };

  const handleSaveExam = async (updatedExam: Exam) => {
    try {
      await API.post('auth/institute/updateExam', updatedExam);
      setExams((prev) => prev.map((ex) => (ex.id === updatedExam.id ? updatedExam : ex)));
      alert('✅ Exam updated successfully!');
      handleCloseDrawer();
    } catch (err) {
      console.error('Failed to update exam:', err);
      alert('❌ Failed to update exam. Please try again.');
    }
  };

  const handleEnableExam = (examId: number) => {
    setEnableExamId(examId);
    setToggledExamId(examId);
  };

  const handleToggleCancel = () => {
    setToggledExamId(null);
  };

  const upcomingExams = exams.filter(e => new Date(e.scheduled_date) > new Date());
  const completedExams = exams.filter(e => new Date(e.scheduled_date) <= new Date());

  const renderExamTable = (title: string, examList: Exam[]) => (
    <div className="mb-10">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Exam ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Scheduled Date</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {examList.length > 0 ? (
              examList.map((exam: Exam) => (
                <tr key={exam.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-blue-600 underline hover:text-blue-800 cursor-pointer" onClick={() => handleView(exam.id)}>
                    {exam.id}
                  </td>
                  <td className="px-4 py-3">{exam.title}</td>
                  <td className="px-4 py-3">{new Date(exam.scheduled_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{exam.duration_min} min</td>
                  <td className="px-4 py-3 flex flex-wrap gap-2 items-center">
                    <button
                      onClick={() => handleEdit(exam.id)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <label className="inline-flex items-center cursor-pointer relative">
                      <input
                        type="checkbox"
                        checked={toggledExamId === exam.id || exam.enabled}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleEnableExam(exam.id);
                          } else {
                            handleToggleCancel();
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No exams found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="flex">
        <Sidebar enabledTabs={['dashboard', 'manageStudents', 'manageExams', 'results', 'announcements']} />

        <main className="flex-1 px-8 py-6">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Manage Exams</h2>
            <Link
              to="/institute/createExam"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              ➕ Create New Exam
            </Link>
          </div>

          {renderExamTable('Upcoming Exams', upcomingExams)}
          {renderExamTable('Completed Exams', completedExams)}
        </main>
      </div>

      {selectedExam && (
        <ExamDrawer
          mode={drawerMode!}
          exam={selectedExam}
          onClose={handleCloseDrawer}
          onSave={drawerMode === 'edit' ? handleSaveExam : undefined}
          setExamData={drawerMode === 'edit' ? (setSelectedExam as React.Dispatch<React.SetStateAction<ExamsWithQuestion>>) : undefined}
        />
      )}

      {enableExamId && (
        <EnableExamDrawer examId={enableExamId} onClose={handleCloseDrawer} />
      )}
    </div>
  );
};

export default ManageExamsLayout;