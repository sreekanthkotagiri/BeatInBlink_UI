import React from 'react';

interface Exam {
  id: string;
  title: string;
  status: 'Published' | 'Scheduled';
}

const RecentExams = ({ exams = [] }: { exams?: Exam[] }) => {
  const recent = exams.slice(0, 3);

  return (
    <div className="p-6">
      {recent.length > 0 ? (
        <ul className="space-y-4">
        {recent.map((exam) => (
          <li key={exam.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100/50 hover:shadow-md transition-all duration-200">
            <div>
              <span className="font-semibold text-gray-800 text-lg">{exam.title}</span>
              <p className="text-sm text-gray-600 mt-1">Exam ID: {exam.id}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              exam.status === 'Published' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
            }`}>
              {exam.status}
            </span>
          </li>
        ))}
        </ul>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">No recent exams to display</p>
          <p className="text-gray-400 text-sm mt-2">Create your first exam to see it here</p>
        </div>
      )}
    </div>
  );
};

export default RecentExams;
