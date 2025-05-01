import React from 'react';
import { Button, Input, Textarea } from '../../components/ui/input';
import { isValidType } from '../../utils/utils';
import MultipleChoiceQuestion from '../../components/ui/questions/MultipleChoiceQuestion';
import RadioButtonQuestion from '../../components/ui/questions/RadioButtonQuestion';
import TrueFalseQuestion from '../../components/ui/questions/TrueFalseQuestion';
import ShortAnswerQuestion from '../../components/ui/questions/ShortAnswerQuestion';
import Spinner from '../../components/ui/Spinner';
import { CreateExamDrawerProps } from '../../types/guest';
import QuestionForm from '../../lib/validateQuestions ';


const CreateExamDrawer: React.FC<CreateExamDrawerProps> = ({
  isOpen,
  onClose,
  title,
  setTitle,
  scheduledDate,
  setScheduledDate,
  description,
  setDescription,
  durationMin,
  setDurationMin,
  passPercentage,
  setPassPercentage,
  questions,
  setQuestions,
  questionMode,
  setQuestionMode,
  handleSubmit,
  submitting,
  formError,
  addQuestion,
  updateQuestion,
  handleDeleteOption,
  handleAddOption,
  enableTimeLimit,
  setEnableTimeLimit,
  restrictAccess,
  setRestrictAccess,
}) => {
  return (
    <div className={`fixed top-0 right-0 w-full max-w-[700px] h-full bg-gradient-to-b from-white to-blue-50 shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} rounded-l-2xl`}>
      <div className="p-8 space-y-6 overflow-y-auto h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-700">Create Guest Exam</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-3xl">&times;</button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Input type="text" placeholder="Exam Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

          <div className="flex items-center gap-3">
            <input type="checkbox" checked={enableTimeLimit} onChange={(e) => setEnableTimeLimit(e.target.checked)} />
            <label className="text-sm text-gray-700 font-medium">⏳ Enable Time Limit</label>
          </div>
          {enableTimeLimit && (
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">Duration (minutes)</label>
              <input
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(Number(e.target.value))}
                className="px-4 py-2 border rounded-md shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter duration in minutes"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Pass Percentage</label>
            <input
              type="number"
              value={passPercentage}
              onChange={(e) => setPassPercentage(Number(e.target.value))}
              className="px-4 py-2 border rounded-md shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter pass percentage"
            />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" checked={restrictAccess} onChange={(e) => setRestrictAccess(e.target.checked)} />
            <label className="text-sm text-gray-700 font-medium">🛡️ Restrict external window switch / cursor movement</label>
          </div>

          {questionMode === null && (
            <div className="flex gap-4 py-4">
              <Button onClick={() => setQuestionMode('manual')} className="w-1/2">📝 Create Manually</Button>
              <Button onClick={() => setQuestionMode('upload')} className="w-1/2">📂 Upload CSV</Button>
            </div>
          )}

          {questionMode === 'upload' && <QuestionForm onUpload={(uploadedQuestions) => setQuestions(uploadedQuestions)} />}

          {questionMode === 'manual' && (
            <>
              <h3 className="text-xl font-semibold text-blue-800">Questions</h3>
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="border rounded-xl p-4 mb-6 bg-white shadow-md space-y-4">
                    <select className="w-full p-2 border rounded" value={question.type} onChange={(e) => updateQuestion(index, { ...question, type: e.target.value, options: ['', ''] })}>
                      <option value="multiplechoice">Multiple Choice</option>
                      <option value="radiobutton">Radio Button</option>
                      <option value="truefalse">True/False</option>
                      <option value="shortanswer">Short Answer</option>
                    </select>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-gray-700">Marks</label>
                      <input
                        type="number"
                        value={question.marks}
                        onChange={(e) => updateQuestion(index, { ...question, marks: Number(e.target.value) })}
                        className="px-4 py-2 border rounded-md shadow-inner focus:ring-2 focus:ring-blue-400 outline-none w-32"
                        placeholder="Enter marks"
                      />
                    </div>

                    <Textarea
                      className="w-full"
                      placeholder="Enter your question"
                      value={question.text}
                      onChange={(e) => updateQuestion(index, { ...question, text: e.target.value })}
                    />

                    {isValidType(question.type) === 'multiplechoice' && (
                      <MultipleChoiceQuestion question={question} index={index} updateQuestion={updateQuestion} handleDeleteOption={handleDeleteOption} handleAddOption={handleAddOption} />
                    )}

                    {isValidType(question.type) === 'radiobutton' && (
                      <RadioButtonQuestion question={question} index={index} updateQuestion={updateQuestion} handleDeleteOption={handleDeleteOption} handleAddOption={handleAddOption} />
                    )}

                    {isValidType(question.type) === 'truefalse' && (
                      <TrueFalseQuestion question={question} index={index} updateQuestion={updateQuestion} />
                    )}

                    {isValidType(question.type) === 'shortanswer' && (
                      <ShortAnswerQuestion question={question} index={index} updateQuestion={updateQuestion} />
                    )}
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={addQuestion}>➕ Add Question</Button>
            </>
          )}

          {formError && (
            <div className="text-red-600 bg-red-100 p-3 rounded text-sm font-medium">{formError}</div>
          )}

          <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 mt-6 shadow-md" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <div className="flex justify-center items-center gap-2">
                <Spinner /> <span>Submitting...</span>
              </div>
            ) : (
              '🚀 Submit Exam'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateExamDrawer;
