import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const AITransitionPage = ({ onComplete, user }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  const texts = [
    "AI-BASED SMART ENERGY",
    "CONSUMPTION PREDICTION",
    "AND RECOMMENDATION SYSTEM",
    "INITIALIZING..."
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // 3D Galaxy Background (Same as Auth Page)
    const createGalaxyBackground = () => {
      // Stars
      const stars = [];
      const starGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      for (let i = 0; i < 200; i++) {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 1, 0.8),
          transparent: true,
          opacity: 0.8
        });
        
        const star = new THREE.Mesh(starGeometry, material);
        star.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
        scene.add(star);
        stars.push(star);
      }

      // Nebulae (cyan to purple gradients)
      const nebulae = [];
      for (let i = 0; i < 5; i++) {
        const geometry = new THREE.SphereGeometry(2 + Math.random() * 3, 16, 16);
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.5 + i * 0.1, 0.8, 0.6),
          transparent: true,
          opacity: 0.3
        });
        
        const nebula = new THREE.Mesh(geometry, material);
        nebula.position.set(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        );
        scene.add(nebula);
        nebulae.push(nebula);
      }

      // Golden orbs
      const orbs = [];
      for (let i = 0; i < 8; i++) {
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.15, 1, 0.7), // Golden color
          transparent: true,
          opacity: 0.9
        });
        
        const orb = new THREE.Mesh(geometry, material);
        orb.position.set(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12
        );
        scene.add(orb);
        orbs.push(orb);
      }

      return { stars, nebulae, orbs };
    };

    const galaxy = createGalaxyBackground();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate stars
      galaxy.stars.forEach((star, index) => {
        star.rotation.x += 0.01 * (index % 3 + 1);
        star.rotation.y += 0.005 * (index % 4 + 1);
        star.position.y += Math.sin(Date.now() * 0.001 + index) * 0.005;
      });

      // Animate nebulae
      galaxy.nebulae.forEach((nebula, index) => {
        nebula.rotation.x += 0.002 * (index + 1);
        nebula.rotation.y += 0.001 * (index + 1);
        nebula.material.opacity = 0.2 + Math.sin(Date.now() * 0.0005 + index) * 0.1;
      });

      // Animate golden orbs
      galaxy.orbs.forEach((orb, index) => {
        orb.rotation.x += 0.02 * (index + 1);
        orb.rotation.y += 0.01 * (index + 1);
        orb.position.y += Math.sin(Date.now() * 0.002 + index) * 0.01;
        orb.material.opacity = 0.7 + Math.sin(Date.now() * 0.003 + index) * 0.2;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Text animation
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % texts.length);
    }, 2000);

    return () => clearInterval(textInterval);
  }, []);

  // Progress animation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Galaxy Background (Same as Auth Page) */}
      <div ref={mountRef} className="absolute inset-0 z-0" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-gold-500 mb-4 bungee-spice-regular"
                style={{
                  textShadow: '0 0 50px rgba(0, 255, 255, 0.8), 0 0 100px rgba(0, 255, 255, 0.4)',
                  WebkitTextStroke: '3px rgba(0, 255, 255, 0.5)',
                  fontFamily: 'Orbitron, monospace',
                  letterSpacing: '0.2em',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  lineHeight: '1.2'
                }}>
              AI-BASED SMART ENERGY
            </h1>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-3 bungee-spice-regular"
                style={{
                  textShadow: '0 0 40px rgba(147, 51, 234, 0.8), 0 0 80px rgba(147, 51, 234, 0.4)',
                  WebkitTextStroke: '2px rgba(147, 51, 234, 0.5)',
                  fontFamily: 'Orbitron, monospace',
                  letterSpacing: '0.15em',
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
              CONSUMPTION PREDICTION
            </h2>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-orange-400 bungee-spice-regular"
                style={{
                  textShadow: '0 0 30px rgba(251, 191, 36, 0.8), 0 0 60px rgba(251, 191, 36, 0.4)',
                  WebkitTextStroke: '1.5px rgba(251, 191, 36, 0.5)',
                  fontFamily: 'Orbitron, monospace',
                  letterSpacing: '0.1em',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
              AND RECOMMENDATION SYSTEM
            </h3>
          </motion.div>

          {/* Animated Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mb-8"
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-cyan-300 metal-mania-regular"
                style={{
                  textShadow: '0 0 20px rgba(0, 255, 255, 0.6)',
                  fontFamily: 'Orbitron, monospace',
                  letterSpacing: '0.1em'
                }}
              >
                {texts[currentText]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="w-full max-w-md mx-auto mb-8"
          >
            <div className="bg-black/30 backdrop-blur-xl rounded-full border border-cyan-400/30 p-1">
              <motion.div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-cyan-800 text-lg mt-2 metal-mania-regular">
              Initializing System... {Math.round(progress)}%
            </p>
          </motion.div>

          {/* User Welcome */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
            className="text-center"
          >
            <p className="text-gray-800 text-7xl metal-mania-regular">
              Welcome, <span className="text-cyan-300 font-bold">{user?.email ? user.email.split('@')[0] : 'User'}</span>
            </p>
            <p className="text-gray-900 text-5xl mt-2 metal-mania-regular">
              Preparing your personalized energy dashboard...
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 3 }}
            className="mt-8 flex justify-center space-x-6"
          >
            {/* Get Started Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-400/50 border-2 border-cyan-400 transition-all duration-300 metal-mania-regular text-xl"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)',
                WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
              }}
            >
              🚀 Get Started
            </motion.button>

            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-400/50 border-2 border-purple-400 transition-all duration-300 metal-mania-regular text-xl"
              style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.1)',
                WebkitTextStroke: '0.5px rgba(0,0,0,0.3)'
              }}
            >
              ← Back
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AITransitionPage; 