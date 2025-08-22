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

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.Fog(0x000000, 1, 100);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
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
    renderer.setSize(window.innerWidth, window.innerHeight);
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

    // AI Assistant Feature
    const assistantGeometry = new THREE.BoxGeometry(1.5, 1, 0.2);
    const assistantMaterial = new THREE.MeshPhongMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.8,
      emissive: 0xff8800,
      emissiveIntensity: 0.3
    });
    const assistantFeature = new THREE.Mesh(assistantGeometry, assistantMaterial);
    assistantFeature.position.set(4, 2, 0);
    scene.add(assistantFeature);
    features.push(assistantFeature);

    // 3D Energy Connections
    const connectionGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const connectionMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6
    });

    // Connect features
    const connections = [
      { from: predictionFeature, to: scannerFeature },
      { from: scannerFeature, to: assistantFeature }
    ];

    connections.forEach(({ from, to }) => {
      const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
      const direction = new THREE.Vector3().subVectors(to.position, from.position);
      const distance = direction.length();
      connection.scale.set(1, distance, 1);
      connection.position.copy(from.position).add(direction.multiplyScalar(0.5));
      connection.lookAt(to.position);
      scene.add(connection);
    });

    // Particle system
    const particleCount = 300;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 15;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 15;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 15;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.6);
      particleColors[i3] = color.r;
      particleColors[i3 + 1] = color.g;
      particleColors[i3 + 2] = color.b;

      particleSizes[i] = Math.random() * 0.1 + 0.05;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    const animate = (time) => {
      timeRef.current = time * 0.001;
      
      // Rotate grid
      grid.rotation.z += 0.005;
      
      // Animate features
      features.forEach((feature, index) => {
        feature.rotation.y += 0.01 + index * 0.002;
        feature.scale.setScalar(1 + Math.sin(timeRef.current * 2 + index) * 0.1);
        feature.position.y += Math.sin(timeRef.current + index) * 0.01;
      });
      
      // Animate particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += (Math.random() - 0.5) * 0.003;
        positions[i3 + 1] += (Math.random() - 0.5) * 0.003;
        positions[i3 + 2] += (Math.random() - 0.5) * 0.003;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Animate camera
      camera.position.x = Math.sin(timeRef.current * 0.3) * 2;
      camera.position.y = Math.cos(timeRef.current * 0.2) * 1;
      camera.lookAt(0, 0, 0);
      
      // Animate lights
      pointLight1.position.x = Math.sin(timeRef.current * 0.5) * 5;
      pointLight2.position.y = Math.cos(timeRef.current * 0.7) * 3;
      pointLight3.position.z = Math.sin(timeRef.current * 0.3) * 5;
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />
      
      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400"
            style={{
              textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4), 0 0 90px rgba(255, 165, 0, 0.3)',
              WebkitTextStroke: '3px rgba(0, 255, 255, 0.5)',
              fontFamily: 'Orbitron, monospace',
              letterSpacing: '0.15em',
              fontWeight: '900',
              textTransform: 'uppercase',
              transform: 'perspective(1000px) rotateX(5deg)',
              filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.6))'
            }}
            whileHover={{
              scale: 1.05,
              textShadow: '0 0 40px rgba(0, 255, 255, 1), 0 0 80px rgba(0, 255, 255, 0.7), 0 0 120px rgba(255, 165, 0, 0.5)',
              transform: 'perspective(1000px) rotateX(8deg) scale(1.05)'
            }}
            animate={{
              textShadow: [
                '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4), 0 0 90px rgba(255, 165, 0, 0.3)',
                '0 0 40px rgba(0, 255, 255, 0.9), 0 0 80px rgba(0, 255, 255, 0.5), 0 0 120px rgba(255, 165, 0, 0.4)',
                '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4), 0 0 90px rgba(255, 165, 0, 0.3)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            SMART ENERGY
          </motion.h1>
          <motion.p
            className="mt-6 text-2xl md:text-3xl font-bold text-orange-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{
              textShadow: '0 0 20px rgba(255, 165, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.4)',
              WebkitTextStroke: '1px rgba(255, 165, 0, 0.3)'
            }}
          >
            AI-Powered Energy Management
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">AI Predictions</h3>
              <p className="text-gray-300">Advanced energy consumption forecasting with machine learning</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="text-xl font-bold text-purple-400 mb-2">Bill Scanner</h3>
              <p className="text-gray-300">OCR-powered bill data extraction and analysis</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6 border border-orange-400/30 hover:border-orange-400/60 transition-all duration-300"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-orange-400 mb-2">AI Assistant</h3>
              <p className="text-gray-300">Intelligent energy recommendations and insights</p>
            </div>
          </motion.div>

          {/* Manual Energy Input */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-blue-400 mb-2">Manual Energy Input</h3>
              <p className="text-gray-300">Enter consumption data manually for predictions</p>
            </div>
          </motion.div>

          {/* Appliances Prediction */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6 border border-green-400/30 hover:border-green-400/60 transition-all duration-300"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🔌</div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Appliances Prediction</h3>
              <p className="text-gray-300">Smart appliance analysis and energy optimization</p>
            </div>
          </motion.div>

          {/* House Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6 border border-indigo-400/30 hover:border-indigo-400/60 transition-all duration-300"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-indigo-400 mb-2">House Comparison</h3>
              <p className="text-gray-300">Compare multiple properties for energy efficiency</p>
            </div>
          </motion.div>

          {/* Seasonal Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🌤️</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Seasonal Analysis</h3>
              <p className="text-gray-300">Weather-based energy consumption predictions</p>
            </div>
          </motion.div>

          {/* Energy History */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6 border border-red-400/30 hover:border-red-400/60 transition-all duration-300"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Energy History</h3>
              <p className="text-gray-300">Track and analyze historical consumption patterns</p>
            </div>
          </motion.div>

          {/* Smart Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-lg p-6 border border-teal-400/30 hover:border-teal-400/60 transition-all duration-300"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-teal-400 mb-2">Smart Recommendations</h3>
              <p className="text-gray-300">AI-powered energy saving suggestions</p>
            </div>
          </motion.div>
        </div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="absolute top-12 left-12 px-6 py-3 text-white font-bold text-lg rounded-lg shadow-xl transition-all duration-300 z-50"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 165, 0, 0.95) 0%, rgba(255, 69, 0, 0.95) 100%)',
            boxShadow: '0 0 20px rgba(255, 165, 0, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            WebkitBackdropFilter: 'blur(15px)'
          }}
        >
          ← Back
        </motion.button>

        {/* Get Started Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGetStarted}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 hover:from-cyan-600 hover:via-purple-600 hover:to-orange-600 text-white font-bold text-xl rounded-lg shadow-2xl transition-all duration-300"
          style={{
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)'
          }}
        >
          Get Started
        </motion.button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.5); }
        }
        
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MindBlowing3DFeatures; 