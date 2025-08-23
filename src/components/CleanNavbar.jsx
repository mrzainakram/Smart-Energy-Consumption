import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';


const CleanNavbar = ({ user, onLogout, openSECPARS }) => {
  const { language, setLanguage, translate } = useLanguage();

  const [showContact, setShowContact] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Theme effect
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
      document.body.style.fontWeight = '600';
      setTimeout(() => {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          if (!el.classList.contains('bg-clip-text')) {
            el.style.color = '#000000';
            el.style.fontWeight = '600';
          }
        });
      }, 100);
      showThemeNotification('Light Mode');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
      document.body.style.fontWeight = 'normal';
      setTimeout(() => {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          el.style.color = '';
          el.style.fontWeight = '';
        });
      }, 100);
      showThemeNotification('Dark Mode');
    }
  }, [isDarkMode]);

  const showThemeNotification = (themeName) => {
    const existingNotification = document.querySelector('.theme-notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.textContent = `Theme changed to ${themeName}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isDarkMode ? '#ffffff' : '#1f2937'};
      color: ${isDarkMode ? '#1e293b' : '#ffffff'};
      padding: 12px 20px;
      border-radius: 8px;
      border: 1px solid ${isDarkMode ? '#e2e8f0' : '#374151'};
      z-index: 9999;
      font-size: 14px;
      box-shadow: 0 4px 6px ${isDarkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.5)'};
      animation: slideIn 0.3s ease-out;
    `;
    if (!document.querySelector('#theme-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'theme-notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <>
      {/* CSS Styles for Theme Switching */}
      <style jsx>{`
        .light-theme {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        
        .light-theme .bg-gray-900\\/60,
        .light-theme .bg-gray-800\\/50,
        .light-theme .bg-gray-900\\/80,
        .light-theme .bg-gray-800,
        .light-theme .bg-gray-900,
        .light-theme .bg-black,
        .light-theme .bg-gray-800\\/30,
        .light-theme .bg-gray-700,
        .light-theme .bg-gray-600,
        .light-theme nav,
        .light-theme header {
          background-color: #f8fafc !important;
          color: #000000 !important;
          border-color: #d1d5db !important;
          font-weight: 600 !important;
        }
        
        .light-theme .text-white,
        .light-theme .text-gray-300,
        .light-theme .text-gray-400,
        .light-theme .text-gray-200,
        .light-theme .text-gray-100 {
          color: #000000 !important;
          font-weight: 700 !important;
          text-shadow: 0 0 1px rgba(0,0,0,0.1) !important;
        }
        
        .light-theme input,
        .light-theme select,
        .light-theme textarea {
          background-color: #ffffff !important;
          color: #000000 !important;
          border-color: #374151 !important;
          border-width: 2px !important;
          font-weight: 600 !important;
        }
        
        .light-theme .bg-gradient-to-r {
          background: linear-gradient(to right, #e5e7eb, #d1d5db) !important;
          color: #000000 !important;
          font-weight: 700 !important;
        }
        
        /* Navbar specific light mode styles */
        .light-theme nav {
          background-color: #f1f5f9 !important;
          border-color: #cbd5e1 !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Button text in light mode */
        .light-theme button {
          color: #000000 !important;
          font-weight: 700 !important;
          text-shadow: 0 0 1px rgba(0,0,0,0.2) !important;
        }
        
        /* Dashboard cards in light mode */
        .light-theme .bg-gray-800\\/60,
        .light-theme .bg-gray-800\\/30,
        .light-theme .bg-gray-800\\/20 {
          background-color: #ffffff !important;
          border: 2px solid #e5e7eb !important;
          color: #000000 !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Special handling for dashboard text */
        .light-theme h1,
        .light-theme h2,
        .light-theme h3,
        .light-theme h4,
        .light-theme h5,
        .light-theme h6 {
          color: #000000 !important;
          font-weight: 800 !important;
          text-shadow: 0 0 2px rgba(0,0,0,0.1) !important;
        }
        
        /* Dashboard content text */
        .light-theme p,
        .light-theme span,
        .light-theme div {
          color: #000000 !important;
          font-weight: 600 !important;
        }
        
        /* Force all text elements to be dark and bold */
        .light-theme * {
          color: #000000 !important;
          font-weight: 600 !important;
        }
        
        /* Exception for gradient text */
        .light-theme .bg-clip-text {
          background: linear-gradient(to right, #1e40af, #7c3aed, #db2777, #0891b2) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          color: transparent !important;
          font-weight: 900 !important;
          text-shadow: none !important;
        }
      `}</style>

      {/* Fresh Clean Navbar - Matching User's Image Design */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl"
      >
        {/* Main Navigation Bar - Single Row, Clean Layout */}
        <nav className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-0">
            
            {/* Left Section - Logo + Active User + Time */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap sm:flex-nowrap">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">⚡</span>
              </div>
              
              {/* Active User Button */}
              <div className="w-auto sm:w-full h-10 sm:h-12 text-center bg-gray-900/80 rounded-xl px-2 sm:px-4 py-2 sm:py-3 border-2 border-indigo-400 shadow-lg flex items-center justify-center space-x-2 sm:space-x-4 hover:shadow-indigo-400/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <div className="flex flex-row w-full items-center justify-center space-x-4">
                  <div className="text-xs sm:text-sm text-indigo-600 font-bold hidden sm:block" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)' }}>
                    Active User:
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)' }}>
                    {user?.email ? user.email.split('@')[0] : 'User'}
                  </div>
                  <div className="text-green-400 text-sm font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)' }}>●</div>
                </div>
              </div>

              {/* Current Time - 3D Styled */}
              <div className="w-auto sm:w-full h-10 sm:h-12 flex items-center justify-center space-x-1 sm:space-x-2 bg-gray-900/80 border-2 border-orange-400 rounded-xl shadow-lg hover:shadow-orange-400/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 ml-0 mr-1">
                <span className="text-white text-xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)' }}>🕒</span>
                <span className="text-white font-mono font-bold text-base" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)' }}>
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
            
            {/* Center Section - Main Buttons */}
            <div className="flex items-center flex-wrap gap-1 sm:gap-0">

              {/* Language Dropdown */}
              <div className="relative ml-1">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="w-24 sm:w-32 h-10 sm:h-12 bg-gray-900/80 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-1 sm:space-x-2 border-2 border-blue-400 shadow-lg hover:shadow-blue-400/50 hover:-translate-y-1"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)',
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
                  }}
                   >
                  <span className="text-xl">
                    {language === 'english' ? '🇺🇸' : language === 'roman_urdu' ? '🇵🇰' : '🇵🇰'}
                  </span>
                  <span className="hidden lg:inline text-base">
                    {language === 'english' ? 'English' : language === 'roman_urdu' ? 'Roman Urdu' : 'اردو'}
                  </span>
                  <span className="text-base">▼</span>
                </button>
                
                {/* Dropdown Menu */}
                {showLanguageDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-2xl z-50">
                    <div className="py-2">
                      <button
                        onClick={() => { setLanguage('english'); setShowLanguageDropdown(false); }}
                        className={`w-full px-4 py-3 text-left hover:bg-blue-600/20 transition-colors duration-200 flex items-center space-x-3 ${
                          language === 'english' ? 'bg-blue-600/20 text-blue-300' : 'text-gray-300'
                        }`}
                      >
                        <span>🇺🇸</span>
                        <span>English</span>
                      </button>
                      <button
                        onClick={() => { setLanguage('roman_urdu'); setShowLanguageDropdown(false); }}
                        className={`w-full px-4 py-3 text-left hover:bg-green-600/20 transition-colors duration-200 flex items-center space-x-3 ${
                          language === 'roman_urdu' ? 'bg-green-600/20 text-green-300' : 'text-gray-300'
                        }`}
                      >
                        <span>🇵🇰</span>
                        <span>Roman Urdu</span>
                      </button>
                      <button
                        onClick={() => { setLanguage('urdu'); setShowLanguageDropdown(false); }}
                        className={`w-full px-4 py-3 text-left hover:bg-purple-600/20 transition-colors duration-200 flex items-center space-x-3 ${
                          language === 'urdu' ? 'bg-purple-600/20 text-purple-300' : 'text-gray-300'
                        }`}
                      >
                        <span>🇵🇰</span>
                        <span>اردو</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Button */}
              <button
                onClick={() => setShowContact(!showContact)}
                className="w-32 h-12 bg-gray-900/80 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-400/50 border-2 border-green-400 hover:-translate-y-1 flex items-center justify-center ml-1"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)',
                  WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
                }}
              >
                📞 {translate('Contact')}
              </button>

              {/* Services Button */}
              <button
                onClick={() => setShowServices(!showServices)}
                className="w-32 h-12 bg-gray-900/80 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-400/50 border-2 border-purple-400 hover:-translate-y-1 flex items-center justify-center ml-1"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)',
                  WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
                }}
              >
                🛠️ {translate('Services')}
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="w-32 h-12 bg-gray-900/80 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-400/50 border-2 border-red-400 hover:-translate-y-1 flex items-center justify-center ml-1"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)',
                  WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
                }}
              >
                {translate('Logout')}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* About Us Modal */}
      {showAboutUs && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-32 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8 min-w-96 max-w-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-white">🏢 About Us</h3>
            <button
              onClick={() => setShowAboutUs(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6 text-gray-300">

            
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30">
                <h5 className="text-lg font-semibold text-blue-400 mb-2">🎯 Our Mission</h5>
                <p className="text-sm leading-relaxed">
                  To revolutionize energy management in Pakistani households through cutting-edge AI technology, 
                  helping families save money while contributing to a sustainable future.
                </p>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30">
                <h5 className="text-lg font-semibold text-green-400 mb-2">🚀 What We Provide</h5>
                                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span><strong>AI Energy Predictions:</strong> 16 advanced ML models for accurate consumption forecasting</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span><strong>Smart Bill Analysis:</strong> OCR-powered bill scanning and data extraction</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span><strong>Appliance Optimization:</strong> Efficiency analysis and smart recommendations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span><strong>LESCO Integration:</strong> Pakistan-specific rates and slab optimization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span><strong>House Comparison:</strong> Benchmark your usage against similar households</span>
                    </li>
                  </ul>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30">
                <h5 className="text-lg font-semibold text-purple-400 mb-2">💡 How It Helps You</h5>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Reduce electricity bills by up to 30%</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Understand your energy consumption patterns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Get personalized energy-saving recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Optimize appliance usage for cost efficiency</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span>Plan your energy consumption strategically</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30">
                <h5 className="text-lg font-semibold text-yellow-400 mb-2">🌟 Why Choose Us</h5>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Pakistan's first AI-powered energy management system</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>LESCO-specific billing and rate calculations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>Advanced machine learning algorithms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>24/7 AI assistant support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>User-friendly interface with local language support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-32 right-6 z-50 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6 min-w-80"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">📞 Contact Us</h3>
            <button
              onClick={() => setShowContact(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-xl border border-gray-600/30">
              <span className="text-blue-400 text-xl">📧</span>
              <div>
                <div className="text-sm text-gray-300">Email</div>
                <a 
                  href="mailto:mrzainakram01@gmail.com" 
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  mrzainakram01@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-xl border border-gray-600/30">
              <span className="text-green-400 text-xl">📱</span>
              <div>
                <div className="text-sm text-gray-300">Phone</div>
                <a 
                  href="tel:+923046164257" 
                  className="text-green-400 hover:text-green-300 font-medium"
                >
                  +92 304 6164257
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-xl border border-gray-600/30">
              <span className="text-green-500 text-xl">💬</span>
              <div>
                <div className="text-sm text-gray-300">WhatsApp</div>
                <a 
                  href="https://wa.me/923046164257?text=Hi! I need help with SECPARS" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-400 font-medium"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Office Hours */}
            <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-600/30">
              <div className="text-sm text-gray-300 mb-2">🕒 Office Hours</div>
              <div className="text-xs text-gray-400">
                Monday - Friday: 9:00 AM - 6:00 PM<br/>
                Saturday: 10:00 AM - 4:00 PM<br/>
                Sunday: Closed
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Services Modal */}
      {showServices && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-32 right-6 z-50 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6 min-w-80"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">🛠️ Our Services</h3>
            <button
              onClick={() => setShowServices(false)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" stroke="none" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Energy Prediction */}
            <div className="p-3 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-600/30">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-blue-400 text-xl">📊</span>
                <div className="text-blue-300 font-semibold">AI Energy Predictions</div>
              </div>
              <div className="text-xs text-gray-300">
                16 advanced ML models for accurate consumption forecasting
              </div>
            </div>

            {/* Bill Analysis */}
            <div className="p-3 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-600/30">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-green-400 text-xl">📷</span>
                <div className="text-green-300 font-semibold">Smart Bill Scanning</div>
              </div>
              <div className="text-xs text-gray-300">
                OCR-powered bill analysis and data extraction
              </div>
            </div>

            {/* Appliance Optimization */}
            <div className="p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-600/30">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-purple-400 text-xl">⚡</span>
                <div className="text-purple-300 font-semibold">Appliance Management</div>
              </div>
              <div className="text-xs text-gray-300">
                Efficiency analysis and optimization recommendations
              </div>
            </div>

            {/* LESCO Integration */}
            <div className="p-3 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl border border-orange-600/30">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-orange-400 text-xl">💰</span>
                <div className="text-orange-300 font-semibold">LESCO Billing</div>
              </div>
              <div className="text-xs text-gray-300">
                Pakistan-specific rates and slab optimization
              </div>
            </div>

            {/* Support */}
            <div className="p-3 bg-gray-800/50 rounded-xl border border-gray-600/30">
              <div className="text-sm text-gray-300 mb-2">🆘 24/7 Support</div>
              <div className="text-xs text-gray-400">
                Technical support and customer service available
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default CleanNavbar; 