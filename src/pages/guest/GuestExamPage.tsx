import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Button, Input, Textarea } from '../../components/ui/input';
import { isValidType } from '../../utils/utils';

const GuestExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [studentName, setStudentName] = useState<string>('');
  const [loadingExam, setLoadingExam] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [result, setResult] = useState<{ totalScore: number; totalMarks: number; scorePercentage: number } | null>(null);

  const closeModal = () => {
    setShowModal(false);
    navigate('/'); // Optional: Redirect home after closing modal
  };

  useEffect(() => {
    const storedName = localStorage.getItem('studentName');
    if (!storedName) {
      const name = prompt('Please enter your name to start the exam:');
      if (name) {
        localStorage.setItem('studentName', name.trim());
        setStudentName(name.trim());
      } else {
        alert('Name is required to take the exam!');
        navigate('/');
      }
    } else {
      setStudentName(storedName);
    }

    if (examId) {
      fetchExam(examId);
    }
  }, [navigate, examId]);

  const fetchExam = async (id: string) => {
    try {
      const response = await API.get(`/auth/guest/getExam/${id}`);
      setExam(response.data.exam);
    } catch (error) {
      console.error('Error fetching exam:', error);
      alert('Failed to load exam.');
      navigate('/');
    } finally {
      setLoadingExam(false);
    }
  };

  // Corrected handleAnswerChange
  const handleAnswerChange = (questionId: string, value: string, type: string, checked?: boolean) => {
    if (type === 'multiplechoice') {
      const selected = answers[questionId]
        ? answers[questionId].split(' and ').filter((opt: string) => opt.trim() !== '')
        : [];

      let updatedSelected = [...selected];

      if (checked) {
        if (!updatedSelected.includes(value)) {
          updatedSelected.push(value);
        }
      } else {
        updatedSelected = updatedSelected.filter((opt) => opt !== value);
      }

      const cleanedAnswer = updatedSelected.filter((opt: string) => opt.trim() !== '').join(' and ');

      setAnswers({
        ...answers,
        [questionId]: cleanedAnswer,
      });
    } else {
      setAnswers({
        ...answers,
        [questionId]: value,
      });
    }
  };

  const handleSubmit = async () => {
    if (!studentName) {
      alert('Student name missing.');
      return;
    }

    try {
      const res = await API.post('/auth/guest/submitExam', {
        examId,
        studentName,
        answers,
      });
      setResult(res.data);
      setSubmitted(true);
      setShowModal(true); // Show popup
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit answers.');
    }
  };

  if (loadingExam) {
    return <div className="p-8">Loading Exam...</div>;
  }

  if (!exam) {
    return <div className="p-8">Exam not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Elegant Header */}
      <header className="bg-blue-800 text-white py-6 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-yellow-400">BeatInBlink</span>
            </h1>
            <p className="text-sm font-light italic text-blue-100">
              Faster, Smarter, In a blink
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <span className="text-sm font-semibold">{studentName}</span>
          </div>
        </div>
      </header>

      {/* Exam Content */}
      <div className="p-8 max-w-4xl mx-auto bg-gray-50 min-h-[calc(100vh-6rem)]">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-800">{exam.title}</h1>

          {exam.questions.map((question: any, index: number) => (
            <div key={question.id} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{index + 1}. {question.text}</h3>

              {/* Handle MCQ or Radio */}
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
                        handleAnswerChange(
                          question.id,
                          option,
                          question.type,
                          e.target.checked
                        )
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

          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
            Submit Exam
          </Button>
          {showModal && result && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
                <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Exam Submitted Successfully!</h2>
                <p className="text-lg mb-2">Total Score: <strong>{result.totalScore}</strong></p>
                <p className="text-lg mb-2">Total Marks: <strong>{result.totalMarks}</strong></p>
                <p className="text-lg mb-4">Score Percentage: <strong>{result.scorePercentage.toFixed(2)}%</strong></p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 w-full mt-4"
                  onClick={closeModal}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestExamPage;
