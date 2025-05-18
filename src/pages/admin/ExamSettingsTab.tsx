// ✅ ExamSettingsPage.tsx (Manage/Create/Edit + Search + Enable/Lock)
import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Button, Input, Select } from '../../components/ui/input';
import { Question } from '../../types/exam';
import CreateExamDrawer from '../guest/CreateExamDrawer';
import { formatDate } from '../../utils/utils';

interface Exam {
  id: string;
  title: string;
  branch: string;
  created_at: string;
  duration_min: number;
  pass_percentage: number;
  expires_at: string;
  is_enabled: boolean;
  result_locked: boolean;
  description?: string;
  questions?: Question[];
  status?: 'enabled' | 'disabled';
  restrict_access?: boolean;
  time_limit_enabled?: boolean;
}

const ExamSettingsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState('scheduled_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [instituteId, setInstituteId] = useState<number>();
  const [exams, setExams] = useState<Exam[]>([]);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);

  const [showDrawer, setShowDrawer] = useState(false);
  const [readOnlyView, setReadOnlyView] = useState(false);
  const [editExamId, setEditExamId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [durationMin, setDurationMin] = useState(0);
  const [passPercentage, setPassPercentage] = useState(0);
  const [restrictAccess, setRestrictAccess] = useState(false);
  const [enableTimeLimit, setEnableTimeLimit] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionMode, setQuestionMode] = useState<'manual' | 'upload' | null>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showExpiryDate, setShowExpiryDate] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('institute');
    const institute = stored ? JSON.parse(stored) : null;
    if (institute?.id) {
      setInstituteId(institute.id);
      fetchBranches(institute.id);
      fetchExams(institute.id);
    }
  }, []);

  const fetchBranches = async (id: number) => {
    try {
      const res = await API.get(`/auth/institute/branches?instituteId=${id}`);
      setBranches(res.data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const fetchExams = async (instituteIdOverride?: number) => {
    try {
      const res = await API.get('/auth/institute/search-exam', {
        params: {
          search,
          branch: branchFilter,
          date: dateFilter,
          sortField,
          sortOrder,
          instituteId: instituteIdOverride || instituteId,
        },
      });
      setExams(res.data);
    } catch (err) {
      console.error('Error fetching exams:', err);
    }
  };

  const openEditDrawer = async (exam: Exam) => {
    setEditExamId(exam.id);
    setReadOnlyView(false);
    try {
      const res = await API.get(`/auth/institute/viewexam/${exam.id}`);
      populateForm(res.data);
      setShowDrawer(true);
    } catch (err) {
      console.error('Failed to load exam:', err);
    }
  };

  const openViewDrawer = async (exam: Exam) => {
    setEditExamId(exam.id);
    setReadOnlyView(true);
    try {
      const res = await API.get(`/auth/institute/exams/${exam.id}`);
      populateForm(res.data);
      setShowDrawer(true);
    } catch (err) {
      console.error('Failed to load exam:', err);
    }
  };

  const populateForm = (exam: Exam) => {
    setTitle(exam.title);
    setScheduledDate(exam.created_at);
    setExpiryDate(exam.expires_at || '');
    setDescription(exam.description || '');
    setDurationMin(exam.duration_min);
    setPassPercentage(exam.pass_percentage);
    setRestrictAccess(!!exam.restrict_access);
    setEnableTimeLimit(!!exam.time_limit_enabled);
    setQuestions(exam.questions || []);
    setQuestionMode('manual');
  };

  const resetForm = () => {
    setTitle('');
    setScheduledDate('');
    setExpiryDate('');
    setDescription('');
    setDurationMin(0);
    setPassPercentage(0);
    setRestrictAccess(false);
    setEnableTimeLimit(false);
    setExpiryDate('');
    setQuestions([]);
    setQuestionMode(null);
    setFormError('');
  };

  const toggleExamStatus = async (examId: string, currentStatus: boolean) => {
    try {
      await API.put(`/auth/institute/exams/${examId}/enable`, {
        is_enabled: !currentStatus,
      });
      fetchExams();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const toggleResultLock = async (examId: string, currentLock: boolean) => {
    try {
      await API.put(`/auth/institute/exams/${examId}/lock-result`, {
        result_locked: !currentLock,
      });
      fetchExams();
    } catch (err) {
      console.error('Failed to toggle result lock:', err);
    }
  };
  const openCreateDrawer = () => {
    resetForm();
    setEditExamId(null);
    setReadOnlyView(false);
    setShowDrawer(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">🛠️ Exam Settings</h2>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          onClick={() => {
            setShowDrawer(true);
            setEditExamId(null);
            setReadOnlyView(false);
          }}
        >
          + Create Exam
        </Button>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md mb-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Input placeholder="Search by title" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
          <option value="">All Branches</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.name}>{branch.name}</option>
          ))}
        </Select>
        <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        <div className="flex gap-2">
          <Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="scheduled_date">Scheduled Date</option>
            <option value="title">Title</option>
          </Select>
          <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => fetchExams()}>🔍 Search</Button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Expiry</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Result</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length > 0 ? exams.map((exam) => (
              <tr key={exam.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{exam.title}</td>
                <td className="px-4 py-2">{formatDate(exam.created_at)}</td>
                <td className="px-4 py-2">{exam.expires_at ? formatDate(exam.expires_at) : 'NA'}</td>
                <td className="px-4 py-2">
                  <button onClick={() => toggleExamStatus(exam.id, exam.is_enabled)} className={`px-2 py-1 rounded-md text-white ${exam.is_enabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>{exam.is_enabled ? 'Disable' : 'Enable'}</button>
                </td>
                <td className="px-4 py-2">
                  <button onClick={() => toggleResultLock(exam.id, exam.result_locked)} className={`px-2 py-1 rounded-md text-white ${exam.result_locked ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>{exam.result_locked ? 'Unlock' : 'Lock'}</button>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Button onClick={() => openEditDrawer(exam)} className="bg-blue-500 hover:bg-blue-600 text-white text-xs">Edit</Button>
                  <Button onClick={() => openViewDrawer(exam)} className="bg-gray-500 hover:bg-gray-600 text-white text-xs">View</Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-6">❗ No exams match the current filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDrawer && (
        <CreateExamDrawer
          isOpen={showDrawer}
          onClose={() => { setShowDrawer(false); setReadOnlyView(false); }}
          title={title}
          setTitle={setTitle}
          scheduledDate={scheduledDate}
          setScheduledDate={setScheduledDate}
          expiryDate={expiryDate}
          setExpiryDate={setExpiryDate}
          showExpiryDate={showExpiryDate}
          setShowExpiryDate={setShowExpiryDate}
          description={description}
          setDescription={setDescription}
          durationMin={durationMin}
          setDurationMin={setDurationMin}
          passPercentage={passPercentage}
          setPassPercentage={setPassPercentage}
          restrictAccess={restrictAccess}
          setRestrictAccess={setRestrictAccess}
          enableTimeLimit={enableTimeLimit}
          setEnableTimeLimit={setEnableTimeLimit}
          questionMode={questionMode}
          setQuestionMode={setQuestionMode}
          questions={questions}
          setQuestions={setQuestions}
          addQuestion={() => setQuestions([...questions, { type: 'multiplechoice', text: '', options: ['', ''], correctAnswer: '', marks: 1 }])}
          updateQuestion={(index, q) => {
            const updated = [...questions];
            updated[index] = q;
            setQuestions(updated);
          }}
          handleDeleteOption={(index, optIdx) => {
            const updated = [...questions];
            updated[index].options?.splice(optIdx, 1);
            setQuestions(updated);
          }}
          handleAddOption={(index) => {
            const updated = [...questions];
            updated[index].options = [...(updated[index].options || []), ''];
            setQuestions(updated);
          }}
          handleSubmit={async () => { }}
          submitting={submitting}
          formError={formError}
          readOnly={readOnlyView}
        />
      )}
    </div>
  );
};

export default ExamSettingsPage;
