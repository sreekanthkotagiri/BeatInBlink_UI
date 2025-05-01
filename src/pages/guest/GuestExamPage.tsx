import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Button, Input, Textarea } from '../../components/ui/input';
import { isValidType } from '../../utils/utils';
import GuestHeader from './GuestHeader';
import { ExamsWithQuestion } from '../../types/exam';

const GuestExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<ExamsWithQuestion>();
  const [answers, setAnswers] = useState<any>({});
  const [studentName, setStudentName] = useState<string>('');
  const [loadingExam, setLoadingExam] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    totalScore: number;
    totalMarks: number;
    scorePercentage: number;
  } | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const beepSound = new Audio('/beep.mp3');

  useEffect(() => {
    const storedName = localStorage.getItem('studentName');
    if (!storedName) {
      setShowNameModal(true);
    } else {
      setStudentName(storedName);
      if (examId) fetchExam(examId);
    }
  }, [examId]);

  const fetchExam = async (id: string) => {
    try {
      const response = await API.get(`/auth/guest/getExam/${id}`);
      setExam(response.data.exam);
    } catch (error) {
      console.error('Error fetching exam:', error);
      setErrorMessage('Failed to load exam.');
      setShowErrorModal(true);
    } finally {
      setLoadingExam(false);
    }
  };

  useEffect(() => {
    if (exam?.enable_time_limit && exam?.duration_min && exam.duration_min > 0) {
      const totalTime = exam.duration_min * 60;
      setRemainingTime(totalTime);
    }
  }, [exam]);

  useEffect(() => {
    if (exam?.enable_time_limit) {
      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      document.addEventListener('contextmenu', handleContextMenu);
      return () => document.removeEventListener('contextmenu', handleContextMenu);
    }
  }, [exam?.enable_time_limit]);

  useEffect(() => {
    if (exam?.restrict_access) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setErrorMessage('Window switching is not allowed during this exam.');
          setShowErrorModal(true);
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [exam?.restrict_access]);

  useEffect(() => {
    if (!exam?.enable_time_limit || remainingTime <= 0 || submitted) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        if (prev === 60) {
          beepSound.play().catch((e) => console.warn('Beep failed:', e));
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam?.enable_time_limit, remainingTime, submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      localStorage.setItem('studentName', tempName.trim());
      setStudentName(tempName.trim());
      setShowNameModal(false);
      if (examId) fetchExam(examId);
    } else {
      setErrorMessage('Name is required to take the exam!');
      setShowErrorModal(true);
    }
  };

  const handleAnswerChange = (questionId: string, value: string, type: string, checked?: boolean) => {
    if (type === 'multiplechoice') {
      const selected = answers[questionId]?.split(' and ').filter((opt: string) => opt.trim()) || [];
      const updatedSelected = checked
        ? Array.from(new Set([...selected, value]))
        : selected.filter((opt: string) => opt !== value);

      setAnswers({
        ...answers,
        [questionId]: updatedSelected.join(' and '),
      });
    } else {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  const handleSubmit = async () => {
    if (!studentName) {
      setErrorMessage('Student name missing.');
      setShowErrorModal(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await API.post('/auth/guest/submitExam', {
        examId,
        studentName,
        answers,
      });
      setResult(res.data);
      setSubmitted(true);
      setShowModal(true);
      localStorage.removeItem('studentName');
    } catch (error) {
      console.error('Error submitting exam:', error);
      setErrorMessage('Failed to submit answers.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <GuestHeader guestName={studentName} />

      <div className="max-w-4xl mx-auto px-4">
        {!showNameModal && !loadingExam && exam?.enable_time_limit && exam?.duration_min && exam.duration_min > 0 && (
          <div className="sticky top-[96px] z-10 bg-white pt-4 pb-4 text-right">
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full transition-all duration-1000 ${remainingTime <= 60 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${(remainingTime / (exam.duration_min * 60)) * 100}%` }}
              ></div>
            </div>
            <span className="inline-block bg-blue-100 text-blue-700 px-6 py-2 rounded-full shadow-lg">
              ⏱ Time Left: {formatTime(remainingTime)}
            </span>
          </div>
        )}

        {showNameModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-2xl text-center max-w-md w-full">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Welcome to BeatInBlink!</h2>
              <p className="text-gray-600 mb-4">Please enter your name to begin the exam</p>
              <Input
                type="text"
                placeholder="Your name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="mb-4"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 w-full" onClick={handleNameSubmit}>
                Start Exam
              </Button>
            </div>
          </div>
        )}

        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl text-center max-w-md w-full shadow-xl">
              <h2 className="text-xl font-bold text-red-600 mb-4">❌ Error</h2>
              <p className="text-gray-700 mb-4">{errorMessage}</p>
              <Button className="bg-red-500 hover:bg-red-600 w-full" onClick={() => setShowErrorModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}

        {!showNameModal && loadingExam && <div className="p-8 text-center text-gray-600">Loading Exam...</div>}

        {!showNameModal && !loadingExam && !exam && (
          <div className="p-8 text-center text-gray-600">Exam not found.</div>
        )}

        {!showNameModal && !loadingExam && exam && (
          <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-blue-800">{exam.title}</h1>

            <p className="text-sm text-gray-500 italic mb-6">
              📌 Please contact your institute to download the question paper or access more exams.
            </p>

            {exam.questions.map((question: any, index: number) => (
              <div key={question.id} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{index + 1}. {question.text}</h3>
                {isValidType(question.type) === 'multiplechoice' || isValidType(question.type) === 'radiobutton' ? (
                  question.options.map((option: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <input
                        type={isValidType(question.type) === 'multiplechoice' ? 'checkbox' : 'radio'}
                        name={question.id}
                        value={option}
                        checked={
                          isValidType(question.type) === 'multiplechoice'
                            ? answers[question.id]?.split(' and ').includes(option)
                            : answers[question.id] === option
                        }
                        onChange={(e) =>
                          handleAnswerChange(question.id, option, question.type, e.target.checked)
                        }
                      />
                      <label>{option}</label>
                    </div>
                  ))
                ) : isValidType(question.type) === 'shortanswer' ? (
                  <Textarea
                    placeholder="Your answer"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value, question.type)}
                  />
                ) : (
                  <select
                    className="border p-2 rounded w-full"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value, question.type)}
                  >
                    <option value="">Select</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                )}
              </div>
            ))}

            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Submitting...
                </div>
              ) : (
                'Submit Exam'
              )}
            </Button>
          </div>
        )}

        {showModal && result && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-2xl text-center max-w-md w-full">
              <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Exam Submitted Successfully!</h2>
              <p className="text-lg mb-2">Total Score: <strong>{result.totalScore}</strong></p>
              <p className="text-lg mb-2">Total Marks: <strong>{result.totalMarks}</strong></p>
              <p className="text-lg mb-4">Score Percentage: <strong>{result.scorePercentage.toFixed(2)}%</strong></p>
              <p className="text-sm text-gray-500 italic mb-4">📌 Please contact your institute for paper download or access to additional question papers.</p>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full mt-4" onClick={() => navigate('/')}>Go to Home</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestExamPage;