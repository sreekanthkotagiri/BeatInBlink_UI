import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { capitalizeFirstLetter } from '../utils/utils';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setUserType] = useState<'institute' | 'student'>('student');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await API.post('/auth/login', { email, password, role });
      const { token, refreshToken, user } = res.data;
      login(user, token);
      localStorage.setItem('refreshToken', refreshToken);
      navigate(`/${user.role}/home`);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#e2f0ff]">

      {/* Attractive Header */}



      <header className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 sticky top-0 z-10 h-24">
        <div className="w-full h-full flex justify-between items-center px-0">
          {/* Logo */}
          <div className="h-full pl-6 flex items-center">
            <img
              src="/beatinblink3.png"
              alt="BeatInBlink Logo"
              className="h-full object-contain"
              style={{ maxWidth: '320px' }}
            />
          </div>

          {/* Right side actions */}
          <nav className="flex items-center gap-4 pr-6">
            <button onClick={() => navigate('/')} className="hover:underline">Home</button>
            <button onClick={() => navigate('/signup')} className="hover:underline">Signup</button>
          </nav>
        </div>
      </header>

      {/* Login Section */}
      < div className="flex items-center justify-center py-16 mt-6" >
        <div className="bg-white p-10 rounded-2xl shadow-xl border w-full max-w-md">

          <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 text-center mb-8">Login to manage your exams and results</p>

          {/* Role Selector */}
          <div className="flex justify-center gap-4 mb-6 border rounded-lg p-1 bg-gray-100">
            {['institute', 'student'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setUserType(type as 'institute' | 'student')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${role === type
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-white'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{capitalizeFirstLetter(role)} Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition flex justify-center items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Login
            </button>

            <div className="flex justify-between text-sm text-gray-600 mt-4">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="hover:underline"
              >
                Create account
              </button>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </form>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <p className="text-center text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()} BeatInBlink. All rights reserved.
          </p>
        </div>
      </div >
    </div >
  );
};

export default Login;
