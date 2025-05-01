// File: src/components/dashboard/UpcomingExams.tsx
import React, { useState } from 'react';
import { Exam } from '../../types/exam';
import API from '../../services/api';
import ExamDetailsDrawer from '../../pages/admin/ExamDetailsDrawer';

type Props = {
  upcomingExams: Exam[];
};

const UpcomingExams: React.FC<Props> = ({ upcomingExams }) => {
  const [examDetail, setExamDetail] = useState<any>(null);

  const handleOpenDrawer = async (examId: number) => {
    try {
      const res = await API.get(`/auth/editexam/${examId}`);
      setExamDetail(res.data);
    } catch (err) {
      console.error('Failed to fetch exam', err);
    }
  };

  const handleCloseDrawer = () => {
    setExamDetail(null);
  };

  return (
    <div className="upcoming-exams mb-10">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Exams</h3>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Exam ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Scheduled Date</th>
              <th className="px-4 py-3">Duration (min)</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {upcomingExams.length > 0 ? (
              upcomingExams.map((exam) => (
                <tr
                  key={exam.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td
                    className="px-4 py-2 text-blue-600 underline hover:text-blue-800 cursor-pointer"
                    onClick={() => handleOpenDrawer(exam.id)}
                  >
                    {exam.id}
                  </td>
                  <td className="px-4 py-3">{exam.title}</td>
                  <td className="px-4 py-3">
                    {new Date(exam.scheduled_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{exam.duration_min}</td>
                  <td className="px-4 py-3 text-gray-400">—</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No upcoming exams
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-in Drawer for Exam Details */}
      {examDetail && (
        <ExamDetailsDrawer exam={examDetail} onClose={handleCloseDrawer} />
      )}
    </div>
  );
};

export default UpcomingExams;
