import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Button, Input, Select } from '../../components/ui/input';


interface Exam {
  id: string;
  title: string;
  branch: string;
  scheduled_date: string;
  duration_min: number;
  pass_percentage: number;
  expires_at: string;
  is_enabled: boolean;
  result_locked: boolean;
}

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const SearchExamPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [instituteId, setInstituteId] = useState<number>();
  const [sortField, setSortField] = useState('scheduled_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [exams, setExams] = useState<Exam[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const storedInstitute = localStorage.getItem('institute');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
        if (!institute || !institute.id) return;
    setInstituteId(institute.id);
    fetchBranches(institute.id);
  }, []);

  const fetchBranches = async (id: number) => {
    try {
      const res = await API.get(`/auth/institute/branches?instituteId=${id}`);
      setBranches(res.data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const fetchExams = async () => {
    try {
      const params = {
        search,
        branch: branchFilter,
        date: dateFilter,
        sortField,
        sortOrder,
        instituteId,
      };
      const res = await API.get('/auth/institute/search-exam', { params });
      setExams(res.data);
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };

  const toggleExamStatus = async (examId: string, currentStatus: boolean) => {
    try {
      await API.put(`/auth/institute/exams/${examId}/enable`, {
        is_enabled: !currentStatus,
      });
      fetchExams(); // Refresh list
    } catch (err) {
      console.error('Failed to toggle exam status', err);
    }
  };

  const toggleResultLock = async (examId: string, currentLock: boolean) => {
  try {
    await API.put(`/auth/institute/exams/${examId}/lock-result`, {
      result_locked: !currentLock,
    });
    fetchExams(); // refresh
  } catch (err) {
    console.error('Failed to toggle result lock status', err);
  }
};

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">🔍 Search Exams</h2>

      <div className="bg-white p-4 rounded-xl shadow-md mb-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Input
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
        >
          <option value="">All Branches</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.name}>
              {branch.name}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <div className="flex gap-2">
          <Select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="scheduled_date">Scheduled Date</option>
            <option value="title">Title</option>
          </Select>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <Button className="bg-green-600 hover:bg-green-700" onClick={fetchExams}>
          🔍 Search
        </Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Scheduled Date</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Pass %</th>
              <th className="px-4 py-2">Expiry</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Result Lock</th> {/* new column */}
            </tr>
          </thead>
          <tbody>
            {exams.length > 0 ? (
              exams.map((exam) => (
                <tr key={exam.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{exam.title}</td>
                  <td className="px-4 py-2">{formatDate(exam.scheduled_date)}</td>
                  <td className="px-4 py-2">{exam.duration_min} min</td>
                  <td className="px-4 py-2">{exam.pass_percentage}%</td>
                  <td className="px-4 py-2">{formatDate(exam.expires_at)}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleExamStatus(exam.id, exam.is_enabled)}
                      className={`px-3 py-1 rounded-md text-white ${exam.is_enabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                      {exam.is_enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleResultLock(exam.id, exam.result_locked)}
                      className={`px-3 py-1 rounded-md text-white ${exam.result_locked ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {exam.result_locked ? 'Unlock' : 'Lock'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-6">
                  ❗ No exams match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchExamPage;