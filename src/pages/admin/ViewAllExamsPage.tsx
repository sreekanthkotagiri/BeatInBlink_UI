import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import Sidebar from '../../components/ui/Sidebar';
import { Exam, ExamsWithQuestion, Question } from '../../types/exam';
import ExamDrawer from './ExamDrawer';

const ViewAllExamsPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamsWithQuestion | null>(null);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit' | null>(null);

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
      setSelectedExam(res.data);
      setDrawerMode('edit');
    } catch (err) {
      console.error('Error fetching exam details:', err);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedExam(null);
    setDrawerMode(null);
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

  return (
    <div className="relative bg-gray-50 min-h-screen">
      <div className="flex">
        <Sidebar enabledTabs={[
          'dashboard',
          'manageStudents',
          'manageExams',
          'results',
          'announcements'
        ]} />

        <main className="flex-1 px-8 py-6">
          {/* Page Title & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">All Exams</h2>
            <Link
              to="/institute/createExam"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              ➕ Create New Exam
            </Link>
          </div>

          {/* Exam Table */}
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Exam ID</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Scheduled Date</th>
                  <th className="px-4 py-3">Duration (min)</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.length > 0 ? (
                  exams.map((exam: Exam) => (
                    <tr key={exam.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-blue-600 underline hover:text-blue-800 cursor-pointer" onClick={() => handleView(exam.id)}>
                        {exam.id}
                      </td>
                      <td className="px-4 py-3">{exam.title}</td>
                      <td className="px-4 py-3">{new Date(exam.scheduled_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{exam.duration_min}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(exam.id)}
                          className="inline-block px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
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
    </div>
  );
};

export default ViewAllExamsPage;