import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';

type QuestionType = 'multipleChoice' | 'trueFalse' | 'shortAnswer' | 'radioButton';

interface Question {
  text: string;
  questionText?: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  marks: number;
}

const EditExamPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { examId } = useParams();
  const [instituteName, setInstituteName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [durationMin, setDurationMin] = useState<number>(60);
  const [passPercentage, setPassPercentage] = useState<number>(50);
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: '',
      type: 'multipleChoice',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1,
    },
  ]);

  useEffect(() => {
    const storedInstitute = localStorage.getItem('institute');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
    if (!institute || !institute.id) {
      console.error('No institute ID found');
      return;
    }
    setInstituteName(institute.name);
  }, []);

  useEffect(() => {
    if (examId) {
      fetchExamDetails(examId);
    }
  }, [examId]);

  const fetchExamDetails = async (examId: string) => {
    try {
      const response = await API.get(`/auth/editexam/${examId}`);
      const exam = response.data;

      const formattedQuestions = exam.questions.map((q: any): Question => ({
        ...q,
        text: q.text || q.questionText || '',
        type: mapToInternalType(q.type),
        options: q.options ?? ['', '', '', ''],
      }));

      setTitle(exam.title);
      setDescription(exam.description);
      setScheduledDate(exam.scheduled_date);
      setDurationMin(exam.duration_min);
      setPassPercentage(exam.pass_percentage);
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching exam details:', error);
      alert('Failed to fetch exam details.');
    }
  };

  const mapToInternalType = (type: string): QuestionType => {
    const map: Record<string, QuestionType> = {
      'multipleChoice': 'multipleChoice',
      'multiple choice': 'multipleChoice',
      'trueFalse': 'trueFalse',
      'true or false': 'trueFalse',
      'shortAnswer': 'shortAnswer',
      'short answer': 'shortAnswer',
      'radioButton': 'radioButton',
      'radio button': 'radioButton',
    };
    return map[type.trim()] || 'multipleChoice';
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    if (!updated[qIndex].options) {
      updated[qIndex].options = [];
    }
    updated[qIndex].options![oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'multipleChoice',
        options: ['', '', '', ''],
        correctAnswer: '',
        marks: 1,
      },
    ]);
  };

  const addOption = (index: number) => {
    const updated = [...questions];
    const question = updated[index];
    if (!question.options) question.options = [];
    question.options.push('');
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    const institute = localStorage.getItem('institute');
    if (!institute) {
      alert('No institute logged in!');
      return;
    }

    const { id: instituteId } = JSON.parse(institute);

    try {
      const examData = {
        title,
        description,
        scheduled_date: scheduledDate,
        duration_min: durationMin,
        pass_percentage: passPercentage,
        created_by: instituteId,
        questions,
      };

      if (examId) {
        await API.post(`/auth/exams/${examId}`, examData);
        alert('Exam updated successfully!');
      } else {
        await API.post('/exams', examData);
        alert('Exam created successfully!');
      }
      navigate('/institute');
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('institute');
    logout();
    navigate('/login');
  };

  return (
    <div>
      <header className="institute-header">
        <div className="logo">EduExamine</div>
        <div className="user-info">
          Welcome, {instituteName}
          <button onClick={handleLogout} className="ml-4 px-3 py-1 bg-red-600 text-white rounded-xl hover:bg-red-700">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className="sidebar">
          <ul>
            <li><a href="#">Dashboard</a></li>
            <li><Link to="/institute">Home</Link></li>
            <li><Link to="/admin/results">Results</Link></li>
          </ul>
        </aside>

        <main className="main-content">
          <h2>{examId ? 'Edit Exam' : 'Create Exam'}</h2>

          <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{examId ? 'Edit Exam' : 'Create Exam'}</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Exam Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <h4 className="text-xl font-semibold mt-6">Scheduled Date</h4>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <h4 className="text-xl font-semibold mt-6">Duration (minutes)</h4>
              <input
                type="number"
                placeholder="Duration"
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
              <h4 className="text-xl font-semibold mt-6">Pass Percentage</h4>
              <input
                type="number"
                placeholder="Pass Percentage"
                value={passPercentage}
                onChange={(e) => setPassPercentage(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />

              <h3 className="text-xl font-semibold mt-6">Questions</h3>
              {questions.map((question, index: number) => (
                <div key={index} className="border p-4 rounded mb-4">
                  <input
                    type="text"
                    placeholder={`Question ${index + 1}`}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <select
                    value={question.type}
                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  >
                    <option value="multipleChoice">Multiple Choice</option>
                    <option value="trueFalse">True or False</option>
                    <option value="shortAnswer">Short Answer</option>
                    <option value="radioButton">Radio Button</option>
                  </select>

                  {(question.type === 'multipleChoice' || question.type === 'radioButton') &&
                    Array.isArray(question.options) && (
                      <>
                        {question.options.map((opt, oIndex: number) => (
                          <div key={oIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              placeholder={`Option ${oIndex + 1}`}
                              value={opt}
                              onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                              className="w-full p-2 border rounded"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...questions];
                                updated[index].options = updated[index].options?.filter((_, i) => i !== oIndex);
                                setQuestions(updated);
                              }}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              ❌
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addOption(index)}
                          className="bg-blue-500 text-white px-3 py-1 rounded mt-1"
                        >
                          ➕ Add Option
                        </button>
                      </>
                    )}

                  <div className="mt-4 flex items-center gap-2">
                    <label className="font-semibold w-40">Correct Answer:</label>
                    <input
                      type="text"
                      placeholder="Correct Answer"
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <label className="font-semibold w-40">Marks:</label>
                    <input
                      type="number"
                      placeholder="Marks"
                      value={question.marks}
                      onChange={(e) => handleQuestionChange(index, 'marks', Number(e.target.value))}
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addQuestion}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Question
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
            >
              Submit Exam
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditExamPage;
