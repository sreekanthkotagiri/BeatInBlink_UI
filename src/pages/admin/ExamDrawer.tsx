import React from 'react';
import { Exam, ExamsWithQuestion, Question } from '../../types/exam';

type ExamDrawerProps = {
  mode: 'view' | 'edit';
  exam: ExamsWithQuestion;
  onClose: () => void;
  onSave?: (updated: Exam) => void;
  setExamData?: React.Dispatch<React.SetStateAction<ExamsWithQuestion>>;
};

const ExamDrawer: React.FC<ExamDrawerProps> = ({ mode, exam, onClose, onSave, setExamData }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>

      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col rounded-l-2xl">
        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">
            {mode === 'view' ? '📄 Exam Details' : '✏️ Edit Exam'}
          </h2>

          {mode === 'view' && (
            <div className="space-y-4 text-gray-700">
              <p><strong>Title:</strong> {exam.title}</p>
              <p><strong>Branch:</strong> {exam.branch}</p>
              <p><strong>Scheduled Date:</strong> {new Date(exam.scheduled_date).toLocaleString()}</p>
              <p><strong>Duration:</strong> {exam.duration_min} minutes</p>
              <p><strong>Pass Percentage:</strong> {exam.pass_percentage}%</p>

              <hr className="my-4" />
              <h3 className="text-lg font-semibold text-gray-800">📝 Questions</h3>
              <div className="space-y-4">
                {exam.questions?.map((q: Question, index: number) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-xl shadow">
                    <p className="font-semibold">Q{index + 1}: {q.text}</p>
                    <p><strong>Type:</strong> {q.type}</p>
                    {q.type !== 'trueFalse' && q.type !== 'shortAnswer' && q.options && (
                      <ul className="list-disc ml-6 mt-1 text-sm text-gray-600">
                        {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                      </ul>
                    )}
                    <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                    <p><strong>Marks:</strong> {q.marks}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === 'edit' && setExamData && (
            <form onSubmit={(e) => { e.preventDefault(); if (onSave) onSave(exam); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    name="title"
                    value={exam.title}
                    onChange={(e) => setExamData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full border px-4 py-2 rounded-lg shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                  <input
                    name="scheduled_date"
                    type="datetime-local"
                    value={exam.scheduled_date}
                    onChange={(e) => setExamData((prev) => ({ ...prev, scheduled_date: e.target.value }))}
                    className="w-full border px-4 py-2 rounded-lg shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (min)</label>
                  <input
                    name="duration_min"
                    type="number"
                    value={exam.duration_min}
                    onChange={(e) => setExamData((prev) => ({ ...prev, duration_min: parseInt(e.target.value, 10) }))}
                    className="w-full border px-4 py-2 rounded-lg shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Pass Percentage</label>
                  <input
                    name="pass_percentage"
                    type="number"
                    value={exam.pass_percentage}
                    onChange={(e) => setExamData((prev) => ({ ...prev!, pass_percentage: parseInt(e.target.value, 10) }))}
                    className="w-full border px-4 py-2 rounded-lg shadow-sm"
                    required
                  />
                </div>
              </div>

              <hr className="my-4" />
              <h3 className="text-lg font-semibold text-gray-800">📝 Questions</h3>
              <div className="space-y-4">
                {exam.questions?.map((q: Question, index: number) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-xl shadow space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Q{index + 1}</label>
                    <input
                      className="w-full border rounded px-4 py-2"
                      value={q.text}
                      onChange={(e) => {
                        const updatedQuestions = [...exam.questions];
                        updatedQuestions[index].text = e.target.value;
                        setExamData?.((prev) => ({ ...prev!, questions: updatedQuestions }));
                      }}
                    />
                    <p><strong>Type:</strong> {q.type}</p>

                    {q.type !== 'trueFalse' && q.type !== 'shortAnswer' && q.options && (
                      <ul className="space-y-2">
                        {q.options.map((opt, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <input
                              className="w-full border rounded px-4 py-1"
                              value={opt}
                              onChange={(e) => {
                                const updatedQuestions = [...exam.questions];
                                updatedQuestions[index].options![i] = e.target.value;
                                setExamData?.((prev) => ({ ...prev!, questions: updatedQuestions }));
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedQuestions = [...exam.questions];
                                updatedQuestions[index].options!.splice(i, 1);
                                setExamData?.((prev) => ({ ...prev!, questions: updatedQuestions }));
                              }}
                              className="text-red-500 hover:text-red-700"
                            >✖</button>
                          </li>
                        ))}
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedQuestions = [...exam.questions];
                              const currentOptions = updatedQuestions[index].options ?? [];
                              currentOptions.push('');
                              updatedQuestions[index].options = currentOptions;
                              setExamData?.((prev) => ({ ...prev!, questions: updatedQuestions }));
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >➕ Add Option</button>
                        </li>
                      </ul>
                    )}

                    <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                    <input
                      className="w-full border rounded px-4 py-2"
                      value={q.correctAnswer}
                      onChange={(e) => {
                        const updatedQuestions = [...exam.questions];
                        updatedQuestions[index].correctAnswer = e.target.value;
                        setExamData?.((prev) => ({ ...prev!, questions: updatedQuestions }));
                      }}
                    />

                    <label className="block text-sm font-medium text-gray-700">Marks</label>
                    <input
                      className="w-full border rounded px-4 py-2"
                      value={q.marks}
                      onChange={(e) => {
                        const updatedQuestions = [...exam.questions];
                        updatedQuestions[index].marks = Number(e.target.value);
                        setExamData?.((prev) => ({ ...prev!, questions: updatedQuestions }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </form>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-4 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300"
          >Cancel</button>
          {mode === 'edit' && onSave && (
            <button
              type="submit"
              onClick={() => onSave(exam)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >Save Changes</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDrawer;