// components/QuestionAnswerForm.tsx

import React from 'react';
import { Textarea } from '../../components/ui/input';
import { isValidType } from '../../utils/utils';

interface QuestionAnswerFormProps {
    index: number;
    question: {
        id: string;
        text: string;
        type: string;
        options?: string[];
        marks?: number;
    };
    answer: string;
    onChange: (questionId: string, value: string, type: string, checked?: boolean) => void;
}
const QuestionAnswerForm: React.FC<QuestionAnswerFormProps> = ({ question, answer, index, onChange }) => {
    const type = question.type;

    return (
        <div className="mb-6">
            <p className="mb-2 text-base font-medium">
                <span className="text-gray-700 mr-2">{index + 1}.</span>
                <span>{question.text}</span>
                {question.marks !== undefined && (
                    <span className="ml-2 text-sm text-gray-500">({question.marks} mark{question.marks > 1 ? 's' : ''})</span>
                )}
            </p>


            {Array.isArray(question.options) && (isValidType(type) === 'multiplechoice' || isValidType(type) === 'radiobutton') ? (
                question.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                        <input
                            type={type === 'multiplechoice' ? 'checkbox' : 'radio'}
                            name={question.id}
                            value={opt}
                            checked={
                                type === 'multiplechoice'
                                    ? answer.split(' and ').includes(opt)
                                    : answer === opt
                            }
                            onChange={(e) =>
                                onChange(question.id, opt, type, e.target.checked)
                            }
                        />
                        <label>{opt}</label>
                    </div>
                ))
            ) : isValidType(type) === 'shortanswer' ? (
                <Textarea
                    placeholder="Your answer"
                    value={answer || ''}
                    onChange={(e: any) => onChange(question.id, e.target.value, type)}
                />
            ) : (
                <select
                    className="border p-2 rounded w-full"
                    value={answer}
                    onChange={(e) => onChange(question.id, e.target.value, type)}
                >
                    <option value="">Select</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            )}
        </div>
    );
};

export default QuestionAnswerForm;
