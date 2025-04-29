import { ChangeEvent } from "react";
import Papa from "papaparse";
import { isValidType } from "../utils/utils";

type Question = {
  text: string;
  questionText: string;
  type: "multiplechoice" | "truefalse" | "shortanswer" | "radiobutton";
  options?: string[];
  correctAnswer: string;
  marks: number;
};

interface QuestionFormProps {
  onUpload: (questions: Question[]) => void;
}

const QuestionForm = ({ onUpload }: QuestionFormProps) => {
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (result) => {
          const parsedData = result.data as string[][];

          const rows = parsedData.slice(1); // skip header row

          const newQuestions: Question[] = rows
            .filter((row) =>
              row.length >= 8 &&
              row[1]?.trim() !== '' &&
              row[6]?.trim() !== '' &&
              !isNaN(Number(row[7]))
            )
            .map((row) => {
              const rawType = row[0]?.trim();
              const text = row[1]?.trim();
              const correctAnswer = row[6]?.replace(/^"|"$/g, '').trim();

              const options =
              isValidType(rawType) === "multiplechoice" || isValidType(rawType) === "radiobutton"
                  ? row.slice(2, 6).map((opt) => opt?.trim() || '')
                  : undefined;

              return {
                type: rawType as Question["type"],
                text,
                questionText: text, // ✅ Added this to support downstream rendering
                options,
                correctAnswer,
                marks: Number(row[7]),
              };
            });

          onUpload(newQuestions);
        }
      });
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium">Upload Questions via CSV</label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="border p-2 rounded w-full"
      />
    </div>
  );
};

export default QuestionForm;
