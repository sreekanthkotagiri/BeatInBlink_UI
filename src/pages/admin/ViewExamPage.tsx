import React from 'react';
import { Exam, ExamsWithQuestion, Question } from '../../types/exam';

type Props = {
  examPaper: ExamsWithQuestion;
  onClose: () => void;
};

const ExamViewDrawer: React.FC<Props> = ({ examPaper, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>

      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl flex flex-col">
        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-2xl font-bold mb-4">📄 Exam Details</h2>
          <p><strong>Title:</strong> {examPaper.title}</p>
          <p><strong>Branch:</strong> {examPaper.branch}</p>
          <p><strong>Scheduled Date:</strong> {new Date(examPaper.scheduled_date).toLocaleString()}</p>
          <p><strong>Duration:</strong> {examPaper.duration_min} minutes</p>
          <p><strong>Pass Percentage:</strong> {examPaper.pass_percentage}%</p>

          <hr className="my-4" />
          <h3 className="text-lg font-semibold mb-2">📝 Questions</h3>
          {examPaper.questions?.map((q: Question, index: number) => (
            <div key={index} className="p-4 mb-3 bg-gray-100 rounded">
              <p><strong>Q{index + 1}:</strong> {q.text}</p>
              <p><strong>Type:</strong> {q.type}</p>
              {q.options && (
                <ul className="list-disc ml-6 mb-2">
                  {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                </ul>
              )}
              <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
              <p><strong>Marks:</strong> {q.marks}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t text-right">
          <button onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamViewDrawer;
