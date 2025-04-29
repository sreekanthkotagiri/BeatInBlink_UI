import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Button, Input, Textarea } from '../components/ui/input';
import { X } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  type: string;
  options: string[];
  correctAnswer: string;
  marks: number;
}

interface GuestTakeExamDrawerProps {
  examId: number;
  onClose: () => void;
}

const GuestTakeExamDrawer: React.FC<GuestTakeExamDrawerProps> = ({ examId, onClose }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [examTitle, setExamTitle] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; status: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await API.get(`/auth/guest/exam/${examId}`);
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
    try {
      const res = await API.post('/auth/guest/submit-exam', {
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
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
      <div className="absolute right-0 top-0 w-full max-w-3xl bg-white h-full shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{examTitle}</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        {!submitted && (
          <div className="text-lg text-red-600 font-medium mb-4 text-right">
            Time Left: {formatTime(timeLeft)}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-gray-50 border rounded p-4">
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
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Your answer"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  disabled={submitted}
                />
              )}
            </div>
          ))}

          {!submitted && (
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Submit Exam
            </Button>
          )}
        </form>

        {submitted && result && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded shadow text-lg text-center">
            <p className="font-semibold text-green-700 mb-2">✅ Demo exam submitted!</p>
            <p>Your Score: <strong>{result.score}</strong></p>
            <p>Status: <strong className={result.status === 'Pass' ? 'text-green-700' : 'text-red-600'}>{result.status}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestTakeExamDrawer;
