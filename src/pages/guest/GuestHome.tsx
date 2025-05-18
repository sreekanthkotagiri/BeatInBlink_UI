import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/input';
import API from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import GuestHeader from './GuestHeader';
import CreateExamDrawer from '../admin/CreateExamDrawer';

const GuestHome: React.FC = () => {
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState('');
  const [guestCode, setGuestCode] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [exams, setExams] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [durationMin, setDurationMin] = useState<number>(60);
  const [passPercentage, setPassPercentage] = useState<number>(35);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionMode, setQuestionMode] = useState<'manual' | 'upload' | null>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [enableTimeLimit, setEnableTimeLimit] = useState(false);
  const [restrictAccess, setRestrictAccess] = useState(false);
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [latestExamLink, setLatestExamLink] = useState<string | null>(null);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [downloadable, setDownloadable] = useState(true);


  useEffect(() => {
    // Set default date to tomorrow at 10am
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const isoString = tomorrow.toISOString().slice(0, 16);
    setScheduledDate(isoString);
    const storedGuestName = localStorage.getItem('guestName');
    const storedGuestCode = localStorage.getItem('guestCode');
    if (!storedGuestName || !storedGuestCode) {
      navigate('/');
    } else {
      setGuestName(storedGuestName);
      setGuestCode(storedGuestCode);
      fetchGuestExams(storedGuestCode);
      fetchStudentResults(storedGuestCode);
    }
  }, [navigate]);

  const fetchGuestExams = async (code: string) => {
    try {
      const res = await API.get(`/auth/guest/getAllExam?guestId=${code}`);
      if (res.data?.exams) setExams(res.data.exams);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExams(false);
    }
  };

  const fetchStudentResults = async (code: string) => {
    try {
      const res = await API.get(`/auth/guest/getAllResults?guestCode=${code}`);
      if (res.data?.results) setStudentResults(res.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('guestName');
    localStorage.removeItem('guestCode');
    navigate('/');
  };

  const addQuestion = () => {
    setQuestions([...questions, { type: 'multiplechoice', text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 }]);
  };

  const updateQuestion = (index: number, updated: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updated;
    setQuestions(updatedQuestions);
  };

  const handleDeleteOption = (qIdx: number, optIdx: number) => {
    const updated = [...questions];
    updated[qIdx].options.splice(optIdx, 1);
    setQuestions(updated);
  };

  const handleAddOption = (qIdx: number) => {
    const updated = [...questions];
    updated[qIdx].options.push('');
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    if (!title || !scheduledDate || passPercentage <= 0 || questions.length === 0) {
      setFormError('Please fill all exam details correctly and add at least one question.');
      setSubmitting(false);
      return;
    }
    if (enableTimeLimit && durationMin <= 0) {
      setFormError('Please enter a valid duration since time limit is enabled.');
      return;
    }

    const payload = {
      guestId: guestCode,
      title,
      description,
      scheduled_date: scheduledDate,
      duration_min: durationMin,
      pass_percentage: passPercentage,
      created_by: guestCode,
      questions: questions.map((q) => ({
        question: q.text,
        type: q.type,
        choices: q.options || [],
        correctAnswer: q.correctAnswer,
        marks: q.marks || 1,
      })),
      enableTimeLimit,
      restrictAccess,
      downloadable,
    };

    try {
      const res = await API.post('/auth/guest/createExam', payload);
      if (res.data?.examId) {
        setLatestExamLink(`${window.location.origin}/guest-exam/${res.data.examId}`);
        setShowLinkPopup(true);
        setTimeout(() => {
          setShowDrawer(false);
          resetForm();
          fetchGuestExams(guestCode);
        }, 500);
        setFormError('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('Testing');
    setDescription('Testing');
    setDurationMin(60);
    setPassPercentage(35);
    setQuestions([]);
    setEnableTimeLimit(false);
    setRestrictAccess(false);
  };

  return (
    <>
      <GuestHeader guestName={guestName} onLogout={handleLogout} />
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
          <h2 className="text-3xl font-bold text-blue-800">Welcome, {guestName}!</h2>
          <p className="text-gray-600">Create your own exams easily and share them!</p>
          <div className="text-sm text-red-600 font-medium">⚠️ If you logout, your exams and results will be lost permanently.</div>
          <div className="text-sm text-blue-600 font-medium">🔒 Guest users have limited access. Create a full account for more features!</div>
          <Button className="bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-semibold px-6 py-3 rounded shadow-md mt-4" onClick={() => setShowDrawer(true)}>
            Create Exam
          </Button>
        </div>

        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow mb-6">
          Exams will automatically expire after 24 hours. Share links quickly with your students!
        </div>

        <div className="bg-gray-50 rounded-2xl shadow-md p-6">
          <h3 className="text-2xl font-bold mb-4 text-blue-700">Your Created Exams</h3>
          {loadingExams ? (<Spinner />) : exams.length > 0 ? (
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border">Title</th>
                  <th className="py-2 px-4 border">Scheduled Date</th>
                  <th className="py-2 px-4 border">Duration</th>
                  <th className="py-2 px-4 border">Pass %</th>
                  <th className="py-2 px-4 border">Link</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-100 transition text-center">
                    <td className="py-2 px-4 border">{exam.title}</td>
                    <td className="py-2 px-4 border">{new Date(exam.scheduled_date).toLocaleString()}</td>
                    <td className="py-2 px-4 border">
                      {exam.duration_min != null ? `${exam.duration_min} min` : 'NA'}
                    </td>
                    <td className="py-2 px-4 border">{exam.pass_percentage}%</td>
                    <td className="py-2 px-4 border">
                      {exam.exam_link ? (
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1" onClick={() => navigator.clipboard.writeText(exam.exam_link || '')}>
                          Copy Link
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-xs">No Link</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-4">No exams created yet.</p>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl shadow-md p-6">
          <h3 className="text-2xl font-bold mb-4 text-green-700">Student Submissions</h3>
          {loadingResults ? (<Spinner />) : studentResults.length > 0 ? (
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border">Student Name</th>
                  <th className="py-2 px-4 border">Exam Title</th>
                  <th className="py-2 px-4 border">Score</th>
                  <th className="py-2 px-4 border">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {studentResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-100 transition text-center">
                    <td className="py-2 px-4 border">{result.student_name}</td>
                    <td className="py-2 px-4 border">{result.exam_title}</td>
                    <td className="py-2 px-4 border">{result.score}/{result.total_marks}</td>
                    <td className="py-2 px-4 border">{new Date(result.submitted_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-4">No submissions yet.</p>
          )}
        </div>
      </div>

      <CreateExamDrawer
        isOpen={showDrawer}
        onClose={() => { setShowDrawer(false); resetForm() }}
        title={title}
        setTitle={setTitle}
        scheduledDate={scheduledDate}
        setScheduledDate={setScheduledDate}

        description={description}
        setDescription={setDescription}
        durationMin={durationMin}
        setDurationMin={setDurationMin}
        passPercentage={passPercentage}
        setPassPercentage={setPassPercentage}
        questions={questions}
        setQuestions={setQuestions}
        questionMode={questionMode}
        setQuestionMode={setQuestionMode}
        handleSubmit={handleSubmit}
        submitting={submitting}
        formError={formError}
        addQuestion={addQuestion}
        updateQuestion={updateQuestion}
        handleDeleteOption={handleDeleteOption}
        handleAddOption={handleAddOption}
        enableTimeLimit={enableTimeLimit}
        setEnableTimeLimit={setEnableTimeLimit}
        restrictAccess={restrictAccess}
        setRestrictAccess={setRestrictAccess}
        sendTimeLimitToApi={enableTimeLimit}
        sendCursorLockToApi={restrictAccess}
        downloadable={downloadable}
        setDownloadable={setDownloadable}
      />
    </>
  );
};

export default GuestHome;