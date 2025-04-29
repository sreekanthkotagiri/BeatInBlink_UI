import React from 'react';
import { Button, Input } from '../input';

interface Props {
  question: any;
  index: number;
  updateQuestion: (index: number, updatedQuestion: any) => void;
  handleDeleteOption: (questionIndex: number, optionIndex: number) => void;
  handleAddOption: (index: number) => void;
}

const MultipleChoiceQuestion: React.FC<Props> = ({
  question,
  index,
  updateQuestion,
  handleDeleteOption,
  handleAddOption
}) => {
  
  const selectedOptions = question.correctAnswer ? question.correctAnswer.split(' and ') : [];

  const handleCheckboxChange = (option: string, checked: boolean) => {
    let updatedSelected = question.correctAnswer
      ? question.correctAnswer.split(' and ').filter((opt: string) => opt.trim() !== '')
      : [];
  
    if (checked) {
      if (!updatedSelected.includes(option)) {
        updatedSelected.push(option);
      }
    } else {
      updatedSelected = updatedSelected.filter((opt: string) => opt !== option);
    }
  
    // ✅ When joining, filter empty values again
    const cleanedAnswer = updatedSelected.filter((opt: string) => opt.trim() !== '').join(' and ');
  
    updateQuestion(index, {
      ...question,
      correctAnswer: cleanedAnswer,
    });
  };
  

  return (
    <div>
      {question.options?.map((option: string, optIndex: number) => (
        <div key={optIndex} className="flex items-center gap-3 mb-2">
          <input
            type="checkbox"
            checked={selectedOptions.includes(option)}
            onChange={(e) => handleCheckboxChange(option, e.target.checked)}
          />

          <Input
            className="flex-1"
            placeholder={`Option ${optIndex + 1}`}
            value={option}
            onChange={(e) => {
              const updatedOptions = [...(question.options || [])];
              updatedOptions[optIndex] = e.target.value;
              updateQuestion(index, { ...question, options: updatedOptions });
            }}
          />

          <Button
            className="bg-red-500 text-white px-2 py-1 text-xs"
            onClick={() => handleDeleteOption(index, optIndex)}
          >
            Delete
          </Button>
        </div>
      ))}

      <Button
        className="mt-2 bg-blue-500 text-white text-sm"
        onClick={() => handleAddOption(index)}
      >
        Add Option
      </Button>

      {/* Correct Answer field (Read-only) */}
      <Input
        className="w-full mt-4 bg-gray-100"
        placeholder="Correct Answer (Auto Generated)"
        value={question.correctAnswer}
        readOnly
      />
    </div>
  );
};

export default MultipleChoiceQuestion;
