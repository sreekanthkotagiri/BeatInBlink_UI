export type Exam = {
    id: number;
    title: string;
    branch?: string;
    scheduled_date: string;
    pass_percentage: number;
    duration_min?: number;
    correctAnswer?: string;
    marks?: number;
    enabled: boolean;
  };

export type Question = {
  text: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  marks: number;
};

export type ExamsWithQuestion = {
  id: number;
  title: string;
  branch?: string;
  scheduled_date: string;
  pass_percentage: number;
  duration_min?: number;
  correctAnswer?: string;
  marks?: number;
  enabled: boolean;
  questions : Question[],
};