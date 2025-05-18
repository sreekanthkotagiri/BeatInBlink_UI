// Enhanced GuestExamPage.tsx for better UX and elegance

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Button, Input } from '../../components/ui/input';
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
  const [showNameModal, setShowNameModal] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    totalScore: number;
    totalMarks: number;
    scorePercentage: number;
    evaluatedAnswers?: Record<string, { correctAnswer: string; studentAnswer: string; marks: number }>;
    downloadable: boolean;
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
    if (!studentName.trim()) {
      setErrorMessage('Student name is required.');
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
      <div className="mt-6 space-y-4">
        <h3 className="text-xl font-semibold text-blue-800 mb-2">📘 Your Answer Breakdown</h3>
        {exam.questions.map((question, index) => {
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
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <GuestHeader guestName={studentName} />

      {showNameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">Enter Your Name to Start</h2>
            <Input
              type="text"
              placeholder="Your name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="mb-4"
            />
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!loadingExam && !submitted && exam && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">{exam.title}</h2>
            {exam.questions.map((question, index) => (
              <QuestionAnswerForm
                key={question.id}
                index={index}
                question={question}
                answer={answers[question.id] || ''}
                onChange={handleAnswerChange}
              />
            ))}
            <Button
              className="w-full mt-6 bg-green-600 hover:bg-green-700"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </Button>
          </div>
        )}

        {loadingExam && <div className="text-center text-gray-500">Loading exam...</div>}

        {submitted && result && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">✅ Exam Submitted Successfully!</h2>
            <p className="text-lg mb-2">Total Score: <strong>{result.totalScore}</strong></p>
            <p className="text-lg mb-2">Total Marks: <strong>{result.totalMarks}</strong></p>
            <p className="text-lg mb-4">Score Percentage: <strong>{result.scorePercentage.toFixed(2)}%</strong></p>

            {renderEvaluatedAnswers()}

            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              {result.downloadable ? (
                <Button
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-2 rounded-lg shadow-md w-full sm:w-auto"
                  onClick={async () => {
                    try {
                      const response = await API.get(`/auth/guest/downloadExam?examId=${examId}`, {
                        responseType: 'blob',
                      });

                      const blob = new Blob([response.data], {
                        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                      });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'exam_result.docx';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      alert('❌ Failed to download exam paper.');
                      console.error('Download error:', err);
                    }
                  }}
                >
                  📄 Download Exam Paper
                </Button>

              ) : (
                <Button
                  className="bg-gray-300 text-gray-500 font-medium w-full sm:w-auto cursor-not-allowed"
                  disabled
                >
                  📄 Download Disabled by Institute
                </Button>
              )}

              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 to-blue-800 text-white font-semibold px-6 py-2 rounded-lg shadow-md w-full sm:w-auto"
                onClick={() => navigate('/')}
              >
                🏠 Go to Home
              </Button>
            </div>
          </div>
        )}

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