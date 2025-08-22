import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const MindBlowing3DLoading = ({ progress = 0, onComplete, duration = 1000 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  
  const [loadingSteps] = useState([
    "Powering Up...",
    "Initializing Prediction Auth Page...",
    "Ready for Auth Page!"
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // Har step 2.5s tak dikhay, last step ("Ready for Auth Page!") par rukay rahe
  useEffect(() => {
    if (currentStep < loadingSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    }
    // Last step par kuch na karo, wahi par raho
  }, [currentStep, loadingSteps.length]);

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
    renderer.toneMappingExposure = 1.4;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Point lights for volumetric effect
    const pointLight1 = new THREE.PointLight(0x00ffff, 4, 15);
    pointLight1.position.set(-5, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 4, 15);
    pointLight2.position.set(5, -3, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xff8800, 4, 15);
    pointLight3.position.set(0, 5, -5);
    scene.add(pointLight3);

    // 3D DNA Helix Structure
    const helixGroup = new THREE.Group();
    const helixRadius = 2;
    const helixHeight = 8;
    const helixTurns = 4;
    const pointsPerTurn = 20;

    for (let i = 0; i < helixTurns * pointsPerTurn; i++) {
      const angle = (i / pointsPerTurn) * Math.PI * 2;
      const height = (i / pointsPerTurn) * helixHeight - helixHeight / 2;
      
      // Create sphere for DNA point
      const sphereGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? 0x00ffff : 0xff00ff,
        transparent: true,
        opacity: 0.8,
        emissive: i % 2 === 0 ? 0x00ffff : 0xff00ff,
        emissiveIntensity: 0.3
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      
      sphere.position.set(
        Math.cos(angle) * helixRadius,
        height,
        Math.sin(angle) * helixRadius
      );
      helixGroup.add(sphere);
    }

    // Connect DNA points with lines
    for (let i = 0; i < helixTurns * pointsPerTurn - 1; i++) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        helixGroup.children[i].position,
        helixGroup.children[i + 1].position
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }

    scene.add(helixGroup);

    // 3D Energy Rings
    const ringCount = 3;
    const rings = [];

    for (let i = 0; i < ringCount; i++) {
      const ringGeometry = new THREE.TorusGeometry(1.5 + i * 0.5, 0.05, 8, 32);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.6 + i * 0.1, 1, 0.6),
        transparent: true,
        opacity: 0.7,
        emissive: new THREE.Color().setHSL(0.6 + i * 0.1, 1, 0.3),
        emissiveIntensity: 0.4
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.y = i * 0.5;
      scene.add(ring);
      rings.push(ring);
    }

    // 3D Central Core
    const coreGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      emissive: 0xffffff,
      emissiveIntensity: 0.5
    });
    const centralCore = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(centralCore);

    // Particle system
    const particleCount = 400;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 20;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 20;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 20;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.7);
      particleColors[i3] = color.r;
      particleColors[i3 + 1] = color.g;
      particleColors[i3 + 2] = color.b;

      particleSizes[i] = Math.random() * 0.15 + 0.05;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    const animate = (time) => {
      timeRef.current = time * 0.001;
      
      // Rotate DNA helix
      helixGroup.rotation.y += 0.02;
      helixGroup.children.forEach((sphere, index) => {
        sphere.scale.setScalar(1 + Math.sin(timeRef.current * 3 + index) * 0.2);
        sphere.material.opacity = 0.5 + Math.sin(timeRef.current * 2 + index) * 0.3;
      });
      
      // Rotate energy rings
      rings.forEach((ring, index) => {
        ring.rotation.x += 0.01 + index * 0.005;
        ring.rotation.z += 0.02 + index * 0.003;
        ring.scale.setScalar(1 + Math.sin(timeRef.current * 1.5 + index) * 0.1);
      });
      
      // Animate central core
      centralCore.rotation.x += 0.01;
      centralCore.rotation.y += 0.02;
      centralCore.scale.setScalar(1 + Math.sin(timeRef.current * 2) * 0.15);
      
      // Animate particles
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += (Math.random() - 0.5) * 0.005;
        positions[i3 + 1] += (Math.random() - 0.5) * 0.005;
        positions[i3 + 2] += (Math.random() - 0.5) * 0.005;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      
      // Animate camera
      camera.position.x = Math.sin(timeRef.current * 0.4) * 3;
      camera.position.y = Math.cos(timeRef.current * 0.3) * 1.5;
      camera.lookAt(0, 0, 0);
      
      // Animate lights
      pointLight1.position.x = Math.sin(timeRef.current * 0.6) * 5;
      pointLight2.position.y = Math.cos(timeRef.current * 0.8) * 3;
      pointLight3.position.z = Math.sin(timeRef.current * 0.4) * 5;
      
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

  // Progress animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressValue(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setShowBurst(true);
            setTimeout(() => {
              onComplete();
            }, 1000);
          }, 300);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Loading steps animation
  useEffect(() => {
    const stepDuration = duration / loadingSteps.length;
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, [duration, loadingSteps.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />
      
      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Unique 3D Text - Fitted above logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.h1
            className="text-8xl md:text-6xl font-bold text-white"
            style={{
              textShadow: '0 0 30px rgba(255, 255, 255, 0.9), 0 0 60px rgba(255, 255, 255, 0.6), 0 0 90px rgba(255, 255, 255, 0.3), 0 0 120px rgba(0, 255, 255, 0.2)',
              fontFamily: "'Bungee Spice', cursive, sans-serif",
              letterSpacing: '0.25em',
              fontWeight: '900',
              textTransform: 'uppercase',
              transform: 'perspective(1000px) rotateX(8deg) scale(1.02)',
              filter: 'drop-shadow(0 0 25px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 40px rgba(0, 255, 255, 0.3))',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              background: 'linear-gradient(45deg, #ffffff, #00ffff, #ffffff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
            whileHover={{
              scale: 1.05,
              textShadow: '0 0 50px rgba(255, 255, 255, 1), 0 0 100px rgba(255, 255, 255, 0.8)'
            }}
            animate={{
              textShadow: [
                '0 0 30px rgba(255, 255, 255, 0.9), 0 0 60px rgba(255, 255, 255, 0.6), 0 0 90px rgba(255, 255, 255, 0.3)',
                '0 0 50px rgba(255, 255, 255, 1), 0 0 100px rgba(255, 255, 255, 0.8), 0 0 150px rgba(255, 255, 255, 0.5)',
                '0 0 30px rgba(255, 255, 255, 0.9), 0 0 60px rgba(255, 255, 255, 0.6), 0 0 90px rgba(255, 255, 255, 0.3)'
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            AI PREDICTION AUTH PAGE
          </motion.h1>
        </motion.div>

        {/* Loading Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-center mb-8"
          >
            <motion.h2
              className="text-6xl md:text-6xl font-bold text-white metal-mania-regular"
              style={{
                textShadow: '0 0 15px rgba(0, 255, 255, 0.7), 0 0 30px rgba(0, 255, 255, 0.4)',
                fontFamily: "'Metal Mania', system-ui",
                letterSpacing: '0.1em',
                fontWeight: '600',
                WebkitTextStroke: '1px rgba(0, 255, 255, 0.5)',
                filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.4))',
                transform: 'perspective(600px) rotateX(2deg)'
              }}
            >
              {loadingSteps[currentStep]}
            </motion.h2>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="w-80 md:w-96 h-4 bg-gray-800 rounded-full overflow-hidden border border-cyan-400/30">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
            style={{
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)'
            }}
          />
        </div>

        {/* Progress Percentage */}
        <motion.div
          className="mt-4 text-2xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            textShadow: '0 0 10px rgba(0, 255, 255, 0.6), 0 0 20px rgba(0, 255, 255, 0.3)',
            fontFamily: "'Metal Mania', system-ui",
            WebkitTextStroke: '1px rgba(0, 255, 255, 0.4)',
            filter: 'drop-shadow(0 0 5px rgba(0, 255, 255, 0.3))'
          }}
        >
          {Math.round(progressValue)}%
        </motion.div>
      </div>

      {/* Burst Effect */}
      <AnimatePresence>
        {showBurst && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-20 pointer-events-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400 opacity-40" />
            <div className="absolute inset-0 bg-white opacity-30" />
          </motion.div>
        )}
      </AnimatePresence>

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

export default MindBlowing3DLoading; 