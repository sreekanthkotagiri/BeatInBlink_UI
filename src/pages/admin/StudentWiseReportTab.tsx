import React, { useState } from 'react';
import API from '../../services/api';

interface ReportEntry {
  examtitle: string;
  score: string;
  status: string;
  scheduled_date?: string;
}

interface Props {
  branchList: string[];
  examList: string[];
  instituteId: number | null;
}

const StudentWiseReportTab: React.FC<Props> = ({ branchList, instituteId }) => {
  const [studentName, setStudentName] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [report, setReport] = useState<ReportEntry[]>([]);
  const [searched, setSearched] = useState(false);

  const fetchStudentReport = async () => {
    if (!studentName || !instituteId) return;

    try {
      const response = await API.get('/auth/institute/student-report', {
        params: {
          instituteId,
          studentName,
          branch: selectedBranch || ''
        }
      });
      setReport(response.data.report || []);
      setSearched(true);
    } catch (err) {
      console.error('Error fetching student report:', err);
    }
  };

  const passCount = report.filter(r => r.status.toLowerCase() === 'pass').length;
  const failCount = report.length - passCount;

  return (
    <div className="pt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Student Name</label>
          <input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter student name"
            className="p-3 border border-gray-300 rounded-lg w-full shadow-sm"
          />
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
            onClick={fetchStudentReport}
            disabled={!studentName}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full font-semibold shadow disabled:opacity-50"
          >
            🔍 Show Report
          </button>
        </div>
      </div>

      {report.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-6 mb-6 text-center">
            <div className="bg-blue-100 rounded-lg p-4 shadow text-blue-800 font-semibold">
              Total Exams: {report.length}
            </div>
            <div className="bg-green-100 rounded-lg p-4 shadow text-green-700 font-semibold">
              Pass: {passCount}
            </div>
            <div className="bg-red-100 rounded-lg p-4 shadow text-red-600 font-semibold">
              Fail: {failCount}
            </div>
          </div>

          <div className="overflow-auto rounded-lg shadow-md mt-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="px-4 py-3 border">Exam Title</th>
                  <th className="px-4 py-3 border">Score</th>
                  <th className="px-4 py-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.map((entry, index) => (
                  <tr key={index} className="even:bg-white odd:bg-gray-50 hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-2 border">{entry.examtitle}</td>
                    <td className="px-4 py-2 border">{entry.score}</td>
                    <td className={`px-4 py-2 border font-semibold ${
                      entry.status.toLowerCase() === 'pass' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entry.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {searched && report.length === 0 && (
        <div className="text-center text-gray-500 italic mt-6">No report found for this student.</div>
      )}
    </div>
  );
};

export default StudentWiseReportTab;
