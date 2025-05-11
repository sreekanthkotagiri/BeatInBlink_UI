import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '../../components/ui/input';
import { toast, ToastContainer } from 'react-toastify';

const AddStudentTab: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [branchId, setBranchId] = useState<number | ''>(''); // store id now
    const [branches, setBranches] = useState<Branch[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const institute = JSON.parse(localStorage.getItem('institute') || '{}');
            const res = await API.get(`/auth/institute/branches?instituteId=${institute.id}`);
            setBranches(res.data || []);
        } catch (err) {
            toast.error('❌ Failed to load branches');
        }
    };

    const handleSubmit = async () => {
        if (!name || !email || !password || !branchId) {
            toast.error('❌ All fields are required');
            return;
        }

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validEmail.test(email)) {
            toast.error('❌ Invalid email format');
            return;
        }

        if (password.length < 6) {
            toast.error('❌ Password must be at least 6 characters');
            return;
        }

        try {
            setSubmitting(true);
            const institute = JSON.parse(localStorage.getItem('institute') || '{}');
            const payload = {
                name,
                email,
                password,
                branchId, // updated field
                instituteId: institute.id,
            };

            await API.post('/auth/student/register', payload);
            toast.success('✅ Student added successfully');
            setName('');
            setEmail('');
            setPassword('');
            setBranchId('');
        } catch (err) {
            toast.error('❌ Failed to add student');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4 max-w-xl">
            <h3 className="text-lg font-semibold text-gray-800">➕ Add Student</h3>

            <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm"
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded shadow-sm"
            />
            <Button onClick={() => toast.success('✅ Manual Test Toast')}>Test Toast</Button>
            <select
                value={branchId}
                onChange={(e) => setBranchId(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded shadow-sm"
            >
                <option value="">-- Select Branch --</option>
                {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                        {b.name}
                    </option>
                ))}
            </select>
            <ToastContainer position="top-right" autoClose={3000} />
            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow disabled:opacity-50"
            >
                {submitting ? 'Adding...' : '✅ Add Student'}
            </button>
        </div>
    );
};

export default AddStudentTab;
