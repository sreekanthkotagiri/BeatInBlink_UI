// src/context/StudentContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StudentDetails {
  studentId: string;
  studentName: string;
  instituteName: string;
  totalExams: number;
  submitted: number;
  pending: number;
}

interface StudentContextType {
  studentName: string;
  setStudentName: (name: string) => void;
  enabledexams: any[];
  setEnabledExams: (exams: any[]) => void;
  studentdetails: StudentDetails;
  setSubmissionStats: (details: StudentDetails) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [studentName, setStudentName] = useState('');
  const [enabledexams, setEnabledExams] = useState<any[]>([]);
  const [studentdetails, setSubmissionStats] = useState<StudentDetails>({
    studentId: '',
    studentName: '',
    instituteName: '',
    totalExams: 0,
    submitted: 0,
    pending: 0
  });

  return (
    <StudentContext.Provider
      value={{
        studentName,
        setStudentName,
        enabledexams,
        setEnabledExams,
        studentdetails,
        setSubmissionStats
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};
