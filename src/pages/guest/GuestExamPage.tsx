// Final GuestExamPage.tsx with corrected evaluation logic for all question types

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Button, Input, Textarea } from '../../components/ui/input';
import { isValidType } from '../../utils/utils';
import GuestHeader from './GuestHeader';
import { GuestExamsWithQuestion } from '../../types/exam';
import AnswerReviewCard from '../admin/AnswerReviewCard';
import QuestionAnswerForm from '../admin/QuestionAnswerForm';

const GuestExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<GuestExamsWithQuestion | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [studentName, setStudentName] = useState('');
  const [tempName, setTempName] = useState('');
  const [loadingExam, setLoadingExam] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    totalScore: number;
    totalMarks: number;
    scorePercentage: number;
    evaluatedAnswers?: Record<string, { correctAnswer: string; studentAnswer: string, marks: number }>;
  } | null>(null);

  const fetchExam = async (id: string) => {
    setLoadingExam(true);
    try {
      const response = await API.get(`/auth/guest/getExam/${id}`);
      setExam(response.data.exam);
    } catch (error) {
      setErrorMessage('Failed to load exam.');
      setShowErrorModal(true);
    } finally {
      setLoadingExam(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string, type: string, checked?: boolean) => {
    if (type === 'multiplechoice') {
      const selected = answers[questionId]?.split(' and ').filter(Boolean) || [];
      const updated = checked
        ? [...new Set([...selected, value])]
        : selected.filter((opt) => opt !== value);
      setAnswers({ ...answers, [questionId]: updated.join(' and ') });
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
      console.log('vvvvvvvvvvvvvvv  ', JSON.stringify({
        examId,
        studentName,
        answers,
      }));
      setIsSubmitting(true);
      const res = await API.post('/auth/guest/submitExam', {
        examId,
        studentName,
        answers,
      });
      setResult(res.data);
      setSubmitted(true);
      setShowModal(true);
    } catch (error) {
      setErrorMessage('Failed to submit answers.');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEvaluatedAnswers = () => {
    if (!result?.evaluatedAnswers || !exam) return null;

    return (
      <div className="mt-6 text-left">
        <h3 className="text-lg font-bold mb-2 text-blue-700">📘 Your Answer Breakdown</h3>
        {exam.questions.map((question, index) => {
          if (!question.id) return null;
          const evaluated = result.evaluatedAnswers?.[question.id];
          if (!evaluated) return null;

          return (
            <AnswerReviewCard
              key={question.id}
              index={index}
              question={question}
              evaluated={evaluated}
              mode="readonly"
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <GuestHeader guestName={studentName} />

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
            <Button
              className="bg-blue-600 hover:bg-blue-700 w-full"
              onClick={() => {
                if (tempName.trim()) {
                  setStudentName(tempName.trim());
                  setShowNameModal(false);
                  if (examId) fetchExam(examId);
                } else {
                  setErrorMessage('Name is required to take the exam!');
                  setShowErrorModal(true);
                }
              }}
            >
              Start Exam
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        {showModal && result && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-2xl text-left max-w-4xl w-full overflow-y-auto max-h-[90vh]">

              <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Exam Submitted Successfully!</h2>
              <p className="text-lg mb-2">Total Score: <strong>{result.totalScore}</strong></p>
              <p className="text-lg mb-2">Total Marks: <strong>{result.totalMarks}</strong></p>
              <p className="text-lg mb-4">Score Percentage: <strong>{result.scorePercentage.toFixed(2)}%</strong></p>
              {renderEvaluatedAnswers()}
              <Button className="bg-blue-600 hover:bg-blue-700 w-full mt-4" onClick={() => navigate('/')}>Go to Home</Button>
            </div>
          </div>
        )}

        {!loadingExam && !showModal && exam && !showNameModal && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{exam.title}</h2>
            {exam.questions.map((question, index) => (
              <QuestionAnswerForm
                key={question.id}
                index={index}
                question={question}
                answer={answers[question.id] || ''}
                onChange={handleAnswerChange}
              />
            ))}
            <Button className="bg-green-600 hover:bg-green-700 w-full" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </Button>
          </div>
        )}

        {loadingExam && <div className="text-center p-8 text-gray-500">Loading exam...</div>}

        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg text-center">
              <p className="text-red-600 font-semibold mb-4">{errorMessage}</p>
              <Button onClick={() => setShowErrorModal(false)}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestExamPage;
