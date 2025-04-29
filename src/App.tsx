// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ManageExams from './pages/admin/ManageExams';
import InstituteHomePage from './pages/admin/InstituteHomePage';
import Results from './pages/admin/Results';
import CreateExamPage from './pages/admin/CreateExam';
import EditExamPage from './pages/admin/EditExam';
import ManageStudentAccessPage from './pages/admin/ManageStudentAccess';
import StudentHome from './pages/student/StudentHome';
import StudentExams from './pages/student/StudentExams';
import StudentResults from './pages/student/StudentResults';

import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedLayout from './layouts/RoleBasedLayout';
import AnnouncementPage from './pages/admin/AnnouncementPage';
import ManageExamsLayout from './pages/admin/ManageExams';
import StudentProfilePage from './pages/student/Profile';
import StudentTakeExamPage from './pages/student/submitExam';
import SampleTestPage from './pages/SampleTestPage';
import GuestHome from './pages/guest/GuestHome';
import GuestExamPage from './pages/guest/GuestExamPage';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/sample-test" element={<SampleTestPage />} />
          <Route path="/guest-home" element={<GuestHome />} />
          <Route path="/guest-exam/:examId" element={<GuestExamPage />} />

          {/* Protected Institute Pages */}
          <Route
            path="/institute/*"
            element={
              <ProtectedRoute role="institute">
                <RoleBasedLayout>
                  <Routes>
                    <Route path="home" element={<InstituteHomePage />} />
                    <Route path="exams" element={<ManageExams />} />
                    <Route path="results" element={<Results />} />
                    <Route path="createExam" element={<CreateExamPage />} />
                    <Route path="edit-exam/:examId" element={<EditExamPage />} />
                    <Route path="manage-exams" element={<ManageExamsLayout />} />
                    <Route path="managestudent" element={<ManageStudentAccessPage />} />
                    <Route path="announcementPage" element={<AnnouncementPage />} />
                  </Routes>
                </RoleBasedLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Student Pages */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute role="student">
                <RoleBasedLayout>
                  <StudentProvider>
                    <Routes>
                      <Route path="home" element={<StudentHome />} />
                      <Route path="exams" element={<StudentExams />} />
                      <Route path="results" element={<StudentResults />} />
                      <Route path="submitExam/:examId" element={<StudentTakeExamPage />} />
                      <Route path="profile" element={<StudentProfilePage />} />
                    </Routes>
                  </StudentProvider>
                </RoleBasedLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
