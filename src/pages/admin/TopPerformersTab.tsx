import React, { useState } from 'react';
import API from '../../services/api';

interface TopPerformer {
  studentname: string;
  branch: string;
  score: string;
  status: string;
}

interface Props {
  examList: string[];
  branchList: string[];
  instituteId: number | null; // allow null
}

const TopPerformersTab: React.FC<Props> = ({ examList, branchList, instituteId }) => {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [topN, setTopN] = useState(5);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [searched, setSearched] = useState(false);

  const fetchTopPerformers = async () => {
    if (!selectedExam || !instituteId) return;

    try {
      const response = await API.get('/auth/institute/topPerformers', {
        params: {
          instituteId,
          examTitle: selectedExam,
          branch: selectedBranch,
          limit: topN
        }
      });
      setTopPerformers(response.data.topPerformers || []);
      setSearched(true);
    } catch (err) {
      console.error('Failed to fetch top performers:', err);
    }
  };

  return (
    <div className="pt-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Select Exam</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full shadow-sm"
          >
            <option value="">-- Select Exam --</option>
            {examList.map((exam) => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Branch (optional)</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full shadow-sm"
          >
            <option value="">All Branches</option>
            {branchList.map((branch) => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Top N</label>
          <select
            value={topN}
            onChange={(e) => setTopN(parseInt(e.target.value))}
            className="p-3 border border-gray-300 rounded-lg w-full shadow-sm"
          >
            {[3, 5, 10].map((n) => (
              <option key={n} value={n}>Top {n}</option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={fetchTopPerformers}
            disabled={!selectedExam}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full font-semibold shadow disabled:opacity-50"
          >
            🔍 Show Top Performers
          </button>
        </div>
      </div>

      {topPerformers.length > 0 && (
        <div className="overflow-auto rounded-lg shadow-md mt-4">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-4 py-3 border">Student Name</th>
                <th className="px-4 py-3 border">Branch</th>
                <th className="px-4 py-3 border">Score</th>
                <th className="px-4 py-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((res, idx) => (
                <tr key={idx} className="even:bg-white odd:bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-2 border">{res.studentname}</td>
                  <td className="px-4 py-2 border">{res.branch}</td>
                  <td className="px-4 py-2 border">{res.score}</td>
                  <td className={`px-4 py-2 border font-semibold ${
                    res.status.toLowerCase() === 'pass' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {res.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedExam && topPerformers.length === 0 && searched && (
        <div className="text-center text-gray-500 italic mt-6">No performers found for this exam.</div>
      )}
    </div>
  );
};

export default TopPerformersTab;
