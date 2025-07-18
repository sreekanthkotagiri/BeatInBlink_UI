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
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-cyan-50/50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <div className="space-y-6 relative z-10">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
              BeatInBlink
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 font-light max-w-3xl mx-auto leading-relaxed">
              Transform your examination experience with lightning-fast creation, 
              seamless sharing, and intelligent evaluation
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-16 relative z-10">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Lightning Fast</h3>
              <p className="text-slate-600 text-base leading-relaxed">Create comprehensive exams in minutes, not hours</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Smart Evaluation</h3>
              <p className="text-slate-600 text-base leading-relaxed">Automatic grading with detailed performance insights</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Secure & Reliable</h3>
              <p className="text-slate-600 text-base leading-relaxed">Enterprise-grade security for all your examinations</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-10">
            <Link
              to="/login"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex items-center gap-3 text-lg"
            >
              <span>Get Started</span>
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <button
              onClick={() => setShowGuestModal(true)}
              className="group bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 font-bold px-10 py-5 rounded-full border-2 border-slate-200 hover:border-slate-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 flex items-center gap-3 text-lg"
            >
              <span>Try Demo</span>
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Tab Section */}
      <section className="bg-gradient-to-b from-white/80 to-slate-50/80 backdrop-blur-sm border-t border-blue-100 px-6 py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30"></div>
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10">
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
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl scale-105'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-10 md:p-16 relative z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 rounded-3xl"></div>
            {activeTab === 'about' && (
              <div className="text-center space-y-8 relative z-10">
                <h3 className="text-3xl font-bold text-slate-800 mb-6">About BeatInBlink</h3>
                <p className="text-xl text-slate-700 leading-relaxed max-w-4xl mx-auto">
                  BeatInBlink revolutionizes the way educational institutions and individuals approach 
                  examination management. Our platform combines cutting-edge technology with intuitive 
                  design to deliver a seamless experience for both educators and students.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                  <div className="text-left space-y-4">
                    <h4 className="text-2xl font-bold text-slate-800 mb-6">For Educators</h4>
                    <ul className="space-y-4 text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                        Create diverse question types effortlessly
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                        Automated grading and detailed analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
                        Secure exam environment with anti-cheating measures
                      </li>
                    </ul>
                  </div>
                  <div className="text-left space-y-4">
                    <h4 className="text-2xl font-bold text-slate-800 mb-6">For Students</h4>
                    <ul className="space-y-4 text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
                        Intuitive and user-friendly interface
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
                        Instant results and performance feedback
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
                        Accessible from any device, anywhere
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-10 relative z-10">
                <h3 className="text-4xl font-bold text-slate-800 text-center mb-16">Powerful Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                    <div key={index} className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/30 group hover:-translate-y-2 hover:scale-105">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <span className="text-2xl">{feature.icon}</span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h4>
                      <p className="text-slate-700 text-base leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="text-center space-y-10 relative z-10">
                <h3 className="text-4xl font-bold text-slate-800 mb-8">Simple, Transparent Pricing</h3>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-12 border-2 border-emerald-200 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-3xl"></div>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-full text-base font-bold mb-6 shadow-lg relative z-10">
                    <span>🎉</span>
                    <span>Limited Time Offer</span>
                  </div>
                  <h4 className="text-5xl font-bold text-emerald-700 mb-4 relative z-10">Free Forever</h4>
                  <p className="text-xl text-slate-700 mb-8 relative z-10">
                    All core features are completely free for educational institutions and individual users
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto relative z-10">
                    <div className="text-left">
                      <h5 className="font-bold text-slate-800 mb-4 text-lg">What's Included:</h5>
                      <ul className="space-y-3 text-slate-700">
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-600 text-lg">✓</span>
                          Unlimited exams and questions
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-600 text-lg">✓</span>
                          All question types supported
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-600 text-lg">✓</span>
                          Automated grading and analytics
                        </li>
                      </ul>
                    </div>
                    <div className="text-left">
                      <h5 className="font-bold text-slate-800 mb-4 text-lg">Premium Features:</h5>
                      <ul className="space-y-3 text-slate-700">
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-600 text-lg">✓</span>
                          Advanced security features
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-600 text-lg">✓</span>
                          Priority support
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-emerald-600 text-lg">✓</span>
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
              <div className="text-center space-y-10 relative z-10">
                <h3 className="text-4xl font-bold text-slate-800 mb-8">Get in Touch</h3>
                <p className="text-xl text-slate-700 mb-12">
                  Have questions or need support? We're here to help you succeed.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">
                  <a
                    href="mailto:contactbeatinblink@gmail.com"
                    className="group bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-3xl p-8 border-2 border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-3">Email Support</h4>
                    <p className="text-blue-600 font-semibold text-lg">contactbeatinblink@gmail.com</p>
                  </a>

                  <a
                    href="https://wa.me/919030034384"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-3xl p-8 border-2 border-emerald-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.108"/>
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-3">WhatsApp</h4>
                    <p className="text-emerald-600 font-semibold text-lg">+91 90300 34384</p>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20"></div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
            <div className="col-span-1 md:col-span-2">
              <img
                src="/beatinblink3.png"
                alt="BeatInBlink Logo"
                className="h-10 object-contain mb-4 brightness-0 invert"
              />
              <p className="text-slate-300 leading-relaxed max-w-md text-lg">
                Revolutionizing examination management with cutting-edge technology 
                and intuitive design for educational excellence.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3 text-slate-300">
                <li><Link to="/login" className="hover:text-white transition-colors">Admin Login</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><button onClick={() => setShowGuestModal(true)} className="hover:text-white transition-colors">Guest Access</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-slate-300">
                <li><a href="mailto:contactbeatinblink@gmail.com" className="hover:text-white transition-colors">Email Support</a></li>
                <li><a href="https://wa.me/919030034384" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-300 relative z-10">
            <p className="text-lg">&copy; {new Date().getFullYear()} BeatInBlink. All rights reserved. Made with ❤️ for education.</p>
          </div>
        </div>
      </footer>

      {/* Enhanced Guest Modal */}
      {showGuestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 border border-white/20">
            <div className="p-10 space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Welcome, Guest!</h2>
                <p className="text-slate-600 text-lg">Enter your name to start exploring BeatInBlink</p>
              </div>

              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleGuestSubmit()}
                />
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowGuestModal(false)}
                    className="flex-1 px-6 py-4 text-slate-600 border-2 border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors duration-200 font-semibold text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGuestSubmit}
                    disabled={loading || !guestName.trim()}
                    className="flex-1 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold px-6 py-4 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Starting...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-500">
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