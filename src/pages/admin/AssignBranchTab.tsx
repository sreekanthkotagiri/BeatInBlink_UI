import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import API from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';

interface Exam {
  id: number;
  title: string;
}

interface Branch {
  id: number;
  name: string;
}

const AssignBranchTab: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [selectedBranchIds, setSelectedBranchIds] = useState<number[]>([]);
  const [instituteId, setInstituteId] = useState<number>();

  useEffect(() => {
    const storedInstitute = localStorage.getItem('institute');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
    if (!institute || !institute.id) {
      console.error('No institute ID found');
      return;
    }
    setInstituteId(institute.id);
    fetchExams(institute.id);
  }, []);

  const fetchExams = async (id: number) => {
    try {
      const res = await API.get(`/auth/institute/search-exam?instituteId=${id}`);
      setExams(res.data || []);
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await API.get(`/auth/institute/branches?instituteId=${instituteId}`);
      setBranches(res.data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const handleSearch = async () => {
    if (!selectedExamId) return;

    try {
      await fetchBranches(); // 1. Fetch all branches

      const res = await API.get(`/auth/institute/exam-assigned-branches`, {
        params: { examId: selectedExamId }
      });

      // 2. Pre-check already assigned
      setSelectedBranchIds(res.data.assignedBranchIds || []);
    } catch (err) {
      console.error('Failed to fetch assigned branches:', err);
      setSelectedBranchIds([]);
    }
  };

  const toggleBranch = (branchId: number) => {
    setSelectedBranchIds((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

  const handleAssign = async () => {
    if (!selectedExamId || selectedBranchIds.length === 0) return;

    try {
      await API.post('/auth/institute/assign-exam-to-branches', {
        examId: selectedExamId,
        branchIds: selectedBranchIds,
      });
      toast.success('✅ Exam successfully assigned and synced!');
      setSelectedBranchIds([]);
    } catch (err) {
      console.error('Assignment failed:', err);
      toast.error('❌ Failed to assign exam. Please try again.');
    }
    
  };

  const examOptions = exams.map((exam) => ({
    value: exam.id,
    label: exam.title,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Search & Select Exam</label>
          <Select
            options={examOptions}
            placeholder="Search exams..."
            isClearable
            onChange={(selected) => setSelectedExamId(selected?.value || null)}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            disabled={!selectedExamId}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow disabled:opacity-50 w-full"
          >
            🔍 Search Branches
          </button>
        </div>
      </div>

      {branches.length > 0 && (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-800">Select Branches:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {branches.map((branch) => (
                <label key={branch.id} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={selectedBranchIds.includes(branch.id)}
                    onChange={() => toggleBranch(branch.id)}
                  />
                  {branch.name}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleAssign}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow"
            disabled={!selectedExamId || selectedBranchIds.length === 0}
          >
            ✅ Assign Exam
          </button>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AssignBranchTab;
