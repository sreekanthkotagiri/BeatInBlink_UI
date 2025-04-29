import React, { useState } from 'react';
import { Exam, ExamsWithQuestion } from '../../types/exam';

type Props = {
  exam: ExamsWithQuestion;
  onClose: () => void;
  onSave: (updatedExam: Exam) => void;
};

const ExamEditDrawer: React.FC<Props> = ({ exam, onClose, onSave }) => {
  const [formData, setFormData] = useState<Exam>({ ...exam });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Pass updated data back to parent
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>

      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl flex flex-col">
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <h2 className="text-2xl font-bold mb-4">✏️ Edit Exam</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
            <input
              name="scheduled_date"
              type="datetime-local"
              value={formData.scheduled_date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (min)</label>
            <input
              name="duration_min"
              type="number"
              value={formData.duration_min}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pass Percentage</label>
            <input
              name="pass_percentage"
              type="number"
              value={formData.pass_percentage}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Future: Map/edit questions here */}
        </form>

        <div className="p-4 border-t text-right space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="editExamForm"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamEditDrawer;
