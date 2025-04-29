import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../../services/api';
import { Button, Input, Textarea } from './../../components/ui/input';
import { Header } from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useAuth } from './../../context/AuthContext';
import { getEnabledTabs } from '../../lib/getEnabledTabs';
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

const CreateExamPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [durationMin, setDurationMin] = useState<number>(0);
  const [passPercentage, setPassPercentage] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionMode, setQuestionMode] = useState<'manual' | 'upload' | null>(null);
  const [instituteName, setInstituteName] = useState('');
  const [enabledTabs, setEnabledTabs] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    const storedInstitute = localStorage.getItem('institute');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
    if (!institute || !institute.id) {
      console.error('No institute ID found');
      return;
    }
    setInstituteName(institute.name);
    setEnabledTabs(getEnabledTabs(location.pathname));
  }, [location.pathname]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: 'multiplechoice',
        text: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        marks: 1,
      },
    ]);
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    const institute = localStorage.getItem('institute');
    if (!institute) {
      alert('No institute logged in!');
      return;
    }

    if (!title || !description || !scheduledDate || durationMin <= 0 || passPercentage <= 0) {
      alert('All fields must be filled and valid.');
      return;
    }

    if (questions.length === 0) {
      alert('Add at least one question.');
      return;
    }

    for (const q of questions) {
      if (!q.text || !q.correctAnswer || q.marks <= 0) {
        alert('Each question must have text, correct answer, and marks.');
        return;
      }

      if ((q.type === 'multiplechoice' || q.type === 'radiobutton') && (!q.options || q.options.some(opt => !opt))) {
        alert('All options must be filled for choice/radio type questions.');
        return;
      }
    }

    const { id: instituteId } = JSON.parse(institute);

    const payload = {
      title,
      description,
      scheduled_date: scheduledDate,
      duration_min: durationMin,
      pass_percentage: passPercentage,
      created_by: instituteId,
      questions,
    };

    try {
      await API.post(`/auth/institute/createExam?instituteId=${instituteId}`, payload);
      alert('Exam created successfully!');
      navigate('/institute');
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to create exam.');
    }
  };

  return (
    <div className="institute-home bg-gray-50 min-h-screen">
      <div className="dashboard-container">
        <Sidebar
          enabledTabs={['dashboard', 'manageStudents', 'manageExams', 'results', 'announcements']}
        />
  
        <div className="main-content">
          <Header
            title="Create Exam"
            subtitle="Fill out the details to create an exam"
            instituteName={instituteName}
          />
  
          <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
  
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Duration (in minutes)</label>
                <Input
                  type="number"
                  placeholder="Enter duration"
                  value={durationMin}
                  onChange={(e) => setDurationMin(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Pass Percentage</label>
                <Input
                  type="number"
                  placeholder="Enter pass %"
                  value={passPercentage}
                  onChange={(e) => setPassPercentage(Number(e.target.value))}
                />
              </div>
            </div>
  
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
              <QuestionForm
                onUpload={(uploadedQuestions: Question[]) => setQuestions(uploadedQuestions)}
              />
            )}
  
            {questionMode === 'manual' && (
              <>
                <h3 className="text-xl font-semibold">Questions</h3>
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={index} className="border p-6 rounded-xl bg-gray-50 shadow">
                      <h4 className="text-lg font-semibold mb-3">Question {index + 1}</h4>
  
                      <select
                        className="mb-3 w-full p-2 border rounded"
                        value={question.type}
                        onChange={(e) =>
                          updateQuestion(index, {
                            ...question,
                            type: e.target.value as QuestionType,
                          })
                        }
                      >
                        <option value="multiplechoice">Multiple Choice</option>
                        <option value="truefalse">True/False</option>
                        <option value="shortanswer">Short Answer</option>
                        <option value="radiobutton">Radio Button</option>
                      </select>
  
                      <Textarea
                        className="mb-3 w-full"
                        placeholder="Enter your question"
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(index, { ...question, text: e.target.value })
                        }
                      />
  
                      {(isValidType(question.type) === 'multiplechoice' || isValidType(question.type) === 'radiobutton') &&
                        question.options?.map((option, optIndex) => (
                          <Input
                            key={optIndex}
                            className="mb-2"
                            placeholder={`Option ${optIndex + 1}`}
                            value={option}
                            onChange={(e) => {
                              const updatedOptions = [...(question.options || [])];
                              updatedOptions[optIndex] = e.target.value;
                              updateQuestion(index, { ...question, options: updatedOptions });
                            }}
                          />
                        ))}
  
                      {isValidType(question.type) === 'truefalse' && (
                        <div className="mb-3">
                          <label className="block font-medium mb-1">Correct Answer</label>
                          <select
                            className="w-full p-2 border rounded"
                            value={question.correctAnswer}
                            onChange={(e) =>
                              updateQuestion(index, {
                                ...question,
                                correctAnswer: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Answer</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        </div>
                      )}
  
                      {isValidType(question.type) === 'shortanswer' && (
                        <div className="mb-3">
                          <label className="block font-medium mb-1">Correct Answer</label>
                          <Input
                            className="w-full"
                            placeholder="Correct Answer"
                            value={question.correctAnswer}
                            onChange={(e) =>
                              updateQuestion(index, {
                                ...question,
                                correctAnswer: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
  
                      <div>
                        <label className="block font-medium mb-1">Marks</label>
                        <Input
                          type="number"
                          placeholder="Marks"
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
                    </div>
                  ))}
                </div>
                <Button className="mt-4" onClick={addQuestion}>
                  Add Question
                </Button>
              </>
            )}
  
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
              Create Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExamPage;
