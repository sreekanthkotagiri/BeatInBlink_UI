import React from 'react';

interface Result {
  examid: number;
  examtitle: string;
  studentname: string;
  branch: string;
  score: string;
  status: string;
}

interface AllResultsTabProps {
  results: Result[];
  totalCount: number;
  searchTerm: string;
  selectedBranch: string;
  selectedExam: string;
  branchList: string[];
  examList: string[];
  page: number;
  setPage: (page: number) => void;
  applyFilters: () => void;
  setSearchTerm: (val: string) => void;
  setSelectedBranch: (val: string) => void;
  setSelectedExam: (val: string) => void;
}

const AllResultsTab: React.FC<AllResultsTabProps> = ({
  results,
  totalCount,
  searchTerm,
  selectedBranch,
  selectedExam,
  branchList,
  examList,
  page,
  setPage,
  applyFilters,
  setSearchTerm,
  setSelectedBranch,
  setSelectedExam
}) => {
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search student, exam, or branch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full shadow-sm"
          >
            <option value="">All Exams</option>
            {examList.map((exam) => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={applyFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full font-semibold shadow"
          >
            🔍 Search
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-lg shadow-md">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-3 border">Exam ID</th>
              <th className="px-4 py-3 border">Exam Title</th>
              <th className="px-4 py-3 border">Student Name</th>
              <th className="px-4 py-3 border">Branch</th>
              <th className="px-4 py-3 border">Score</th>
              <th className="px-4 py-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((res, index) => (
                <tr key={index} className="even:bg-white odd:bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-2 border">{res.examid}</td>
                  <td className="px-4 py-2 border">{res.examtitle}</td>
                  <td className="px-4 py-2 border">{res.studentname}</td>
                  <td className="px-4 py-2 border">{res.branch}</td>
                  <td className="px-4 py-2 border">{res.score}</td>
                  <td className={`px-4 py-2 border font-semibold ${res.status.toLowerCase() === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                    {res.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          ◀ Prev
        </button>
        <span className="text-sm font-medium">Page {page} of {totalPages}</span>
        <button
          onClick={() => page < totalPages && setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </>
  );
};

export default AllResultsTab;