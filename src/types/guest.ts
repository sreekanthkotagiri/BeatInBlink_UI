export interface CreateExamDrawerProps {
    isOpen?: boolean;
    onClose?: () => void;
    title: string;
    setTitle: (value: string) => void;
    scheduledDate: string;
    setScheduledDate: (value: string) => void;
    expiryDate: string;
    setExpiryDate: (value: string) => void;
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
    // New fields to pass to API
    sendTimeLimitToApi?: boolean;
    sendCursorLockToApi?: boolean;
    readOnly?: boolean;
  }
  