import React from 'react';
import { motion } from 'framer-motion';

const MindBlowing3DFeatures = ({ onGetStarted, onBack, isDarkMode }) => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* 3D Rotating Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Geometric Shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border border-cyan-500/20 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 border border-purple-500/20 rotate-45"
          animate={{
            rotate: -360,
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute bottom-32 left-32 w-40 h-40 border border-green-500/20 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-20 w-28 h-28 border border-blue-500/20 rotate-12"
          animate={{
            rotate: -360,
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating Particles */}
        <motion.div
          className="absolute top-1/4 left-1/3 w-2 h-2 bg-cyan-400 rounded-full"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full"
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-green-400 rounded-full"
          animate={{
            y: [-15, 15, -15],
            x: [-8, 8, -8],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full"
          animate={{
            y: [15, -15, 15],
            x: [8, -8, 8],
            opacity: [0.2, 0.7, 0.2]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Rotating Rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-cyan-500/10 rounded-full"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-purple-500/10 rounded-full"
          animate={{
            rotate: -360
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-green-500/10 rounded-full"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating Energy Icons */}
        <motion.div
          className="absolute top-1/4 left-1/4 text-cyan-400 text-4xl opacity-20"
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⚡
        </motion.div>
        
        <motion.div
          className="absolute top-1/3 right-1/3 text-purple-400 text-3xl opacity-20"
          animate={{
            y: [10, -10, 10],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🔋
        </motion.div>
        
        <motion.div
          className="absolute bottom-1/3 left-1/3 text-green-400 text-3xl opacity-20"
          animate={{
            y: [-8, 8, -8],
            rotate: [0, 3, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          💡
        </motion.div>
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-blue-400 text-4xl opacity-20"
          animate={{
            y: [8, -8, 8],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🌟
        </motion.div>
        
        {/* Matrix-style Digital Rain Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-cyan-400/30 text-xs font-mono"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [-100, window.innerHeight + 100],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            >
              {['01', '10', '11', '00'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>
        
        {/* Wave Effect */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/20 to-transparent"
          animate={{
            scaleY: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Energy Pulse Effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full"
          animate={{
            scale: [0, 100, 0],
            opacity: [1, 0, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        
        {/* Floating Hexagons */}
        <motion.div
          className="absolute top-1/6 left-1/6 w-16 h-16 border border-purple-500/30 transform rotate-45"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute top-2/6 right-1/6 w-12 h-12 border border-green-500/30 transform rotate-30"
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Orbital Elements */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full opacity-60" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full opacity-60" />
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-green-400 rounded-full opacity-60" />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full opacity-60" />
        </motion.div>
        
        {/* Floating Data Points */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`data-${i}`}
            className="absolute w-1 h-1 bg-cyan-400/50 rounded-full"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i * 5)}%`
            }}
            animate={{
              y: [-5, 5, -5],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Energy Flow Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <motion.path
            d="M 100 200 Q 300 100 500 200 T 900 200"
            stroke="url(#energyGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <defs>
            <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0" />
              <stop offset="50%" stopColor="#00ffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Additional Floating Elements */}
        <motion.div
          className="absolute top-1/5 left-1/5 w-20 h-20 border border-yellow-500/20 rounded-full"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute top-3/5 right-1/5 w-16 h-16 border border-pink-500/20 transform rotate-12"
          animate={{
            rotate: [360, 180, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Dynamic Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`grid-${i}`}
              className="absolute border-l border-cyan-500/20 h-full"
              style={{ left: `${i * 10}%` }}
              animate={{
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`grid-h-${i}`}
              className="absolute border-t border-cyan-500/20 w-full"
              style={{ top: `${i * 12.5}%` }}
              animate={{
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 3 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Energy Sparks */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`spark-${i}`}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${15 + (i * 6)}%`,
              top: `${20 + (i * 4)}%`
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Rotating Energy Core */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full" />
          <div className="absolute inset-2 border-2 border-purple-500/30 rounded-full" />
          <div className="absolute inset-4 border-2 border-green-500/30 rounded-full" />
          <div className="absolute inset-6 border-2 border-blue-500/30 rounded-full" />
        </motion.div>
        
        {/* Floating Energy Orbs */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-40"
          animate={{
            y: [-15, 15, -15],
            x: [0, 10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-40"
          animate={{
            y: [15, -15, 15],
            x: [0, -8, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-6xl"
        >
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
            style={{
              textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4)',
              fontFamily: 'Orbitron, monospace',
              letterSpacing: '0.1em'
            }}
          >
            Smart Energy Consumption
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            AI-Powered Energy Management System
          </motion.p>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {/* Energy Predictions */}
            <motion.div
              className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300"
              initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ y: -5 }}
          >
            <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">Energy Predictions</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  Predict your monthly energy consumption using 16 advanced ML models
                </p>
            </div>
          </motion.div>

            {/* Bill Analysis */}
          <motion.div
              className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">Bill Analysis</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  Scan and analyze electricity, gas, and water bills with OCR technology
                </p>
              </div>
            </motion.div>

            {/* Smart Recommendations */}
            <motion.div
              className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">Smart Recommendations</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  Get personalized energy-saving tips and optimal appliance usage schedules
                </p>
              </div>
            </motion.div>

            {/* Real-time Monitoring */}
            <motion.div
              className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 hover:border-orange-400/50 transition-all duration-300"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              whileHover={{ y: -5 }}
          >
            <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">Real-time Monitoring</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  Monitor your energy consumption in real-time with detailed analytics and alerts
                </p>
            </div>
          </motion.div>

            {/* Energy Efficiency */}
          <motion.div
              className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300"
              initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">Energy Efficiency</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  Get personalized recommendations to reduce energy consumption and save money on bills
                </p>
              </div>
            </motion.div>

            {/* Smart Automation */}
            <motion.div
              className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              whileHover={{ y: -5 }}
          >
            <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">Smart Automation</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  Automate your energy systems based on AI insights and user preferences
                </p>
            </div>
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="text-center bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8 lg:p-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Energy Management?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Join thousands of users who have already revolutionized their energy consumption with our AI-powered platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <motion.button
                onClick={onGetStarted}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base md:text-lg shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
              >
                Get Started
        </motion.button>
        <motion.button
                onClick={onBack}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white/50 hover:bg-white/10 transition-all duration-300 text-sm sm:text-base md:text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
                Back
        </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MindBlowing3DFeatures; 