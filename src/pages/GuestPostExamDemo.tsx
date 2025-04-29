import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import API from '../services/api';
import { Button, Input, Textarea } from '../components/ui/input';

type QuestionType = 'multipleChoice' | 'trueFalse' | 'shortAnswer' | 'radioButton';

interface Question {
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string;
  marks: number;
}

interface DrawerProps {
  onClose: () => void;
}

const GuestCreateExamDrawer: React.FC<DrawerProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [durationMin, setDurationMin] = useState<number>(0);
  const [passPercentage, setPassPercentage] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    if (questions.length >= 10) {
      alert('You can add up to 10 questions only.');
      return;
    }
    setQuestions([
      ...questions,
      {
        type: 'multipleChoice',
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

      if ((q.type === 'multipleChoice' || q.type === 'radioButton') && (!q.options || q.options.some(opt => !opt))) {
        alert('All options must be filled for choice/radio type questions.');
        return;
      }
    }

    const payload = {
      title,
      description,
      scheduled_date: scheduledDate,
      duration_min: durationMin,
      pass_percentage: passPercentage,
      questions,
    };

    try {
      console.log('Guest payload:', JSON.stringify(payload));
      await API.post('/auth/guest/create-exam', payload);
      alert('Demo exam created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating demo exam:', error);
      alert('Failed to create exam.');
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
      <div className="absolute right-0 top-0 w-full max-w-3xl h-full bg-white shadow-xl overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Demo Exam</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="text"
              placeholder="Exam Title"
              value={title}
              onChange={(e:any) => setTitle(e.target.value)}
            />
            <Input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e:any) => setScheduledDate(e.target.value)}
            />
          </div>

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e:any) => setDescription(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="number"
              placeholder="Duration (min)"
              value={durationMin}
              onChange={(e:any) => setDurationMin(Number(e.target.value))}
            />
            <Input
              type="number"
              placeholder="Pass Percentage"
              value={passPercentage}
              onChange={(e:any) => setPassPercentage(Number(e.target.value))}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Questions</h3>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={index} className="border p-6 rounded-xl bg-gray-50 shadow">
                  <h4 className="text-lg font-semibold mb-3">Question {index + 1}</h4>

                  <select
                    className="mb-3 w-full p-2 border rounded"
                    value={question.type}
                    onChange={(e:any) => updateQuestion(index, { ...question, type: e.target.value as QuestionType })}
                  >
                    <option value="multipleChoice">Multiple Choice</option>
                    <option value="trueFalse">True/False</option>
                    <option value="shortAnswer">Short Answer</option>
                    <option value="radioButton">Radio Button</option>
                  </select>

                  <Textarea
                    className="mb-3 w-full"
                    placeholder="Enter your question"
                    value={question.text}
                    onChange={(e:any) => updateQuestion(index, { ...question, text: e.target.value })}
                  />

                  {(question.type === 'multipleChoice' || question.type === 'radioButton') &&
                    question.options?.map((option, optIndex) => (
                      <Input
                        key={optIndex}
                        className="mb-2"
                        placeholder={`Option ${optIndex + 1}`}
                        value={option}
                        onChange={(e:any) => {
                          const updatedOptions = [...(question.options || [])];
                          updatedOptions[optIndex] = e.target.value;
                          updateQuestion(index, { ...question, options: updatedOptions });
                        }}
                      />
                    ))}

                  {question.type === 'trueFalse' && (
                    <select
                      className="w-full p-2 border rounded"
                      value={question.correctAnswer}
                      onChange={(e) => updateQuestion(index, { ...question, correctAnswer: e.target.value })}
                    >
                      <option value="">Select Answer</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  )}

                  {question.type === 'shortAnswer' && (
                    <Input
                      className="w-full"
                      placeholder="Correct Answer"
                      value={question.correctAnswer}
                      onChange={(e:any) => updateQuestion(index, { ...question, correctAnswer: e.target.value })}
                    />
                  )}

                  <Input
                    type="number"
                    placeholder="Marks"
                    className="mt-3 w-32"
                    value={question.marks}
                    onChange={(e:any) => updateQuestion(index, { ...question, marks: Number(e.target.value) })}
                  />
                </div>
              ))}
              <Button className="mt-4" onClick={addQuestion}>
                Add Question
              </Button>
            </div>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
            Create Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestCreateExamDrawer;
