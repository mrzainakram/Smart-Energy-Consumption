import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const AISystemIntro = ({ onComplete, user, onBack }) => {
  const [currentText, setCurrentText] = useState(0);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  const texts = [
    "AI-BASED SMART ENERGY",
    "CONSUMPTION PREDICTION",
    "AND RECOMMENDATION SYSTEM",
    "WELCOME TO THE FUTURE"
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

    // 3D Tao-Inspired Galaxy Background
    const createTaoInspiredBackground = () => {
      // Central Tao orb (yin-yang inspired)
      const taoOrbGeometry = new THREE.SphereGeometry(0.5, 20, 20);
      const taoOrbMaterial = new THREE.MeshBasicMaterial({
        color: 0x4A2C2A, // Dark maroon
        transparent: true,
        opacity: 0.9
      });
      
      const taoOrb = new THREE.Mesh(taoOrbGeometry, taoOrbMaterial);
      taoOrb.position.set(0, 0, 0);
      scene.add(taoOrb);

      // Electrons (shining day style)
      const electrons = [];
      for (let i = 0; i < 50; i++) {
        const electronGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const electronMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.6 + i * 0.01, 1, 0.9), // Bright cyan to blue
          transparent: true,
          opacity: 0.9
        });
        
        const electron = new THREE.Mesh(electronGeometry, electronMaterial);
        electron.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );
        scene.add(electron);
        electrons.push(electron);
      }

      // Shining day particles
      const shiningParticles = [];
      for (let i = 0; i < 40; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.02, 6, 6);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.15 + i * 0.02, 1, 0.8), // Golden to orange
          transparent: true,
          opacity: 0.8
        });
        
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 18
        );
        scene.add(particle);
        shiningParticles.push(particle);
      }

      return { taoOrb, electrons, shiningParticles };
    };

    const taoBackground = createTaoInspiredBackground();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate Tao orb (central harmony)
      taoBackground.taoOrb.rotation.y += 0.01;
      taoBackground.taoOrb.material.opacity = 0.8 + Math.sin(Date.now() * 0.0005) * 0.2;

      // Animate electrons (shining day movement)
      taoBackground.electrons.forEach((electron, index) => {
        electron.rotation.y += 0.02 + index * 0.01;
        electron.position.x += Math.sin(Date.now() * 0.002 + index) * 0.03;
        electron.position.y += Math.cos(Date.now() * 0.001 + index) * 0.02;
        electron.material.opacity = 0.8 + Math.sin(Date.now() * 0.003 + index) * 0.2;
      });

      // Animate shining particles (bright day movement)
      taoBackground.shiningParticles.forEach((particle, index) => {
        particle.rotation.z += 0.015 + index * 0.005;
        particle.position.x += Math.cos(Date.now() * 0.001 + index) * 0.015;
        particle.position.y += Math.sin(Date.now() * 0.0008 + index) * 0.012;
        particle.material.opacity = 0.7 + Math.sin(Date.now() * 0.002 + index) * 0.3;
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

  // Text animation with auto-dashboard transition (2 seconds)
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText(prev => {
        if (prev >= texts.length - 1) {
          clearInterval(textInterval);
          // Stop at last text, don't auto-navigate
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(textInterval);
  }, [onComplete]);



  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <style>
        {`
          @keyframes smoothShine {
            0% {
              text-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3), 0 0 60px rgba(251, 191, 36, 0.2);
              filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.4));
            }
            25% {
              text-shadow: 0 0 30px rgba(0, 255, 255, 0.7), 0 0 60px rgba(0, 255, 255, 0.4), 0 0 90px rgba(251, 191, 36, 0.3);
              filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.5));
            }
            50% {
              text-shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 0 80px rgba(0, 255, 255, 0.5), 0 0 120px rgba(251, 191, 36, 0.4);
              filter: drop-shadow(0 0 25px rgba(0, 255, 255, 0.6));
            }
            75% {
              text-shadow: 0 0 30px rgba(0, 255, 255, 0.7), 0 0 60px rgba(0, 255, 255, 0.4), 0 0 90px rgba(251, 191, 36, 0.3);
              filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.5));
            }
            100% {
              text-shadow: 0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3), 0 0 60px rgba(251, 191, 36, 0.2);
              filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.4));
            }
          }
        `}
      </style>
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
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-gold-400 mb-4 bungee-spice-regular"
                style={{
                  textShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.5), 0 0 90px rgba(251, 191, 36, 0.4)',
                  WebkitTextStroke: '3px rgba(0, 255, 255, 0.7)',
                  fontFamily: 'Orbitron, monospace',
                  letterSpacing: '0.2em',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  lineHeight: '1.2',
                  filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.6))',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased',
                  transform: 'perspective(800px) rotateX(5deg)',
                  animation: 'smoothShine 4s ease-in-out infinite'
                }}>
              AI-BASED SMART ENERGY
            </h1>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-gold-300 mb-3 bungee-spice-regular"
                style={{
                  textShadow: '0 0 25px rgba(0, 255, 255, 0.7), 0 0 50px rgba(0, 255, 255, 0.4), 0 0 75px rgba(251, 191, 36, 0.3)',
                  WebkitTextStroke: '2px rgba(0, 255, 255, 0.6)',
                  fontFamily: 'Orbitron, monospace',
                  letterSpacing: '0.15em',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  filter: 'drop-shadow(0 0 15px rgba(0, 255, 255, 0.5))',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased',
                  transform: 'perspective(600px) rotateX(3deg)',
                  animation: 'smoothShine 3.5s ease-in-out infinite'
                }}>
              CONSUMPTION PREDICTION
            </h2>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-300 to-gold-200 bungee-spice-regular"
                style={{
                  textShadow: '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3), 0 0 60px rgba(251, 191, 36, 0.2)',
                  WebkitTextStroke: '1.5px rgba(0, 255, 255, 0.5)',
                  fontFamily: 'Orbitron, monospace',
                  letterSpacing: '0.1em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.4))',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased',
                  transform: 'perspective(400px) rotateX(2deg)',
                  animation: 'smoothShine 3s ease-in-out infinite'
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

          {/* User Welcome */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
            className="mb-8"
          >
            <p className="text-gray-100 text-4xl metal-mania-regular">
              Welcome, <span className="text-cyan-500 font-bold">{user?.email ? user.email.split('@')[0] : 'User'}</span>
            </p>
            <p className="text-gray-100 text-4xl mt-2 metal-mania-regular">
              Your AI-powered energy management system is ready
            </p>
          </motion.div>

          {/* Loading Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 3 }}
            className="mt-8"
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-gray-100 text-3xl mt-2 text-center bungee-spice-regular">
              Preparing your dashboard...
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 4 }}
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

export default AISystemIntro; 