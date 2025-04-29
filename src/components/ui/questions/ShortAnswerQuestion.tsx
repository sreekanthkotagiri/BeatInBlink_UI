import React from 'react';
import { Input } from '../input';

interface Props {
  question: any;
  index: number;
  updateQuestion: (index: number, updatedQuestion: any) => void;
}

const ShortAnswerQuestion: React.FC<Props> = ({ question, index, updateQuestion }) => {
  return (
    <div className="space-y-2">
      <Input
        className="w-full"
        placeholder="Correct Answer"
        value={question.correctAnswer}
        onChange={(e) => updateQuestion(index, { ...question, correctAnswer: e.target.value })}
      />
    </div>
  );
};

export default ShortAnswerQuestion;
