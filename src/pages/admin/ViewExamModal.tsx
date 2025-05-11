import React from 'react';
import { Question } from '../../types/exam';

interface ViewExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  examTitle: string;
  scheduledDate: string;
  durationMin: number;
  passPercentage: number;
  description: string;
  restrictAccess: boolean;
  enableTimeLimit: boolean;
  questions: Question[];
}

const ViewExamModal: React.FC<ViewExamModalProps> = ({
  isOpen,
  onClose,
  examTitle,
  scheduledDate,
  durationMin,
  passPercentage,
  description,
  restrictAccess,
  enableTimeLimit,
  questions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-black"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-blue-800 mb-4">📄 View Exam Details</h2>

        <div className="space-y-3 text-sm text-gray-800">
          <p><strong>Title:</strong> {examTitle}</p>
          <p><strong>Scheduled Date:</strong> {scheduledDate}</p>
          <p><strong>Description:</strong> {description || '-'}</p>
          <p><strong>Pass Percentage:</strong> {passPercentage}%</p>
          <p><strong>Time Limit:</strong> {enableTimeLimit ? `${durationMin} mins` : 'Disabled'}</p>
          <p><strong>Restrictions:</strong> {restrictAccess ? 'Enabled' : 'None'}</p>
        </div>

        <hr className="my-4" />

        <h3 className="text-lg font-semibold text-blue-700 mb-2">Questions</h3>
        {questions.length === 0 ? (
          <p className="text-gray-500 italic">No questions added.</p>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="border p-4 rounded-lg bg-blue-50">
                <p><strong>Q{idx + 1}:</strong> {q.text}</p>
                <p><strong>Type:</strong> {q.type}</p>
                <p><strong>Marks:</strong> {q.marks}</p>
                <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>

                {(q.type === 'multiplechoice' || q.type === 'radiobutton') && (
                  <div className="mt-2">
                    <p className="font-medium text-gray-700">Options:</p>
                    <ul className="list-disc pl-6">
                      {q.options?.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExamModal;
