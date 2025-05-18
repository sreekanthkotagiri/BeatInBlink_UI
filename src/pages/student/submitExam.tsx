import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Sidebar from '../../components/ui/Sidebar';

interface Question {
  id: number;
  text: string;
  type: string;
  options: string[];
  correctAnswer: string;
  marks: number;
}

const StudentTakeExamPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [examTitle, setExamTitle] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; status: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await API.get(`/auth/student/exams/${examId}`);
        setQuestions(res.data.questions);
        setExamTitle(res.data.title);
        setTimeLeft(res.data.duration_min * 60);
      } catch (err) {
        console.error('Failed to load exam:', err);
        alert('Failed to load exam.');
      }
    };
    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (!timeLeft || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          handleSubmit();
          clearInterval(timer);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    if (!student?.id) {
      alert('Student not logged in');
      return;
    }

    try {
      const res = await API.post('/auth/student/submitExam', {
        studentId: student.id,
        examId,
        answers,
      });
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to submit exam.');
    }
  };

  return (
    <div className="institute-home">
      <div className="dashboard-container">
        <Sidebar enabledTabs={['studenthome', 'studentexams', 'studentresults', 'studentprofile', 'student-announcements']} />
        <main className="main-content p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">{examTitle}</h2>
            {!submitted && (
              <span className="text-lg font-medium text-red-600 bg-white border border-red-300 px-3 py-1 rounded shadow-sm">
                ⏳ Time Left: {formatTime(timeLeft)}
              </span>
            )}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="bg-white p-4 rounded shadow border">
                <p className="font-medium mb-2">{q.text}</p>

                {['multiplechoice', 'radiobutton'].includes(q.type.toLowerCase().replaceAll(' ', '')) ? (
                  q.options.map((opt, i) => (
                    <label key={i} className="block mb-1">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleChange(q.id, opt)}
                        disabled={submitted}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))
                ) : ['truefalse', 'trueorfalse'].includes(q.type.toLowerCase().replaceAll(' ', '')) ? (
                  ['True', 'False'].map((opt, i) => (
                    <label key={i} className="block mb-1">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleChange(q.id, opt)}
                        disabled={submitted}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))
                ) : (
                  <input
                    type="text"
                    className="border px-3 py-2 mt-1 rounded w-full"
                    placeholder="Your answer"
                    value={answers[q.id] || ''}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    disabled={submitted}
                  />
                )}
              </div>
            ))}

            {!submitted && (
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Submit Exam
                </button>
              </div>
            )}
          </form>

          {submitted && result && (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded shadow text-lg text-center">
              <p className="font-semibold text-green-700 mb-2">✅ Exam submitted successfully!</p>
              <p>Your Score: <strong>{result.score}</strong></p>
              <p>Status: <strong className={result.status === 'Pass' ? 'text-green-700' : 'text-red-600'}>{result.status}</strong></p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentTakeExamPage;