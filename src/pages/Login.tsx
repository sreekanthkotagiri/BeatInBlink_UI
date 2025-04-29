import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import PublicHeader from './PublicHeader';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setUserType] = useState<'institute' | 'student'>('institute');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await API.post('/auth/login', { email, password, role });
      const { token, refreshToken, user } = res.data;

      // Call the context login method here ✅
      login(user, token);

      // Optional: if your backend returns refreshToken too
      localStorage.setItem('refreshToken', refreshToken);
      // Navigate to role-specific page
      navigate(`/${user.role}/home`);
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <PublicHeader />

      <div className="flex items-center justify-center py-16">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

          {/* Toggle Role */}
          <div className="flex justify-center gap-4 mb-6">
            {['institute', 'student'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setUserType(type as 'institute' | 'student')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${role === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            >
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
        </div>
      </div>
    </div>
  );

};

export default Login;
