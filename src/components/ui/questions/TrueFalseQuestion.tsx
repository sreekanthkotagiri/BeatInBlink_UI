import React from 'react';

interface Props {
  question: any;
  index: number;
  updateQuestion: (index: number, updatedQuestion: any) => void;
}

const TrueFalseQuestion: React.FC<Props> = ({ question, index, updateQuestion }) => {
  return (
    <div className="space-y-2">
      <select
        className="w-full p-2 border rounded"
        value={question.correctAnswer}
        onChange={(e) => updateQuestion(index, { ...question, correctAnswer: e.target.value })}
      >
        <option value="">Select Correct Answer</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    </div>
  );
};

export default TrueFalseQuestion;
