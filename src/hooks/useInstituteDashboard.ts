import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Exam } from '../types/exam';
import { Alert, Submission } from '../types/dashboard';

export const useInstituteDashboard = () => {
  const [dashboard, setDashboard] = useState({
    studentsCount: 0,
    examsCount: 0,
    submissionsCount: 0,
    upcomingExams: [] as Exam[],
    recentSubmissions: [] as Submission[],
    systemAlerts: [] as Alert[],
  });

  const { authState, logout, isAuthenticated, isAuthInitialized } = useAuth();
  const navigate = useNavigate();
  const instituteUser = authState.institute;

  useEffect(() => {
    if (!isAuthInitialized || !instituteUser) return;

    const fetchDashboard = async () => {
      if (!isAuthenticated || authState.currentRole !== 'institute') {
        logout();
        navigate('/login');
        return;
      }

      try {
        const res = await API.get(`/auth/institute?instituteId=${instituteUser.id}`);
        setDashboard({
          studentsCount: res.data.studentsCount || 0,
          examsCount: res.data.examsCount || 0,
          submissionsCount: res.data.submissionsCount || 0,
          upcomingExams: res.data.upcomingExams || [],
          recentSubmissions: res.data.recentSubmissions || [],
          systemAlerts: res.data.systemAlerts || [],
        });
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      }
    };

    fetchDashboard();
  }, [authState, isAuthenticated, isAuthInitialized, logout, navigate, instituteUser]);

  return dashboard;
};