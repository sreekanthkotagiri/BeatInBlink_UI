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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/beatinblink3.png"
              alt="BeatInBlink Logo"
              className="h-12 object-contain"
            />
          </div>
          <nav className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
            >
              Admin Login
            </Link>
            <button
              onClick={() => setShowGuestModal(true)}
              className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-medium px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Try as Guest
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
              BeatInBlink
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
              Transform your examination experience with lightning-fast creation, 
              seamless sharing, and intelligent evaluation
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Lightning Fast</h3>
              <p className="text-slate-600 text-sm">Create comprehensive exams in minutes, not hours</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Smart Evaluation</h3>
              <p className="text-slate-600 text-sm">Automatic grading with detailed performance insights</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Secure & Reliable</h3>
              <p className="text-slate-600 text-sm">Enterprise-grade security for all your examinations</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>Get Started</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <button
              onClick={() => setShowGuestModal(true)}
              className="group bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 font-semibold px-8 py-4 rounded-full border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>Try Demo</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Tab Section */}
      <section className="bg-white/50 backdrop-blur-sm border-t border-blue-100 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { key: 'about', label: 'About', icon: '🎯' },
              { key: 'features', label: 'Features', icon: '⚡' },
              { key: 'pricing', label: 'Pricing', icon: '💎' },
              { key: 'contact', label: 'Contact', icon: '📞' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 md:p-12">
            {activeTab === 'about' && (
              <div className="text-center space-y-6">
                <h3 className="text-3xl font-bold text-slate-800 mb-6">About BeatInBlink</h3>
                <p className="text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto">
                  BeatInBlink revolutionizes the way educational institutions and individuals approach 
                  examination management. Our platform combines cutting-edge technology with intuitive 
                  design to deliver a seamless experience for both educators and students.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="text-left space-y-4">
                    <h4 className="text-xl font-semibold text-slate-800">For Educators</h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Create diverse question types effortlessly
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Automated grading and detailed analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Secure exam environment with anti-cheating measures
                      </li>
                    </ul>
                  </div>
                  <div className="text-left space-y-4">
                    <h4 className="text-xl font-semibold text-slate-800">For Students</h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Intuitive and user-friendly interface
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Instant results and performance feedback
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Accessible from any device, anywhere
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-slate-800 text-center mb-12">Powerful Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'Multiple Question Types',
                      description: 'Support for MCQ, True/False, Short Answer, and Radio Button questions',
                      icon: '📝',
                      gradient: 'from-blue-500 to-cyan-500'
                    },
                    {
                      title: 'Bulk Import',
                      description: 'Import questions via CSV for quick exam setup',
                      icon: '📊',
                      gradient: 'from-emerald-500 to-teal-500'
                    },
                    {
                      title: 'Real-time Monitoring',
                      description: 'Track student progress and prevent cheating attempts',
                      icon: '👁️',
                      gradient: 'from-purple-500 to-pink-500'
                    },
                    {
                      title: 'Automated Grading',
                      description: 'Instant evaluation with detailed performance analytics',
                      icon: '⚡',
                      gradient: 'from-orange-500 to-red-500'
                    },
                    {
                      title: 'Secure Environment',
                      description: 'Advanced security measures to maintain exam integrity',
                      icon: '🔒',
                      gradient: 'from-indigo-500 to-purple-500'
                    },
                    {
                      title: 'Mobile Responsive',
                      description: 'Perfect experience across all devices and screen sizes',
                      icon: '📱',
                      gradient: 'from-pink-500 to-rose-500'
                    }
                  ].map((feature, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group hover:-translate-y-1">
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-xl">{feature.icon}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="text-center space-y-8">
                <h3 className="text-3xl font-bold text-slate-800 mb-6">Simple, Transparent Pricing</h3>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <span>🎉</span>
                    <span>Limited Time Offer</span>
                  </div>
                  <h4 className="text-4xl font-bold text-emerald-700 mb-2">Free Forever</h4>
                  <p className="text-lg text-slate-600 mb-6">
                    All core features are completely free for educational institutions and individual users
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <div className="text-left">
                      <h5 className="font-semibold text-slate-800 mb-3">What's Included:</h5>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-500">✓</span>
                          Unlimited exams and questions
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-500">✓</span>
                          All question types supported
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-500">✓</span>
                          Automated grading and analytics
                        </li>
                      </ul>
                    </div>
                    <div className="text-left">
                      <h5 className="font-semibold text-slate-800 mb-3">Premium Features:</h5>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-500">✓</span>
                          Advanced security features
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-500">✓</span>
                          Priority support
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-500">✓</span>
                          Custom branding options
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 italic">
                  Premium features and enterprise plans will be available in future updates
                </p>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="text-center space-y-8">
                <h3 className="text-3xl font-bold text-slate-800 mb-6">Get in Touch</h3>
                <p className="text-lg text-slate-600 mb-8">
                  Have questions or need support? We're here to help you succeed.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                  <a
                    href="mailto:contactbeatinblink@gmail.com"
                    className="group bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-2xl p-6 border border-blue-200 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Email Support</h4>
                    <p className="text-blue-600 font-medium">contactbeatinblink@gmail.com</p>
                  </a>

                  <a
                    href="https://wa.me/919030034384"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-2xl p-6 border border-emerald-200 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.108"/>
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">WhatsApp</h4>
                    <p className="text-emerald-600 font-medium">+91 90300 34384</p>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img
                src="/beatinblink3.png"
                alt="BeatInBlink Logo"
                className="h-10 object-contain mb-4 brightness-0 invert"
              />
              <p className="text-slate-400 leading-relaxed max-w-md">
                Revolutionizing examination management with cutting-edge technology 
                and intuitive design for educational excellence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Admin Login</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><button onClick={() => setShowGuestModal(true)} className="hover:text-white transition-colors">Guest Access</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="mailto:contactbeatinblink@gmail.com" className="hover:text-white transition-colors">Email Support</a></li>
                <li><a href="https://wa.me/919030034384" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} BeatInBlink. All rights reserved. Made with ❤️ for education.</p>
          </div>
        </div>
      </footer>

      {/* Enhanced Guest Modal */}
      {showGuestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="p-8 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome, Guest!</h2>
                <p className="text-slate-600">Enter your name to start exploring BeatInBlink</p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleGuestSubmit()}
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGuestModal(false)}
                    className="flex-1 px-4 py-3 text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGuestSubmit}
                    disabled={loading || !guestName.trim()}
                    className="flex-1 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-300 disabled:to-slate-400 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Starting...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-500">
                  By continuing, you agree to our terms of service and privacy policy
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;