// File: src/components/manageStudents/ExamSelector.tsx
import React from 'react';

export type Exam = {
  id: number;
  title: string;
  scheduled_date: string;
};

type Props = {
  exams: Exam[];
  selectedExamId: number | null;
  setSelectedExamId: (id: number) => void;
};

const ExamSelector: React.FC<Props> = ({ exams, selectedExamId, setSelectedExamId }) => {
  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium">Select Exam:</label>
      <select
        className="border p-2 rounded w-full"
        value={selectedExamId ?? ''}
        onChange={(e) => setSelectedExamId(Number(e.target.value))}
      >
        <option value="">-- Select Exam --</option>
        {exams.map((exam) => (
          <option key={exam.id} value={exam.id}>
            {exam.title} ({new Date(exam.scheduled_date).toLocaleDateString()})
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExamSelector;
