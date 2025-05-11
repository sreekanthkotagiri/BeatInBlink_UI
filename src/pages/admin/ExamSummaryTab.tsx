import React, { useState } from 'react';
import API from '../../services/api';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import Papa from 'papaparse';

interface AttendedStudent {
  id: number;
  name: string;
  branch: string;
  score: string;
  status: string;
}

interface NotAttendedStudent {
  id: number;
  name: string;
  branch: string;
}

interface Props {
  examList: string[];
  branchList: string[];
  instituteId: number | null;
}

const COLORS = ['#4CAF50', '#F44336'];

const ExamSummaryTab: React.FC<Props> = ({ examList, branchList, instituteId }) => {
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const fetchSummary = async () => {
    if (!selectedExam || !instituteId) return;

    try {
      const response = await API.get('/auth/institute/exam-summary', {
        params: {
          instituteId,
          examTitle: selectedExam,
          branch: selectedBranch !== '' ? selectedBranch : null
        }
      });
      setSummary(response.data);
      setSearched(true);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const handleExport = () => {
    if (!summary?.attendedList) return;
    const csvData = [
      ['Student Name', 'Branch', 'Score', 'Status'],
      ...summary.attendedList.map((s: any) => [s.name, s.branch, s.score, s.status])
    ];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Exam-${summary.examTitle}-attended.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pieData = [
    { name: 'Pass', value: summary?.passCount || 0 },
    { name: 'Fail', value: summary?.failCount || 0 },
  ];

  const showChart = (summary?.passCount || 0) + (summary?.failCount || 0) > 0;

  return (
    <div className="pt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Exam</label>
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
          <button
            onClick={fetchSummary}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full font-semibold shadow disabled:opacity-50"
          >
            🔍 View Summary
          </button>
        </div>
      </div>

      {summary && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center mb-6">
            <div className="bg-blue-100 p-3 rounded shadow text-blue-800 font-semibold">Enabled: {summary.totalEnabled}</div>
            <div className="bg-green-100 p-3 rounded shadow text-green-700 font-semibold">Attended: {summary.attendedCount}</div>
            <div className="bg-yellow-100 p-3 rounded shadow text-yellow-700 font-semibold">Not Attended: {summary.notAttendedCount}</div>
            <div className="bg-green-200 p-3 rounded shadow text-green-800 font-semibold">Pass: {summary.passCount}</div>
            <div className="bg-red-200 p-3 rounded shadow text-red-800 font-semibold">Fail: {summary.failCount}</div>
            <div className="bg-purple-100 p-3 rounded shadow text-purple-800 font-semibold">Avg Score: {summary.averageScore}</div>
          </div>

          {showChart && (
            <div className="flex justify-center mb-4">
              <PieChart width={300} height={200}>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </div>
          )}

          <button
            onClick={handleExport}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold shadow mb-4"
          >
            ⬇️ Export Attended CSV
          </button>

          <h3 className="text-lg font-semibold text-blue-800 mb-2">✅ Attended Students</h3>
          <div className="overflow-auto mb-6 rounded shadow">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Branch</th>
                  <th className="border px-4 py-2">Score</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {summary.attendedList.map((s: AttendedStudent, idx: number) => (
                  <tr key={idx} className="even:bg-white odd:bg-gray-50">
                    <td className="border px-4 py-2">{s.name}</td>
                    <td className="border px-4 py-2">{s.branch}</td>
                    <td className="border px-4 py-2">{s.score}</td>
                    <td className={`border px-4 py-2 font-semibold ${
                      s.status.toLowerCase() === 'pass' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {s.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-semibold text-blue-800 mb-2">❌ Not Attended Students</h3>
          <div className="overflow-auto rounded shadow">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-yellow-100 text-yellow-900">
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Branch</th>
                </tr>
              </thead>
              <tbody>
                {summary.notAttendedList.map((s: NotAttendedStudent, idx: number) => (
                  <tr key={idx} className="even:bg-white odd:bg-gray-50">
                    <td className="border px-4 py-2">{s.name}</td>
                    <td className="border px-4 py-2">{s.branch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {searched && !summary && (
        <div className="text-center text-gray-500 italic mt-6">No data found for this exam.</div>
      )}
    </div>
  );
};

export default ExamSummaryTab;
