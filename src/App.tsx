// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import InstituteHomePage from './pages/admin/InstituteHomePage';
import Results from './pages/admin/Results';
import ManageStudentAccessPage from './pages/admin/ManageStudentAccess';
import StudentHome from './pages/student/StudentHome';
import StudentExams from './pages/student/StudentExams';
import StudentResults from './pages/student/StudentResults';

import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedLayout from './layouts/RoleBasedLayout';
import AnnouncementPage from './pages/admin/AnnouncementPage';
import StudentProfilePage from './pages/student/Profile';
import StudentTakeExamPage from './pages/student/submitExam';
import SampleTestPage from './pages/SampleTestPage';
import GuestHome from './pages/guest/GuestHome';
import GuestExamPage from './pages/guest/GuestExamPage';
import ManageExamsPage from './pages/admin/ManageExamsPage';
import Announcement from './pages/student/Announcement';


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
                    <Route path="results" element={<Results />} />
                    <Route path="manage-exams" element={<ManageExamsPage />} />
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
                      <Route path="announcements" element={<Announcement/>} />
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
