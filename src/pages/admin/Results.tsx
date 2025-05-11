// Moved All Results tab into a separate component for modularity
import React, { useEffect, useState } from 'react';
import '../../App.css';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../context/AuthContext';
import Sidebar from '../../components/ui/Sidebar';
import TopPerformersTab from './TopPerformersTab';
import StudentWiseReportTab from './StudentWiseReportTab';
import ExamSummaryTab from './ExamSummaryTab';
import AllResultsTab from './AllResultsTab';
import { Result } from '../../types/results';

const InstituteResultsPage = () => {
  

  const navigate = useNavigate();
  const { logout } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [instituteName, setInstituteName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [branchList, setBranchList] = useState<string[]>([]);
  const [examList, setExamList] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [instituteId, setInstituteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [activeTab, setActiveTab] = useState<'all' | 'top' | 'student' | 'summary'>('all');

  useEffect(() => {
    const storedInstitute = localStorage.getItem('institute');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
    if (institute?.id) {
      setInstituteName(institute.name || '');
      setInstituteId(institute.id);
      fetchResults(institute.id, page);
    }
  }, [page]);

  const fetchResults = async (instituteId: number, currentPage: number) => {
    try {
      const params = new URLSearchParams({
        instituteId: instituteId.toString(),
        page: currentPage.toString(),
        limit: limit.toString(),
        search: searchTerm,
        branch: selectedBranch,
        examTitle: selectedExam
      });

      const response = await API.get(`/auth/institute/allResults?${params.toString()}`);
      const data = response.data;

      setResults(data.results || []);
      setTotalCount(data.totalCount || 0);

      const uniqueBranches = [...new Set(data.results.map((r: Result) => r.branch))] as string[];
      const uniqueExams = [...new Set(data.results.map((r: Result) => r.examtitle))] as string[];

      setBranchList(uniqueBranches);
      setExamList(uniqueExams);
    } catch (err) {
      console.error('Failed to fetch results:', err);
    }
  };

  const applyFilters = () => {
    const storedInstitute = localStorage.getItem('institute');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
    if (institute?.id) {
      setPage(1);
      fetchResults(institute.id, 1);
    }
  };

  return (
    <div className="institute-home bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="dashboard-container">
        <Sidebar enabledTabs={['dashboard', 'manageStudents', 'manageExams', 'results', 'announcements']} />

        <main className="main-content p-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            {/* Horizontal Tabs */}
            <div className="flex gap-6 mb-6 border-b">
              {['all', 'top', 'student', 'summary'].map((tab) => (
                <button
                  key={tab}
                  className={`pb-2 border-b-4 capitalize ${activeTab === tab
                    ? 'border-blue-600 text-blue-800 font-semibold'
                    : 'border-transparent text-gray-600'
                    }`}
                  onClick={() => setActiveTab(tab as any)}
                >
                  {tab === 'all' && 'All Results'}
                  {tab === 'top' && 'Top Performers'}
                  {tab === 'student' && 'Student-wise Report'}
                  {tab === 'summary' && 'Exam-wise Summary'}
                </button>
              ))}
            </div>

            {activeTab === 'top' && (
              <TopPerformersTab
                examList={examList}
                branchList={branchList}
                instituteId={instituteId}
              />
            )}
            {activeTab === 'student' && (
              <StudentWiseReportTab
                branchList={branchList}
                examList={examList}
                instituteId={instituteId}
              />
            )}
            {activeTab === 'summary' && (
              <ExamSummaryTab
                examList={examList}
                branchList={branchList}
                instituteId={instituteId}
              />
            )}
            {activeTab === 'all' && (
              <AllResultsTab
                results={results}
                totalCount={totalCount}
                searchTerm={searchTerm}
                selectedBranch={selectedBranch}
                selectedExam={selectedExam}
                branchList={branchList}
                examList={examList}
                page={page}
                setPage={setPage}
                applyFilters={applyFilters}
                setSearchTerm={setSearchTerm}
                setSelectedBranch={setSelectedBranch}
                setSelectedExam={setSelectedExam}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstituteResultsPage;
