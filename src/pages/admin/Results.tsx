import React, { useEffect, useState } from 'react';
import '../../App.css';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../context/AuthContext';
import Sidebar from '../../components/ui/Sidebar';


const InstituteResultsPage = () => {
  type Results ={
    examid: number,
    examtitle: string,
    studentname: string,
    branch: string
    score: string,
    status: string
  }
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [results, setResults] = useState<Results[]>([]);
  const [instituteName, setInstituteName] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      const storedInstitute = localStorage.getItem('institute');
      const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
      setInstituteName(institute?.name || '');
      if (!institute || !institute.id) return;

      try {
        const results = await API.get(`/auth/results?instituteId=${institute.id}`);
        setResults(results.data);
      } catch (err) {
        console.error('Failed to fetch results:', err);
      }
    };

    fetchResults();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('institute');
    logout();
    navigate('/login');
  };

  return (
    <div className="institute-home">

      <div className="dashboard-container">

      <Sidebar
          enabledTabs={[
            'dashboard',
            'manageStudents',
            'manageExams',
            'results',
            'announcements',
          ]}
        />

        <main className="main-content">
          <h2>Exam Results</h2>

          <table className="w-full border mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Exam ID</th>
                <th className="p-2 border">Exam Title</th>
                <th className="p-2 border">Student Name</th>
                <th className="p-2 border">Branch</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((res, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-2 border">{res.examid}</td>
                    <td className="p-2 border">{res.examtitle}</td>
                    <td className="p-2 border">{res.studentname}</td>
                    <td className="p-2 border">{res.branch}</td>
                    <td className="p-2 border">{res.score}</td>
                    <td className="p-2 border">{res.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-2 text-center">No results available</td>
                </tr>
              )}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default InstituteResultsPage;
