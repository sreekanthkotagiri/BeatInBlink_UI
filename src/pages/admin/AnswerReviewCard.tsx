import React from 'react';

interface AnswerReviewCardProps {
  index: number;
  question: {
    id: string;
    text: string;
    type: string;
    options?: string[];
    marks: number;
  };
  evaluated: {
    correctAnswer: string;
    studentAnswer: string;
  };
  mode?: 'readonly' | 'editable';
  showAnswers?: boolean;
}

const normalize = (text: string) => text.trim().toLowerCase();

const AnswerReviewCard: React.FC<AnswerReviewCardProps> = ({
  index,
  question,
  evaluated,
  mode = 'readonly',
  showAnswers = true,
}) => {
  const isObjective = Array.isArray(question.options);

  const correctOptions = isObjective
    ? evaluated.correctAnswer.split(' and ').map(normalize)
    : [normalize(evaluated.correctAnswer)];

  const studentOptions = isObjective
    ? evaluated.studentAnswer.split(' and ').map(normalize)
    : [normalize(evaluated.studentAnswer)];

  const isCorrect =
    normalize(evaluated.studentAnswer) === normalize(evaluated.correctAnswer);

  const showIcon = evaluated.studentAnswer?.trim() !== '';

  return (
    <div className="mb-6 border border-gray-300 rounded-lg p-6 bg-gray-50 w-full">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-base font-medium">
        <span className="text-gray-700">{index + 1}.</span>
        <span>{question.text}</span>
        {question.marks !== undefined && (
          <span className="text-sm text-gray-500">
            ({question.marks} mark{question.marks > 1 ? 's' : ''})
          </span>
        )}
        {showAnswers && (
          <span className={`text-sm font-semibold ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
            {isCorrect ? '✅ Correct' : '❌ Incorrect'}
          </span>
        )}
      </div>

      {showAnswers ? (
        isObjective && question.options && (question.type === 'radiobutton' || question.type === 'multiplechoice') ? (
          question.options.map((opt, i) => {
            const normOpt = normalize(opt);
            const selected = studentOptions.includes(normOpt);
            const correct = correctOptions.includes(normOpt);

            let style = 'text-gray-800';
            let icon = '';

            if (correct && selected) {
              style = 'text-green-700 font-semibold';
              icon = '✅';
            } else if (!correct && selected) {
              style = 'text-red-600 line-through';
              icon = '❌';
            } else if (correct && !selected) {
              style = 'text-green-600 italic';
              icon = '✅';
            }

            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={style}>{opt}</span>
                <span>{icon}</span>
              </div>
            );
          })
        ) : (
          <div className="mt-2 text-sm flex flex-col gap-1 bg-gray-50 p-3 rounded border">
            <div className="flex items-center gap-2">
              <span className="font-medium">Your Answer:</span>
              <span
                className={
                  isCorrect
                    ? 'text-green-700 font-semibold'
                    : 'text-red-600 font-semibold line-through'
                }
              >
                {evaluated.studentAnswer?.trim()
                  ? evaluated.studentAnswer
                  : 'Not answered'}
              </span>
              <span>{isCorrect ? '✅' : '❌'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Correct Answer:</span>
              <span className="text-green-700 font-semibold">
                {evaluated.correctAnswer || 'Not provided'}
              </span>
            </div>
          </div>
        )
      ) : (
        <p className="text-sm italic text-gray-500">
          Answer review is disabled by admin.
        </p>
      )}

      {mode === 'editable' && showAnswers && (
        <div className="mt-4">
          <textarea
            className="w-full border rounded p-2 text-sm"
            placeholder="Optional remarks or adjustments..."
          />
        </div>
      )}
    </div>
  );
};

export default AnswerReviewCard;
