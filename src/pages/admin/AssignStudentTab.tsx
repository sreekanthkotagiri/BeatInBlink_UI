import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Exam {
  id: number;
  title: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  branch: string;
}

const AssignStudentTab: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedInstitute = localStorage.getItem('institute');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
    if (!institute || !institute.id) {
      console.error('No institute ID found');
      return;
    }
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

  const handleSearch = async () => {
    const storedInstitute = localStorage.getItem('institute');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
    if (!institute?.id || !searchTerm.trim()) return;

    try {
      const res = await API.get(`/auth/institute/search-students?instituteId=${institute.id}&query=${searchTerm}`);
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err) {
      console.error('Error searching students:', err);
      toast.error('❌ Failed to search students');
    }
  };
  const toggleStudent = (studentId: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssign = async () => {
    if (!selectedExamId || selectedStudentIds.length === 0) return;

    try {
      await API.post('/auth/institute/assign-exam-to-students', {
        examId: selectedExamId,
        studentIds: selectedStudentIds,
      });
      toast.success('✅ Exam assigned to selected students');
      setSelectedStudentIds([]);
    } catch (err) {
      console.error('Assignment failed:', err);
      toast.error('❌ Failed to assign exam');
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Select Exam</label>
          <select
            value={selectedExamId ?? ''}
            onChange={(e) => setSelectedExamId(Number(e.target.value))}
            className="p-3 border border-gray-300 rounded-lg w-full shadow-sm"
          >
            <option value="">-- Select an exam --</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Search Students</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or branch"
              className="p-3 border border-gray-300 rounded-lg w-full shadow-sm"
            />
            <button
              onClick={handleSearch}
              disabled={!searchTerm.trim()}
              className={`px-4 rounded-lg text-white font-medium ${searchTerm.trim()
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {selectedStudentIds.length > 0 && (
        <p className="text-sm text-green-600">✅ {selectedStudentIds.length} student(s) selected</p>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">Select Students:</h3>
        <div className="max-h-[400px] overflow-y-auto border rounded-md p-4 bg-white shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStudents.map((student) => (
              <label key={student.id} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                <input
                  type="checkbox"
                  checked={selectedStudentIds.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                />
                <span>{student.name} ({student.branch})</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={handleAssign}
          className={`mt-6 px-6 py-3 rounded-lg font-semibold shadow text-white ${selectedExamId && selectedStudentIds.length > 0
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
          disabled={!selectedExamId || selectedStudentIds.length === 0}
        >
          ✅ Assign Exam
        </button>
        {(!selectedExamId || selectedStudentIds.length === 0) && (
          <p className="text-xs text-red-500 mt-1">Please select an exam and at least one student</p>
        )}
      </div>
    </div>
  );
};

export default AssignStudentTab;
