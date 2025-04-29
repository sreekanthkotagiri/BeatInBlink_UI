import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Textarea } from '../../components/ui/input';
import { Drawer } from '../../components/ui/Drawer';
import API from '../../services/api';
import MultipleChoiceQuestion from '../../components/ui/questions/MultipleChoiceQuestion';
import RadioButtonQuestion from '../../components/ui/questions/RadioButtonQuestion';
import TrueFalseQuestion from '../../components/ui/questions/TrueFalseQuestion';
import ShortAnswerQuestion from '../../components/ui/questions/ShortAnswerQuestion';
import QuestionForm from '../../lib/validateQuestions ';
import { isValidType } from '../../utils/utils';

type QuestionType = 'multiplechoice' | 'truefalse' | 'shortanswer' | 'radiobutton';

interface Question {
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string;
  marks: number;
}

interface Exam {
  id: string;
  title: string;
  scheduled_date: string;
  duration_min: number;
  pass_percentage: number;
  exam_link?: string;
}

interface StudentResult {
  id: string;
  student_name: string;
  exam_title: string;
  score: number;
  submitted_at: string;
}

const GuestHome: React.FC = () => {
  const navigate = useNavigate();
  const [guestName, setGuestName] = useState('');
  const [guestCode, setGuestCode] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [durationMin, setDurationMin] = useState<number>(0);
  const [passPercentage, setPassPercentage] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [latestExamLink, setLatestExamLink] = useState<string | null>(null);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [questionMode, setQuestionMode] = useState<'manual' | 'upload' | null>(null);

  useEffect(() => {
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
      const response = await API.get(`/auth/guest/getAllExam?guestId=${code}`);
      if (response.data?.exams) {
        setExams(response.data.exams);
      }
    } catch (error) {
      console.error('Error fetching guest exams:', error);
    }
  };

  const fetchStudentResults = async (code: string) => {
    try {
      const response = await API.get(`/auth/guest/getAllResults?guestCode=${code}`);
      if (response.data?.results) {
        setStudentResults(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching student results:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('guestCode');
    localStorage.removeItem('guestName');
    navigate('/');
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { type: 'multiplechoice', text: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 },
    ]);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (index: number) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[index].options) {
      updatedQuestions[index].options = [];
    }
    updatedQuestions[index].options!.push('');
    setQuestions(updatedQuestions);
  };

  const handleDeleteOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options!.splice(optionIndex, 1);
    }
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    if (!title || !description || !scheduledDate || durationMin <= 0 || passPercentage <= 0) {
      alert('Please fill all fields properly!');
      return;
    }
    if (questions.length === 0) {
      alert('Please add at least one question.');
      return;
    }

    const formattedQuestions = questions.map((q) => ({
      question: q.text,
      type: q.type,
      choices: q.options || [],
      correctAnswer: q.correctAnswer,
      marks: q.marks || 1,
    }));

    const payload = {
      guestId: guestCode,
      title,
      description,
      scheduled_date: scheduledDate,
      duration_min: durationMin,
      pass_percentage: passPercentage,
      created_by: guestCode,
      questions: formattedQuestions,
    };

    try {
      const response = await API.post(`/auth/guest/createExam`, payload);
      if (response.data?.examId) {
        const examLink = `${window.location.origin}/guest-exam/${response.data.examId}`;
        setLatestExamLink(examLink);
        setShowLinkPopup(true);
      }
      setShowDrawer(false);
      resetForm();
      fetchGuestExams(guestCode);
    } catch (error) {
      console.error('Error creating guest exam:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setScheduledDate('');
    setDurationMin(0);
    setPassPercentage(0);
    setQuestions([]);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Elegant Header */}
      <header className="bg-blue-800 text-white py-6 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-yellow-400">BeatInBlink</span>
            </h1>
            <p className="text-sm font-light italic text-blue-100">Faster, Smarter, In a blink</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <span className="text-sm font-semibold">Welcome {guestName},</span>
            <Button
              className="text-sm border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-blue-800 transition"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Elegant Main */}
      <div className="p-8 max-w-7xl mx-auto space-y-8">

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
          <h2 className="text-3xl font-bold text-blue-800">Welcome, {guestName}!</h2>
          <p className="text-gray-600">Create your own exams easily and share them!</p>

          <div className="text-sm text-red-600 font-medium">
            ⚠️ If you logout, your exams and results will be lost permanently.
          </div>
          <div className="text-sm text-blue-600 font-medium">
            🔒 Guest users have limited access. Create a full account for more features!
          </div>

          <Button
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-semibold px-6 py-3 rounded shadow-md mt-4"
            onClick={() => setShowDrawer(true)}
          >
            Create Exam
          </Button>
        </div>

        {/* Info Card */}
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow mb-6">
          Exams will automatically expire after 24 hours. Share links quickly with your students!
        </div>

        {/* Created Exams Table */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-6">
          <h3 className="text-2xl font-bold mb-4 text-blue-700">Your Created Exams</h3>
          {exams.length > 0 ? (
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
                    <td className="py-2 px-4 border">{exam.duration_min} min</td>
                    <td className="py-2 px-4 border">{exam.pass_percentage}%</td>
                    <td className="py-2 px-4 border">
                      {exam.exam_link ? (
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1"
                          onClick={() => {
                            navigator.clipboard.writeText(exam.exam_link || '');
                            alert('Link copied to clipboard!');
                          }}
                        >
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

        {/* Student Results */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-6">
          <h3 className="text-2xl font-bold mb-4 text-green-700">Student Submissions</h3>
          {studentResults.length > 0 ? (
            <table className="min-w-full bg-white divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border">Student Name</th>
                  <th className="py-2 px-4 border">Exam Title</th>
                  <th className="py-2 px-4 border">Score (%)</th>
                  <th className="py-2 px-4 border">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {studentResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-100 transition text-center">
                    <td className="py-2 px-4 border">{result.student_name}</td>
                    <td className="py-2 px-4 border">{result.exam_title}</td>
                    <td className="py-2 px-4 border">{result.score}%</td>
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

      <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} width="60%">
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold mb-6 text-blue-800">Create Guest Exam</h2>

          <Input
            type="text"
            placeholder="Exam Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Duration (minutes)"
            value={durationMin}
            onChange={(e) => setDurationMin(Number(e.target.value))}
          />

          <Input
            type="number"
            placeholder="Pass Percentage"
            value={passPercentage}
            onChange={(e) => setPassPercentage(Number(e.target.value))}
          />

          {questionMode === null && (
            <div className="flex gap-4 justify-center py-4">
              <Button onClick={() => setQuestionMode('manual')} className="w-1/2">
                Create Manually
              </Button>
              <Button onClick={() => setQuestionMode('upload')} className="w-1/2">
                Upload CSV
              </Button>
            </div>
          )}

          {questionMode === 'upload' && (
            <QuestionForm onUpload={(uploadedQuestions: Question[]) => setQuestions(uploadedQuestions)} />
          )}
          {/* Questions Section */}
          {questionMode === 'manual' && (
            <>
              <h3 className="text-xl font-semibold">Questions</h3>
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="border rounded p-4 mb-6 bg-gray-50 shadow space-y-4">
                    <select
                      className="w-full p-2 border rounded"
                      value={question.type}
                      onChange={(e) => updateQuestion(index, { ...question, type: e.target.value as QuestionType, options: ['', ''] })}
                    >
                      <option value="multiplechoice">Multiple Choice</option>
                      <option value="radiobutton">Radio Button</option>
                      <option value="truefalse">True/False</option>
                      <option value="shortanswer">Short Answer</option>
                    </select>

                    <div className="mb-3">
                      <label className="block font-medium mb-1">Marks</label>
                      <Input
                        type="number"
                        placeholder="Enter marks"
                        className="w-32"
                        value={question.marks}
                        onChange={(e) =>
                          updateQuestion(index, {
                            ...question,
                            marks: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <Textarea
                      className="w-full"
                      placeholder="Enter your question"
                      value={question.text}
                      onChange={(e) => updateQuestion(index, { ...question, text: e.target.value })}
                    />

                    {isValidType(question.type) === 'multiplechoice' && (
                      <MultipleChoiceQuestion
                        question={question}
                        index={index}
                        updateQuestion={updateQuestion}
                        handleDeleteOption={handleDeleteOption}
                        handleAddOption={handleAddOption}
                      />
                    )}

                    {isValidType(question.type) === 'radiobutton' && (
                      <RadioButtonQuestion
                        question={question}
                        index={index}
                        updateQuestion={updateQuestion}
                        handleDeleteOption={handleDeleteOption}
                        handleAddOption={handleAddOption}
                      />
                    )}

                    {isValidType(question.type) === 'truefalse' && (
                      <TrueFalseQuestion
                        question={question}
                        index={index}
                        updateQuestion={updateQuestion}
                      />
                    )}

                    {isValidType(question.type) === 'shortanswer' && (
                      <ShortAnswerQuestion
                        question={question}
                        index={index}
                        updateQuestion={updateQuestion}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={addQuestion}>
                Add Question
              </Button>
            </>
          )}
          {/* Link Sharing Popup */}
          {showLinkPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-6">
                <h2 className="text-2xl font-bold text-green-700">Exam Created!</h2>
                <p className="text-gray-600">Share this link with your students:</p>

                <div className="bg-gray-100 p-3 rounded break-words">
                  {latestExamLink}
                </div>

                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    if (latestExamLink) {
                      navigator.clipboard.writeText(latestExamLink);
                      alert('Link copied to clipboard!');
                    }
                  }}
                >
                  Copy Link
                </Button>

                <Button
                  className="w-full bg-gray-400 text-white hover:bg-gray-500 mt-2"
                  onClick={() => setShowLinkPopup(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}


          <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={addQuestion}>
            Add Question
          </Button>

          <Button className="w-full bg-green-700 hover:bg-green-800 mt-6" onClick={handleSubmit}>
            Submit Exam
          </Button>
        </div>
      </Drawer>

    </div>
  );
};

export default GuestHome;
