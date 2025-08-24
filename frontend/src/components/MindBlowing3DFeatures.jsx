import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const MindBlowing3DFeatures = ({ onGetStarted, onBack, isDarkMode }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive detection
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.Fog(0x000000, 1, 100);

    // Responsive camera setup
    const updateCamera = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      if (cameraRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
      
      if (rendererRef.current) {
        rendererRef.current.setSize(width, height);
      }
    };

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 0, 8);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    rendererRef.current = renderer;
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Point lights for volumetric effect
    const pointLight1 = new THREE.PointLight(0x00ffff, 2, 15);
    pointLight1.position.set(-8, 2, 8);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 2, 15);
    pointLight2.position.set(8, -2, 8);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xff8800, 2, 15);
    pointLight3.position.set(0, 8, -8);
    scene.add(pointLight3);

    // 3D Energy Grid
    const gridGeometry = new THREE.PlaneGeometry(20, 20, 20, 20);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -5;
    scene.add(grid);

    // 3D Floating Features
    const features = [];

    // AI Prediction Feature
    const predictionGeometry = new THREE.BoxGeometry(1.5, 1, 0.2);
    const predictionMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3
    });
    const predictionFeature = new THREE.Mesh(predictionGeometry, predictionMaterial);
    predictionFeature.position.set(-4, 2, 0);
    scene.add(predictionFeature);
    features.push(predictionFeature);

    // Bill Scanner Feature
    const scannerGeometry = new THREE.BoxGeometry(1.5, 1, 0.2);
    const scannerMaterial = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.8,
      emissive: 0xff00ff,
      emissiveIntensity: 0.3
    });
    const scannerFeature = new THREE.Mesh(scannerGeometry, scannerMaterial);
    scannerFeature.position.set(0, 2, 0);
    scene.add(scannerFeature);
    features.push(scannerFeature);

    // Energy Monitoring Feature
    const monitoringGeometry = new THREE.BoxGeometry(1.5, 1, 0.2);
    const monitoringMaterial = new THREE.MeshPhongMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.8,
      emissive: 0xff8800,
      emissiveIntensity: 0.3
    });
    const monitoringFeature = new THREE.Mesh(monitoringGeometry, monitoringMaterial);
    monitoringFeature.position.set(4, 2, 0);
    scene.add(monitoringFeature);
    features.push(monitoringFeature);

    // Animation loop
    const animate = () => {
      timeRef.current += 0.01;

      // Rotate features
      features.forEach((feature, index) => {
        feature.rotation.y = timeRef.current * (1 + index * 0.5);
        feature.rotation.x = Math.sin(timeRef.current + index) * 0.3;
        feature.position.y += Math.sin(timeRef.current * 2 + index) * 0.01;
      });

      // Rotate grid
      grid.rotation.z = timeRef.current * 0.5;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', updateCamera);
    updateCamera();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateCamera);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden">
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-black/50 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        ← Back
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Smart Energy
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400 bg-clip-text text-transparent">
                Consumption
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              Revolutionize your energy management with AI-powered predictions, smart bill scanning, and real-time monitoring.
            </p>
            <motion.button
              onClick={onGetStarted}
              className="mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base md:text-lg shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>

          {/* 3D Canvas Container */}
          <motion.div
            className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] mb-8 sm:mb-12 lg:mb-16 rounded-2xl overflow-hidden border border-white/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div ref={mountRef} className="w-full h-full" />
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
            {/* AI Predictions */}
            <motion.div
              className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-4 sm:p-6 hover:border-cyan-400/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">AI Predictions</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  Advanced machine learning algorithms predict your energy consumption patterns with 95% accuracy
                </p>
              </div>
            </motion.div>

            {/* Smart Bill Scanner */}
            <motion.div
              className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 hover:border-purple-400/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">Smart Bill Scanner</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                  Scan and analyze energy bills automatically with OCR technology for instant insights
                </p>
              </div>
            </motion.div>

            {/* Real-time Monitoring */}
            <motion.div
              className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-4 sm:p-6 hover:border-orange-400/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
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
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 lg:mb-16">
            {/* Energy Efficiency */}
            <motion.div
              className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 sm:p-8 hover:border-green-400/50 transition-all duration-300"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              whileHover={{ x: 5 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">Energy Efficiency</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                    Get personalized recommendations to reduce energy consumption and save money on bills
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Smart Automation */}
            <motion.div
              className="bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 sm:p-8 hover:border-blue-400/50 transition-all duration-300"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              whileHover={{ x: -5 }}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">Smart Automation</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                    Automate your energy systems based on AI insights and user preferences
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            className="text-center bg-gradient-to-br from-black/50 to-gray-900/50 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8 lg:p-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
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
                Start Free Trial
              </motion.button>
              <button className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white/50 hover:bg-white/10 transition-all duration-300 text-sm sm:text-base md:text-lg">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MindBlowing3DFeatures; 