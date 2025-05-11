import React, { useEffect, useState } from 'react';
import API from '../../services/api';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    id: number;
    title: string;
    scheduled_date: string;
    duration_min: number;
    pass_percentage: number;
  }| null;
}

const CreateExamDrawerNew: React.FC<Props> = ({ onClose, onSuccess, initialData }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(60);
  const [passPercentage, setPassPercentage] = useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.scheduled_date);
      setDuration(initialData.duration_min);
      setPassPercentage(initialData.pass_percentage);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!title || !date) return alert('Please fill all fields');
    setLoading(true);
    try {
      if (initialData) {
        await API.put('/auth/institute/update-exam', {
          id: initialData.id,
          title,
          scheduled_date: date,
          duration_min: duration,
          pass_percentage: passPercentage,
        });
        alert('Exam updated successfully');
      } else {
        await API.post('/auth/institute/create-exam', {
          title,
          scheduled_date: date,
          duration_min: duration,
          pass_percentage: passPercentage,
        });
        alert('Exam created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving exam:', error);
      alert('Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 p-6 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit Exam' : 'Create New Exam'}</h2>

      <div className="mb-4">
        <label className="block text-sm mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Scheduled Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Duration (minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="border rounded w-full p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Pass Percentage</label>
        <input
          type="number"
          value={passPercentage}
          onChange={(e) => setPassPercentage(parseInt(e.target.value))}
          className="border rounded w-full p-2"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? 'Saving...' : initialData ? 'Update Exam' : 'Create Exam'}
        </button>
      </div>
    </div>
  );
};

export default CreateExamDrawerNew;