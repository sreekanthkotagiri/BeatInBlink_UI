import React, { useEffect, useState } from 'react';
import API from '../../services/api';

interface Branch {
  id: string;
  name: string;
}

interface EnableExamDrawerProps {
  examId: number;
  onClose: () => void;
}

const EnableExamDrawer: React.FC<EnableExamDrawerProps> = ({ examId, onClose }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const storedInstitute = localStorage.getItem('institute');
        const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
        if (!institute?.id) return;

        const res = await API.get(`/auth/institute/branches?instituteId=${institute.id}`);
        setBranches(res.data);
      } catch (err) {
        console.error('Error fetching branches:', err);
      }
    };

    fetchBranches();
  }, []);

  const handleCheckboxChange = (branchId: string) => {
    setSelectedBranchIds((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

  const handleAction = async (action: 'enable' | 'disable') => {
    if (selectedBranchIds.length === 0) return alert('Please select at least one branch');
    setLoading(true);
    try {
      await API.post(`/auth/institute/${action}ExamAccess`, {
        examId,
        type: 'branch',
        branchIds: selectedBranchIds,
      });
      alert(`✅ Exam ${action === 'enable' ? 'enabled' : 'disabled'} for selected branches`);
      onClose();
    } catch (err) {
      console.error(`Error ${action}ing exam:`, err);
      alert(`❌ Failed to ${action} exam.`);
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedBranchNames = branches.filter(branch => selectedBranchIds.includes(branch.id));

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
      <div className="absolute right-0 top-0 w-full max-w-md bg-white h-full shadow-xl p-6 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Exam Access by Branch</h2>

        <input
          type="text"
          placeholder="Search branches..."
          className="w-full px-3 py-2 mb-4 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="overflow-y-auto flex-1 border rounded p-3 mb-4">
          {filteredBranches.length > 0 ? (
            filteredBranches.map((branch) => (
              <label key={branch.id} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  value={branch.id}
                  checked={selectedBranchIds.includes(branch.id)}
                  onChange={() => handleCheckboxChange(branch.id)}
                />
                <span>{branch.name}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">No branches found.</p>
          )}
        </div>

        {selectedBranchIds.length > 0 && (
          <div className="mb-4 text-sm text-gray-700">
            <p className="font-semibold mb-1">Selected Branches:</p>
            <ul className="list-disc list-inside text-sm text-blue-700">
              {selectedBranchNames.map((branch) => (
                <li key={branch.id}>{branch.name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >Cancel</button>
          <button
            onClick={() => handleAction('disable')}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >{loading ? 'Processing...' : 'Disable Exam'}</button>
          <button
            onClick={() => handleAction('enable')}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >{loading ? 'Processing...' : 'Enable Exam'}</button>
        </div>
      </div>
    </div>
  );
};

export default EnableExamDrawer;