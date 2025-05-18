import React, { useState } from 'react';
import Papa from 'papaparse';
import API from '../../services/api';
import { StudentPayload } from '../../types/student';



const BulkUploadStudent: React.FC = () => {
    const [bulkStudents, setBulkStudents] = useState<StudentPayload[]>([]);
    const [uploading, setUploading] = useState(false);
    const [showStatusColumn, setShowStatusColumn] = useState(false);


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsedData = results.data as StudentPayload[];
                const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const seenEmails = new Set();
                const formatted: StudentPayload[] = [];

                parsedData.forEach((row, idx) => {
                    const entry: StudentPayload = {
                        name: row.name?.trim() || '',
                        email: row.email?.trim().toLowerCase() || '',
                        branch: row.branch?.trim() || '',
                        password: row.password?.trim() || '',
                    };

                    if (!entry.name || !entry.email || !entry.branch || !entry.password) {
                        entry.error = 'Missing required fields';
                    } else if (!validEmail.test(entry.email)) {
                        entry.error = 'Invalid email format';
                    } else if (seenEmails.has(entry.email)) {
                        entry.error = 'Duplicate in file';
                    } else {
                        seenEmails.add(entry.email);
                    }

                    formatted.push(entry);
                });

                setBulkStudents(formatted);
            }
        });
    };

    const handleUpload = async () => {
        setShowStatusColumn(true); // Show the status column after button click

        const errors = bulkStudents.filter((s) => s.error);
        if (errors.length > 0) {
            return;
        }

        try {
            setUploading(true);
            const institute = JSON.parse(localStorage.getItem('institute') || '{}');
            const payload = {
                instituteId: institute.id,
                students: bulkStudents,
            };

            await API.post('/auth/institute/bulk-upload', payload);
            alert('✅ All students uploaded successfully');
            setBulkStudents([]);
            setShowStatusColumn(false); // Hide again if upload succeeds
        } catch (err: any) {
            if (err.response?.status === 409 && Array.isArray(err.response.data?.errors)) {
                const failedEmails = err.response.data.errors;
                const updated = bulkStudents.map((student) => {
                    const foundError = failedEmails.find((e: any) =>
                        e.email.toLowerCase() === student.email.toLowerCase()
                    );
                    return foundError ? { ...student, error: foundError.reason } : student;
                });

                setBulkStudents(updated);
            } else {
                console.error('Upload failed:', err);
                alert('❌ Upload failed due to server error');
            }
        } finally {
            setUploading(false);
        }
    };



    const resetUpload = () => {
        setBulkStudents([]);
    };

    return (
        <div className="mt-4 space-y-4">
            <h3 className="text-lg font-medium text-gray-700">📂 Upload Student CSV</h3>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full max-w-xs border border-gray-300 rounded px-3 py-2"
            />

            {bulkStudents.length > 0 && (
                <>
                    <div className="overflow-auto max-h-72 border rounded shadow">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Branch</th>
                                    <th className="px-4 py-2">Password</th>
                                    {showStatusColumn && <th className="px-4 py-2 text-red-600">Status</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {bulkStudents.map((student, index) => (
                                    <tr key={index} className="even:bg-white odd:bg-gray-50">
                                        <td className="px-4 py-2">{student.name}</td>
                                        <td className="px-4 py-2">{student.email}</td>
                                        <td className="px-4 py-2">{student.branch}</td>
                                        <td className="px-4 py-2">{student.password}</td>
                                        {showStatusColumn && (
                                            <td className="px-4 py-2 text-red-600">{student.error || ''}</td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="bg-blue-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow disabled:opacity-50"
                        >
                            🚀 Upload All
                        </button>
                        <button
                            onClick={resetUpload}
                            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded shadow"
                        >
                            🔄 Reset
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BulkUploadStudent;
