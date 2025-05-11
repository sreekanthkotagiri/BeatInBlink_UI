// src/pages/admin/ExamSettingsTab.tsx
import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Question } from '../../types/exam';
import CreateExamDrawer from '../guest/CreateExamDrawer';
import { useLocation, useNavigate } from 'react-router-dom';

interface Exam {
  id: number;
  title: string;
  scheduled_date: string;
  expiry_date?: string;
  duration_min: number;
  pass_percentage: number;
  description: string;
  status: 'enabled' | 'disabled';
  restrict_access?: boolean;
  time_limit_enabled?: boolean;
  questions?: Question[];
}

const ExamSettingsTab: React.FC = () => {

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const [exams, setExams] = useState<Exam[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [readOnlyView, setReadOnlyView] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [editExamId, setEditExamId] = useState<number | null>(null);

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
  const [instituteId, setInstituteId] = useState<number>();
  const [hasOpenedDrawer, setHasOpenedDrawer] = useState(false);


  useEffect(() => {
    const storedInstitute = localStorage.getItem('institute');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
    if (!institute || !institute.id) {
      console.error('No institute ID found');
      return;
    }
    setInstituteId(institute.id);
  }, []);

  useEffect(() => {
    if (instituteId) {
      fetchExams();
    }
  }, [instituteId]);

  const fetchExams = async () => {
    try {
      const res = await API.get(`/auth/institute/exams?instituteId=${instituteId}`);
      setExams(res.data);
    } catch (err) {
      console.error('Failed to load exams:', err);
    }
  };

  const toggleStatus = async (examId: number, currentStatus: 'enabled' | 'disabled') => {
    try {
      await API.post('/auth/institute/toggle-exam-status', {
        examId,
        status: currentStatus === 'enabled' ? 'disabled' : 'enabled',
      });
      fetchExams();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const openCreateDrawer = () => {
    resetForm();
    setEditExamId(null);
    setReadOnlyView(false);
    setShowDrawer(true);
  };

  const openEditDrawer = async (exam: Exam) => {
    setEditExamId(exam.id);
    setReadOnlyView(false);
    try {
      const res = await API.get(`/auth/institute/viewexam/${exam.id}`);
      populateForm(res.data);
      setShowDrawer(true);
    } catch (err) {
      console.error('Failed to load exam with questions:', err);
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
      console.error('Failed to load exam with questions:', err);
    }
  };

  const populateForm = (exam: Exam) => {
    setTitle(exam.title);
    setScheduledDate(exam.scheduled_date);
    setExpiryDate(exam.expiry_date || '');
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

  const handleSubmit = async () => {
    if (!title || !scheduledDate || passPercentage <= 0 || (enableTimeLimit && durationMin <= 0)) {
      setFormError('Please fill all required fields correctly.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        scheduled_date: scheduledDate,
        expiry_date: expiryDate,
        description,
        duration_min: durationMin,
        pass_percentage: passPercentage,
        restrict_access: restrictAccess,
        time_limit_enabled: enableTimeLimit,
        questions,
      };
      if (editExamId) {
        await API.put(`/auth/institute/exams/${editExamId}`, payload);
      } else {
        await API.post(`/auth/institute/createExam?instituteId=${instituteId}`, payload);
        alert('Exam created successfully!');
      }

      fetchExams();
      setShowDrawer(false);
      resetForm();
    } catch (err) {
      console.error('Submit failed:', err);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOption = (index: number, optionIndex: number) => {
    const updated = [...questions];
    updated[index].options?.splice(optionIndex, 1);
    setQuestions(updated);
  };

  const handleAddOption = (index: number) => {
    const updated = [...questions];
    updated[index].options = [...(updated[index].options || []), ''];
    setQuestions(updated);
  };

  const updateQuestion = (index: number, updatedQ: Question) => {
    const updated = [...questions];
    updated[index] = updatedQ;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: 'multiplechoice',
        text: '',
        options: ['', ''],
        correctAnswer: '',
        marks: 1,
      },
    ]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-800">Manage Exams</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={openCreateDrawer}
        >
          + Create Exam
        </button>
      </div>

      {showDrawer && (
        <CreateExamDrawer
          isOpen={showDrawer}
          onClose={() => {
            setShowDrawer(false);
            setReadOnlyView(false);
          }}
          title={title}
          setTitle={setTitle}
          scheduledDate={scheduledDate}
          setScheduledDate={setScheduledDate}
          expiryDate={expiryDate}
          setExpiryDate={setExpiryDate}
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
          addQuestion={addQuestion}
          updateQuestion={updateQuestion}
          handleDeleteOption={handleDeleteOption}
          handleAddOption={handleAddOption}
          handleSubmit={handleSubmit}
          submitting={submitting}
          formError={formError}
          readOnly={readOnlyView}
        />
      )}

      <div className="overflow-auto rounded shadow">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Scheduled Date</th>
              <th className="border px-4 py-2">Duration</th>
              <th className="border px-4 py-2">Pass %</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.length > 0 ? (
              exams.map((exam) => (
                <tr key={exam.id} className="even:bg-white odd:bg-gray-50">
                  <td className="border px-4 py-2">{exam.id}</td>
                  <td className="border px-4 py-2">{exam.title}</td>
                  <td className="border px-4 py-2">{exam.scheduled_date}</td>
                  <td className="border px-4 py-2">{exam.duration_min} min</td>
                  <td className="border px-4 py-2">{exam.pass_percentage}%</td>
                  <td className="border px-4 py-2 font-semibold text-green-700">{exam.status}</td>
                  <td className="border px-4 py-2">
                    <button className="text-blue-600 hover:underline mr-3" onClick={() => openEditDrawer(exam)}>
                      Edit
                    </button>
                    <button className="text-gray-700 hover:underline mr-3" onClick={() => openViewDrawer(exam)}>
                      View
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => toggleStatus(exam.id, exam.status)}
                    >
                      {exam.status === 'enabled' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No exams available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamSettingsTab;
