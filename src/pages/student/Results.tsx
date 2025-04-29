import React from 'react';

const Results: React.FC = () => {
  const mockResults = [
    { exam: 'Physics Quiz', score: 85, status: 'Passed' },
    { exam: 'English Test', score: 62, status: 'Passed' },
    { exam: 'Math Midterm', score: 40, status: 'Failed' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Results</h2>
      <table className="w-full border shadow bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Exam</th>
            <th className="p-2">Score</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockResults.map((result, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{result.exam}</td>
              <td className="p-2">{result.score}</td>
              <td className="p-2">{result.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Results;
