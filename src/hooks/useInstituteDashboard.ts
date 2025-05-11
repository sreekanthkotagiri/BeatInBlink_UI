import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useInstituteDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalStudents: 0,
    totalExams: 0,
    examsEnabled: 0,
    examsToday: 0,
    recentExams: []
  });

  const { authState, logout, isAuthenticated, isAuthInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthInitialized) return;
    const storedInstitute = localStorage.getItem('institute');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
    if (!institute || !institute.id) {
      console.error('No institute ID found');
      return;
    }

    const fetchDashboard = async () => {
      if (!isAuthenticated || authState.currentRole !== 'institute') {
        logout();
        navigate('/login');
        return;
      }

      try {
        const res = await API.get(`/auth/institute?instituteId=${institute.id}`);
        setDashboard({
          totalStudents: res.data.totalStudents || 0,
          totalExams: res.data.totalExams || 0,
          examsEnabled: res.data.examsEnabled || 0,
          examsToday: res.data.examsToday || 0,
          recentExams: res.data.recentExams,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      }
    };

    fetchDashboard();
  }, [authState, isAuthenticated, isAuthInitialized, logout, navigate]);

  return dashboard;
};