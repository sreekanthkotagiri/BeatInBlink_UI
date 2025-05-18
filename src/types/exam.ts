export interface Exam {
  id: number;
  title: string;
  created_at: string;
  expires_at?: string;
  duration_min: number;
  pass_percentage: number;
  description: string;
  is_enabled: 'enabled' | 'disabled';
  restrict_access?: boolean;
  result_locked: boolean;
  time_limit_enabled?: boolean;
  questions?: Question[];
}


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
  enable_time_limit: boolean;
  restrict_access: boolean;
  correctAnswer?: string;
  marks?: number;
  enabled: boolean;
  questions : GuestQuestion[],
};

export type GuestExamsWithQuestion = {
  id: number;
  title: string;
  branch?: string;
  scheduled_date: string;
  pass_percentage: number;
  duration_min?: number;
  enable_time_limit: boolean;
  restrict_access: boolean;
  correctAnswer?: string;
  marks?: number;
  enabled: boolean;
  questions : GuestQuestion[],
};

export type GuestQuestion = {
  id: string; //
  text: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  marks: number;
};