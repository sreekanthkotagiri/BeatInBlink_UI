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


export interface CreateExamDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  title: string;
  setTitle: (value: string) => void;
  scheduledDate: string;
  setScheduledDate: (value: string) => void;
  showExpiryDate?: boolean;
  setShowExpiryDate?: (val: boolean) => void;
  expiryDate?: string;
  setExpiryDate?: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  durationMin: number;
  setDurationMin: (value: number) => void;
  passPercentage: number;
  setPassPercentage: (value: number) => void;
  questions: any[];
  setQuestions: (questions: any[]) => void;
  questionMode: 'manual' | 'upload' | null;
  setQuestionMode: (mode: 'manual' | 'upload' | null) => void;
  handleSubmit: () => void;
  submitting: boolean;
  formError: string;
  addQuestion: () => void;
  updateQuestion: (index: number, question: any) => void;
  handleDeleteOption: (questionIndex: number, optionIndex: number) => void;
  handleAddOption: (index: number) => void;
  enableTimeLimit: boolean;
  setEnableTimeLimit: (value: boolean) => void;
  restrictAccess: boolean;
  setRestrictAccess: (value: boolean) => void;
  resultLocked?: boolean;
  setResultLocked?: (value: boolean) => void;
  // New fields to pass to API
  sendTimeLimitToApi?: boolean;
  sendCursorLockToApi?: boolean;
  readOnly?: boolean;
  downloadable?: boolean;
  setDownloadable?: (value: boolean) => void;
}
