import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import Sidebar from '../../components/ui/Sidebar';
import { Button, Input, Textarea } from '../../components/ui/input';

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
    const storedInstitute = localStorage.getItem('institute');
    const institute = storedInstitute ? JSON.parse(storedInstitute) : null;
    try {
      const res = await API.get(`/auth/institute/announcements?instituteId=${institute.id}`);
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Failed to load announcements', err);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) return;
    try {
      await API.post('/auth/institute/createAnnouncements', { title, message });
      setTitle('');
      setMessage('');
      fetchAnnouncements();
    } catch (err) {
      console.error('Failed to create announcement', err);
    }
  };

  return (
    <div className="institute-home bg-gray-50 min-h-screen">
      <div className="dashboard-container">
        <Sidebar enabledTabs={[
          'dashboard',
          'manageStudents',
          'manageExams',
          'results',
          'announcements']}
        />

        <main className="main-content p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">📢 Announcements</h2>

          <div className="max-w-3xl bg-white p-6 rounded-xl shadow mb-10">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Create New Announcement</h3>
            <Input
              placeholder="Title"
              className="mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Message"
              className="mb-4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
              Post Announcement
            </Button>
          </div>

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
