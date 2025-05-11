import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/forgot-password', {
        email,
      });
      setMessage(response.data.message || 'Reset link sent to your email');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">EduExamine</h1>
        <nav className="space-x-6 text-sm font-medium">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/signup" className="text-gray-700 hover:text-blue-600">Sign Up</Link>
        </nav>
      </header>

      {/* Forgot Password Form */}
      <div className="flex justify-center items-center py-20 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-blue-700">Forgot Password</h2>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {message && <p className="text-green-600 text-sm">{message}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              Send Reset Link
            </button>
          </form>

          <p className="mt-4 text-sm text-center">
            Back to <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
