import React, { useEffect, useState } from 'react';
import '../../App.css';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './../../context/AuthContext';
import { Result } from '../../types/results';
import TopPerformersTab from './TopPerformersTab';
import StudentWiseReportTab from './StudentWiseReportTab';
import ExamSummaryTab from './ExamSummaryTab';
import AllResultsTab from './AllResultsTab';
import InstitutePageLayout from '../../components/layout/InstitutePageLayout';
import TabbedSection from '../../components/layout/TabbedSection';
import { ListChecks, Trophy, UserCircle2, BarChart3 } from 'lucide-react';

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

  const tabs = [
    { key: 'all', label: 'All Results', icon: ListChecks },
    { key: 'top', label: 'Top Performers', icon: Trophy },
    { key: 'student', label: 'Student-wise Report', icon: UserCircle2 },
    { key: 'summary', label: 'Exam-wise Summary', icon: BarChart3 },
  ] as const;

  type TabKey = typeof tabs[number]['key'];
  const [activeTab, setActiveTab] = useState<TabKey>('all');

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
    <InstitutePageLayout enabledTabs={['dashboard', 'manageStudents', 'manageExams', 'results', 'announcements']}>
      <TabbedSection<TabKey> tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'top' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <TopPerformersTab examList={examList} branchList={branchList} instituteId={instituteId} />
          </div>
        )}
        {activeTab === 'student' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <StudentWiseReportTab branchList={branchList} examList={examList} instituteId={instituteId} />
          </div>
        )}
        {activeTab === 'summary' && (
          <div className="bg-white p-6 rounded-xl shadow">
            <ExamSummaryTab examList={examList} branchList={branchList} instituteId={instituteId} />
          </div>
        )}
        {activeTab === 'all' && (
          <div className="bg-white p-6 rounded-xl shadow">
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
          </div>
        )}
      </div>
    </InstitutePageLayout>
  );
};

export default InstituteResultsPage;