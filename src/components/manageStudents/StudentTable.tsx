// src/components/manageStudents/StudentTable.tsx

import React from 'react';
import { Student } from '../../types/student';
import { Branch } from '../../types/branch';

interface StudentTableProps {
  students: Student[];
  onToggleAccess: (student: Student) => void;
  branches: Branch[];
  onBranchChange: (studentId: number, newBranch: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, onToggleAccess, branches, onBranchChange }) => {
  const handleBranchChange = (student: Student, newBranch: string) => {
    if (student.is_enabled) {
      alert('Please disable the student before changing the branch.');
      return;
    }
    onBranchChange(student.id, newBranch);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-sm border border-gray-200">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Branch</th>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Enabled</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">{student.name}</td>
              <td className="px-4 py-3">{student.email}</td>
              <td className="px-4 py-3">
                <select
                  value={student.branch}
                  onChange={(e) => onBranchChange(student.id, e.target.value)}
                  className="border border-gray-300 px-2 py-1 rounded-md text-sm bg-white"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">{student.has_submitted ? 'Yes' : 'No'}</td>
              <td className="px-4 py-3">{student.is_enabled ? 'Yes' : 'No'}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onToggleAccess(student)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    student.is_enabled
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {student.is_enabled ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
