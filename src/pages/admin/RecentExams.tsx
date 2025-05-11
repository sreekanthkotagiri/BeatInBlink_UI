import React from 'react';

interface Exam {
  id: string;
  title: string;
  status: 'Published' | 'Scheduled';
}

const RecentExams = ({ exams = [] }: { exams?: Exam[] }) => {
  const recent = exams.slice(0, 3);

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Recent Exams</h2>
      <ul className="divide-y divide-gray-200">
        {recent.map((exam) => (
          <li key={exam.id} className="py-2 flex justify-between text-sm">
            <span>{exam.title}</span>
            <span className="text-gray-500">{exam.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentExams;
