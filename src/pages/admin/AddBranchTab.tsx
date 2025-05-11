import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import { Button, Input, Modal } from '../../components/ui/input';
import { Branch } from '../../types/branch';

const AddBranchTab: React.FC = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [branchName, setBranchName] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const institute = JSON.parse(localStorage.getItem('institute') || '{}');
            const res = await API.get(`/auth/institute/branches?instituteId=${institute.id}`);
            setBranches(res.data || []);
        } catch (error) {
            toast.error('Failed to fetch branches');
        }
    };

    const handleAddBranch = async (e: React.FormEvent) => {
        e.preventDefault();
        const institute = JSON.parse(localStorage.getItem('institute') || '{}');

        if (!branchName.trim()) {
            toast.warning('Please enter a branch name');
            return;
        }

        setLoading(true);
        try {
            await API.post('/auth/institute/create-branch', {
                name: branchName.trim(),
                instituteId: institute.id,
            });
            toast.success('Branch added successfully');
            setBranchName('');
            setShowAddModal(false);
            fetchBranches();
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Failed to add branch';
            toast.error(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Manage Branches</h2>
                <Button onClick={() => setShowAddModal(true)}>➕ Add Branch</Button>
            </div>

            <table className="w-full border mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Branch Name</th>
                        <th className="p-2 border">Created Date</th>
                    </tr>
                </thead>
                <tbody>
                    {branches.map((branch, idx) => (
                        <tr key={branch.id}>
                            <td className="p-2 border text-center">{idx + 1}</td>
                            <td className="p-2 border">{branch.name}</td>
                            <td className="p-2 border"> {branch.created_at ? new Date(branch.created_at).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer position="top-right" autoClose={3000} />
            {showAddModal && (
                <Modal title="Add New Branch" onClose={() => setShowAddModal(false)}>
                    <form onSubmit={handleAddBranch} className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Enter branch name"
                            value={branchName}
                            onChange={(e) => setBranchName(e.target.value)}
                            required
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Branch'}
                        </Button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default AddBranchTab;
