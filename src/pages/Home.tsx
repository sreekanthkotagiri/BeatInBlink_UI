import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import API from '../services/api';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'features' | 'pricing' | 'contact'>('about');

  useEffect(() => {
    const guestCode = localStorage.getItem('guestCode');
    if (guestCode) {
      navigate('/guest-home');
    }
  }, [navigate]);

  const handleGuestSubmit = async () => {
    if (!guestName.trim()) {
      alert('Please enter Name!');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/guest/register', {
        guestName,
        guestUUID: uuidv4(),
      });

      if (response.data && response.data.guestCode) {
        localStorage.setItem('guestCode', response.data.guestCode);
        localStorage.setItem('guestName', response.data.guestName);
        setShowGuestModal(false);
        navigate('/guest-home');
      } else {
        alert('Guest registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Guest registration error:', error);
      alert(`Something went wrong. Please try again. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Header */}
      <header className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 sticky top-0 z-10 h-24">
        <div className="w-full h-full flex justify-between items-center px-0">
          <div className="h-full pl-6 flex items-center">
            <img
              src="/beatinblink3.png"
              alt="BeatInBlink Logo"
              className="h-full object-contain"
              style={{ maxWidth: '320px' }}
            />
          </div>
          <nav className="flex items-center gap-4 pr-6">
            <Link
              to="/login"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Admin Login
            </Link>
            <button
              onClick={() => setShowGuestModal(true)}
              className="text-sm bg-yellow-400 text-blue-800 px-4 py-2 rounded hover:bg-yellow-300 transition"
            >
              Guest Access
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-16 bg-gray-50">
        <h2 className="text-5xl font-bold text-blue-800 mb-4">Welcome to BeatInBlink!</h2>
        <p className="text-lg text-gray-700 max-w-2xl">
          Empower your exams with speed, precision, and intelligence.
          Create, share, and evaluate — all in a blink!
        </p>
        <div className="mt-8 flex gap-6">
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            Admin Login
          </Link>
          <button
            onClick={() => setShowGuestModal(true)}
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            Explore as Guest
          </button>
        </div>
      </section>

      {/* Tab Section */}
      <section className="bg-white px-6 pt-10 text-center border-t border-gray-200">
        <div className="flex justify-center gap-6 mb-6">
          {['about', 'features', 'pricing', 'contact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-t-md font-semibold border-b-2 capitalize ${
                activeTab === tab ? 'text-blue-700 border-blue-700' : 'text-gray-500 border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto py-10 px-4 bg-gray-50 rounded-lg shadow-inner">
          {activeTab === 'about' && (
            <>
              <h3 className="text-3xl font-bold text-blue-700 mb-4">About BeatInBlink</h3>
              <p className="text-gray-700 text-lg">
                BeatInBlink is a modern platform designed to simplify exam management.
                Whether you're an educator, an institute, or an individual learner — you can create, share,
                and take exams quickly and effortlessly.
              </p>
            </>
          )}

          {activeTab === 'features' && (
            <>
              <h3 className="text-3xl font-bold text-green-700 mb-6">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                  <h4 className="text-xl font-bold mb-2 text-blue-800">Create Exams Instantly</h4>
                  <p className="text-gray-600">
                    Add questions manually or upload using CSV. Multiple types supported: MCQ, Radio, Short Answer, True/False.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                  <h4 className="text-xl font-bold mb-2 text-blue-800">Share Secure Links</h4>
                  <p className="text-gray-600">
                    Generate secure exam links automatically. Share them with your students easily!
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                  <h4 className="text-xl font-bold mb-2 text-blue-800">Instant Auto Evaluation</h4>
                  <p className="text-gray-600">
                    Students submit their exams, and scores are auto-calculated instantly.
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'pricing' && (
            <>
              <h3 className="text-3xl font-bold text-purple-700 mb-4">Pricing</h3>
              <p className="text-gray-700 text-lg">
                BeatInBlink is <span className="font-semibold text-green-600">currently free</span> for all users!
                We aim to keep core features accessible to everyone. However, premium features and pricing plans
                may be introduced in the future.
              </p>
            </>
          )}

          {activeTab === 'contact' && (
            <>
              <h3 className="text-3xl font-bold text-blue-700 mb-4">Contact Us</h3>
              <p className="text-gray-700 text-lg">
                📧 Email: <a href="mailto:contactbeatinblink@gmail.com" className="text-blue-600 underline">contactbeatinblink@gmail.com</a><br />
                📱 WhatsApp: <a href="https://wa.me/919030034384" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">+91 90300 34384</a>
              </p>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-blue-800 text-white mt-8">
        &copy; {new Date().getFullYear()} BeatInBlink. All Rights Reserved.
      </footer>

      {/* Guest Modal */}
      {showGuestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-80 space-y-6">
            <h2 className="text-2xl font-bold text-center text-blue-800">Guest Access</h2>
            <input
              type="text"
              placeholder="Enter your Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowGuestModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-full"
              >
                Cancel
              </button>
              <button
                onClick={handleGuestSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
