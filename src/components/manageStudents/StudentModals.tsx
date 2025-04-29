// File: src/components/manageStudents/StudentModals.tsx
import React from 'react';
import { Branch } from '../../types/branch';
import { NewStudent } from '../../types/student';

type Props = {
  showStudentModal: boolean;
  setShowStudentModal: (val: boolean) => void;
  showBranchModal: boolean;
  setShowBranchModal: (val: boolean) => void;
  newStudent: NewStudent;
  setNewStudent: (student: NewStudent) => void;
  newBranch: string;
  setNewBranch: (name: string) => void;
  branches: Branch[];
  handleRegisterStudent: () => void;
  handleCreateBranch: () => void;
  handleBulkUpload: () => void;
  handleCSVUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const StudentModals: React.FC<Props> = ({
  showStudentModal,
  setShowStudentModal,
  showBranchModal,
  setShowBranchModal,
  newStudent,
  setNewStudent,
  newBranch,
  setNewBranch,
  branches,
  handleRegisterStudent,
  handleCreateBranch,
  handleBulkUpload,
  handleCSVUpload
}) => {
  return (
    <>
      {/* Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
            <h3 className="text-xl font-semibold mb-4">Register New Student</h3>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <input type="file" accept=".csv" onChange={handleCSVUpload} className="border p-2 rounded" />
              <button
                onClick={handleBulkUpload}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Upload CSV
              </button>
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="text-md font-semibold mb-2">Or Register Manually</h4>
              <input
                type="text"
                className="border p-2 rounded mb-2"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              />
              <input
                type="email"
                className="border p-2 rounded mb-2"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              />
              <input
                type="password"
                className="border p-2 rounded mb-2"
                placeholder="Password"
                value={newStudent.password}
                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
              />

              <select
                className="border p-2 rounded mb-2"
                value={newStudent.branchId}
                onChange={(e) => setNewStudent({ ...newStudent, branchId: e.target.value })}
              >
                <option value="">-- Select Branch --</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => setShowStudentModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                <button onClick={handleRegisterStudent} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
            <h3 className="text-xl font-semibold mb-4">Create New Branch</h3>
            <input
              type="text"
              className="border p-2 rounded w-full mb-4"
              placeholder="Enter branch name"
              value={newBranch}
              onChange={(e) => setNewBranch(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowBranchModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
              <button onClick={handleCreateBranch} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Create</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentModals;
