import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './admin/InstHeader';
import API from '../services/api';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/inst-register', form);
      if (res.status === 201 || res.status === 200) {
        setShowSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
            <button onClick={() => navigate('/login')} className="hover:underline">Login</button>
          </nav>
        </div>
      </header>
      <div className="flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-2 text-center text-blue-700">Create Institute Account</h2>
          <p className="text-sm text-center text-gray-500 mb-6">
            Only institute registrations are allowed. Students can be added by institutes after login.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Institute Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 border rounded-xl"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border rounded-xl"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>



            {/* <div>
              <select
                name="role"
                className="w-full px-4 py-2 border rounded-xl"
                value={form.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div> */}
            <div>
              <label>Address</label>
              <input
                type="text"
                name="address"
                className="w-full px-4 py-2 border rounded-xl"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 border rounded-xl"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
            >
              Sign Up
            </button>

            <div className="text-sm text-center mt-4">
              <button
                onClick={() => navigate('/login')}
                type="button"
                className="hover:underline text-blue-600"
              >
                Already have an account? Login
              </button>
            </div>
          </form>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-xl font-semibold text-green-600">Signup Successful!</h3>
            <p className="mt-2 text-gray-700">Redirecting to login page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
