import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import API from '../services/api';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPassword, setGuestPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const guestCode = localStorage.getItem('guestCode');
    if (guestCode) {
      navigate('/guest-home');
    }
  }, [navigate]);

  const handleGuestSubmit = async () => {
    if (!guestName.trim() || !guestPassword.trim()) {
      alert('Please enter both Name and Password!');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/guest/register', {
        guestName,
        guestPassword,
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
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* Header */}
      <header className="bg-blue-800 text-white py-6 px-6 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-yellow-400">BeatInBlink</span>
            </h1>
            <p className="text-sm font-light italic text-blue-100">
              Faster, Smarter, In a Blink
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link
              to="/login"
              className="text-sm bg-white text-blue-800 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
            >
              Admin Login
            </Link>
            <button
              onClick={() => setShowGuestModal(true)}
              className="text-sm bg-yellow-400 text-blue-800 px-4 py-2 rounded shadow hover:bg-yellow-300 transition"
            >
              Guest Access
            </button>
          </div>
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

      {/* About Section */}
      <section className="py-16 px-6 bg-white text-center">
        <h3 className="text-4xl font-bold text-blue-700 mb-6">About BeatInBlink</h3>
        <p className="max-w-4xl mx-auto text-gray-600 text-lg">
          BeatInBlink is a modern platform designed to simplify exam management.
          Whether you're an educator, an institute, or an individual learner — 
          you can create, share, and take exams quickly and effortlessly.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-100 text-center">
        <h3 className="text-4xl font-bold text-green-700 mb-6">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
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
            <input
              type="password"
              placeholder="Enter Password"
              value={guestPassword}
              onChange={(e) => setGuestPassword(e.target.value)}
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
