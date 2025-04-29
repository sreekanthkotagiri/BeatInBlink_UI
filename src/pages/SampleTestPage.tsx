import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

interface Question {
  id: number;
  text: string;
  type: string;
  options?: string[];
  correctAnswer?: string;
}

const SampleTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchSampleQuestions = async () => {
      try {
        const res = await API.get('/sample/questions');
        setQuestions(res.data);
      } catch (err) {
        console.error('Failed to load sample questions:', err);
      }
    };

    fetchSampleQuestions();
  }, []);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    let total = 0;
    questions.forEach((q) => {
      if (answers[q.id]?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()) {
        total++;
      }
    });
    setScore(total);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white py-10 px-6 md:px-24">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Sample Test</h1>

      {questions.map((q) => (
        <div key={q.id} className="mb-6">
          <p className="font-medium text-gray-700 mb-2">{q.text}</p>
          {q.options ? (
            q.options.map((opt, idx) => (
              <label key={idx} className="block mb-1">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={opt}
                  disabled={submitted}
                  checked={answers[q.id] === opt}
                  onChange={() => handleAnswerChange(q.id, opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))
          ) : (
            <input
              type="text"
              value={answers[q.id] || ''}
              disabled={submitted}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              className="w-full border p-2 rounded"
            />
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      ) : (
        <div className="mt-8 text-center">
          <p className="text-lg font-semibold text-green-700">
            ✅ Your Score: {score} / {questions.length}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default SampleTestPage;
