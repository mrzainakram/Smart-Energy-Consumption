import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MindBlowing3DPreWelcome from './components/MindBlowing3DPreWelcome';
import MindBlowing3DFeatures from './components/MindBlowing3DFeatures';
import MindBlowing3DLoading from './components/MindBlowing3DLoading';
import AuthSystem from './components/AuthSystem';
import ProjectDashboard from './components/ProjectDashboard'; // Keep this import for fallback if needed
import AISystemIntro from './components/AISystemIntro';
import ThreeDBackground from './components/ThreeDBackground';
import EnhancedPredictionDashboard from './components/EnhancedPredictionDashboard';
import ResponsiveDemo from './components/ResponsiveDemo';
import { LanguageProvider } from './contexts/LanguageContext';

const App_New = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [backendStatus, setBackendStatus] = useState('connecting');

  // Initialize isAuthenticated and user from localStorage directly on first render
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedUserInLocalStorage = localStorage.getItem('userLoggedIn');
    return savedUserInLocalStorage ? true : false;
  });
  const [user, setUser] = useState(() => {
    const savedUserInLocalStorage = localStorage.getItem('userLoggedIn');
    return savedUserInLocalStorage ? JSON.parse(savedUserInLocalStorage) : null;
  });

  // Simple logic: Check if this is a fresh start or refresh
  const [currentPage, setCurrentPage] = useState(() => {
    // Check if sessionStorage has a flag (indicates this is a refresh, not fresh start)
    const isRefresh = sessionStorage.getItem('appInitialized');
    
    if (!isRefresh) {
      // This is a fresh start (npm run dev)
      sessionStorage.setItem('appInitialized', 'true');
      return 'preWelcome';
    } else {
      // This is a refresh - check localStorage for saved page
      const savedPage = localStorage.getItem('currentPage');
      
      if (savedPage) {
        return savedPage;
      } else {
        return 'preWelcome';
      }
    }
  });

  // Sync currentPage and user state with localStorage on changes
  useEffect(() => {
    // Only save to localStorage when explicitly navigating (not on initial load)
    if (currentPage !== 'preWelcome') {
      localStorage.setItem('currentPage', currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('userLoggedIn', JSON.stringify(user));
    } else {
      localStorage.removeItem('userLoggedIn');
    }
  }, [user]);

  // Check backend connection
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8002/api/health/');
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      console.log('Backend not running, will use mock data');
      setBackendStatus('mock');
    }
  };

  // Handle pre-welcome completion
  const handlePreWelcomeComplete = () => {
    setCurrentPage('features');
  };

  // Handle features page get started
  const handleGetStarted = () => {
    setCurrentPage('loading');
    startLoading();
  };

  // Handle back to pre-welcome
  const handleBack = () => {
    setCurrentPage('preWelcome');
  };

  // Handle loading completion
  const handleLoadingComplete = () => {
    setCurrentPage('auth');
  };

  // Simulate loading progress
  const startLoading = () => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  // Handle authentication success
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('aiIntro');
    localStorage.setItem('currentPage', 'aiIntro');
    localStorage.setItem('userLoggedIn', JSON.stringify(userData));
  };

  // Handle AI intro completion
  const handleAIIntroComplete = () => {
    setCurrentPage('dashboard');
    localStorage.setItem('currentPage', 'dashboard');
  };

  // Handle back from AI intro to auth
  const handleAIIntroBack = () => {
    setCurrentPage('auth');
    localStorage.setItem('currentPage', 'auth');
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentPage');
    setCurrentPage('auth');
  };

  // Reset to pre-welcome page
  const resetToPreWelcome = () => {
    setCurrentPage('preWelcome');
    setLoadingProgress(0);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentPage');
    sessionStorage.removeItem('appInitialized'); // Clear sessionStorage for fresh start
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <ThreeDBackground />
        </div>
        
        {/* Quick Access Button for Responsive Demo */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setCurrentPage('responsive')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            📱 Responsive Demo
          </button>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {currentPage === 'preWelcome' && (
            <MindBlowing3DPreWelcome
              onComplete={handlePreWelcomeComplete}
              duration={5000}
            />
          )}

          {currentPage === 'features' && (
            <MindBlowing3DFeatures
              onGetStarted={handleGetStarted}
              onBack={handleBack}
              isDarkMode={isDarkMode}
            />
          )}

          {currentPage === 'loading' && (
            <MindBlowing3DLoading
              progress={loadingProgress}
              onComplete={handleLoadingComplete}
              duration={1000}
            />
          )}

          {currentPage === 'auth' && (
            <AuthSystem
              onAuthSuccess={handleAuthSuccess}
              theme={isDarkMode ? 'dark' : 'light'}
              onBack={() => setCurrentPage('loading')} // Back button for AuthSystem
            />
          )}

          {currentPage === 'aiIntro' && isAuthenticated && (
            <AISystemIntro
              onComplete={handleAIIntroComplete}
              onBack={handleAIIntroBack}
              user={user}
            />
          )}

          {currentPage === 'dashboard' && isAuthenticated && (
            <EnhancedPredictionDashboard
              onLogout={handleLogout}
              user={user}
              theme={isDarkMode ? 'dark' : 'light'}
            />
          )}

          {currentPage === 'responsive' && (
            <ResponsiveDemo />
          )}
        </div>
      </div>
    </LanguageProvider>
  );
};

export default App_New; 