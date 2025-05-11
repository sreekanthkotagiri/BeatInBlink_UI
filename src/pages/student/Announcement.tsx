import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import Sidebar from '../../components/ui/Sidebar';

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const storedInstitute = localStorage.getItem('student');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
    try {
      const res = await API.get(`/auth/student/announcements?instituteId=${institute.id}`);
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Failed to load announcements', err);
    }
  };

  return (
    <div className="institute-home bg-gray-50 min-h-screen">
      <div className="dashboard-container">
      <Sidebar enabledTabs={['studenthome','studentexams', 'studentresults', 'studentprofile','student-announcements']} />

        <main className="main-content p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">📢 Announcements</h2>

          <div className="space-y-6">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white p-5 rounded-xl shadow border">
                <h4 className="text-lg font-semibold text-blue-700 mb-1">{ann.title}</h4>
                <p className="text-gray-700 mb-2">{ann.content}</p>
                <p className="text-sm text-gray-400">Posted on: {new Date(ann.created_at).toLocaleString()}</p>
              </div>
            ))}
            {announcements.length === 0 && (
              <p className="text-gray-500 text-sm">No announcements yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnnouncementPage;
