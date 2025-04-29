import React from 'react';

const Exams: React.FC = () => {
  const mockExams = [
    { title: 'Math Midterm', date: '2025-04-15', status: 'upcoming' },
    { title: 'Physics Quiz', date: '2025-03-30', status: 'completed' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Exams</h2>
      <ul className="space-y-3">
        {mockExams.map((exam, idx) => (
          <li key={idx} className="p-4 border rounded shadow bg-white">
            <div className="font-bold">{exam.title}</div>
            <div>Date: {exam.date}</div>
            <div>Status: {exam.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Exams;
