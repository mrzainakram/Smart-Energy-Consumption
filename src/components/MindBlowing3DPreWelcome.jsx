import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const MindBlowing3DPreWelcome = ({ onComplete, duration = 5000 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  const [phase, setPhase] = useState('fadeIn'); // fadeIn, display, fadeOut
  const [showParticleBurst, setShowParticleBurst] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.Fog(0x000011, 1, 100);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.set(0, 0, 15); // Start from distance

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
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Point lights for volumetric effect
    const pointLight1 = new THREE.PointLight(0x00ffff, 3, 15);
    pointLight1.position.set(-5, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 3, 15);
    pointLight2.position.set(5, -3, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xff8800, 3, 15);
    pointLight3.position.set(0, 5, -5);
    scene.add(pointLight3);

    // React-like Energy Structure (Electrons and Protons)
    const electronCount = 30;
    const protonCount = 15;
    const electrons = [];
    const protons = [];

    // Create central energy core (like React's center)
    const coreGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.9,
      emissive: 0x00ffff,
      emissiveIntensity: 0.6
    });
    const energyCore = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(energyCore);

    // Create electrons (smaller, orbiting around core)
    for (let i = 0; i < electronCount; i++) {
      const electronGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const electronMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        emissive: 0x00ffff,
        emissiveIntensity: 0.4
      });

      const electron = new THREE.Mesh(electronGeometry, electronMaterial);
      const angle = (i / electronCount) * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      electron.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.5,
        (Math.random() - 0.5) * 2
      );
      scene.add(electron);
      electrons.push({ mesh: electron, angle: angle, radius: radius, speed: 0.02 + Math.random() * 0.01 });
    }

    // Create protons (larger, connected to core)
    for (let i = 0; i < protonCount; i++) {
      const protonGeometry = new THREE.SphereGeometry(0.15, 12, 12);
      const protonMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.9,
        emissive: 0xff6600,
        emissiveIntensity: 0.5
      });

      const proton = new THREE.Mesh(protonGeometry, protonMaterial);
      const angle = (i / protonCount) * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1;
      proton.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.3,
        (Math.random() - 0.5) * 1
      );
      scene.add(proton);
      protons.push({ mesh: proton, angle: angle, radius: radius, speed: 0.01 + Math.random() * 0.005 });
    }

    // Energy connection lines (like React's connecting lines)
    const connectionLines = [];
    for (let i = 0; i < 20; i++) {
      const startPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );
      const endPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4
      );

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.3
      });

      const connectionLine = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(connectionLine);
      connectionLines.push(connectionLine);
    }

    // 3D Lightning Arcs
    const lightningCount = 8;
    const lightnings = [];

    for (let i = 0; i < lightningCount; i++) {
      const lightningGeometry = new THREE.BufferGeometry();
      const lightningPoints = [];
      const lightningColors = [];

      const segments = 20;
      for (let j = 0; j < segments; j++) {
        const t = j / (segments - 1);
        const radius = 3 + Math.sin(t * Math.PI * 2) * 0.5;
        const angle = (i / lightningCount) * Math.PI * 2 + t * 0.5;

        lightningPoints.push(
          Math.cos(angle) * radius,
          (t - 0.5) * 6,
          Math.sin(angle) * radius
        );

        const color = new THREE.Color();
        color.setHSL(0.6, 1, 0.7);
        lightningColors.push(color.r, color.g, color.b);
      }

      lightningGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lightningPoints, 3));
      lightningGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lightningColors, 3));

      const lightningMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });

      const lightning = new THREE.Line(lightningGeometry, lightningMaterial);
      scene.add(lightning);
      lightnings.push(lightning);
    }

    // Floating Energy Orbs
    const orbCount = 12;
    const orbs = [];

    for (let i = 0; i < orbCount; i++) {
      const orbGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.2, 16, 16);
      const orbMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 1, 0.6),
        transparent: true,
        opacity: 0.8,
        emissive: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 1, 0.3),
        emissiveIntensity: 0.5
      });

      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      scene.add(orb);
      orbs.push(orb);
    }

    // Particle burst system
    const particleCount = 300;
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
      color.setHSL(Math.random() * 0.3 + 0.5, 1, 0.6);
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

      // Animate energy core
      energyCore.rotation.y += 0.01;
      energyCore.scale.setScalar(1 + Math.sin(timeRef.current * 2) * 0.1);
      energyCore.material.opacity = 0.7 + Math.sin(timeRef.current * 1.5) * 0.2;

      // Animate electrons (orbiting around core like React logo)
      electrons.forEach((electron, index) => {
        electron.angle += electron.speed;
        electron.mesh.position.x = Math.cos(electron.angle) * electron.radius;
        electron.mesh.position.y = Math.sin(electron.angle) * electron.radius * 0.5;
        electron.mesh.scale.setScalar(1 + Math.sin(timeRef.current * 3 + index) * 0.2);
        electron.mesh.material.opacity = 0.6 + Math.sin(timeRef.current * 2 + index) * 0.3;
      });

      // Animate protons (connected to core)
      protons.forEach((proton, index) => {
        proton.angle += proton.speed;
        proton.mesh.position.x = Math.cos(proton.angle) * proton.radius;
        proton.mesh.position.y = Math.sin(proton.angle) * proton.radius * 0.3;
        proton.mesh.scale.setScalar(1 + Math.sin(timeRef.current * 1.5 + index) * 0.15);
        proton.mesh.material.opacity = 0.8 + Math.sin(timeRef.current * 1 + index) * 0.1;
      });

      // Animate connection lines
      connectionLines.forEach((line, index) => {
        line.material.opacity = 0.2 + Math.sin(timeRef.current * 1.5 + index) * 0.2;
      });

      // Animate lightning arcs
      lightnings.forEach((lightning, index) => {
        lightning.rotation.y += 0.01 + index * 0.002;
        lightning.material.opacity = 0.3 + Math.sin(timeRef.current * 3 + index) * 0.5;
      });

      // Animate orbs
      orbs.forEach((orb, index) => {
        orb.rotation.x += 0.01;
        orb.rotation.y += 0.02;
        orb.scale.setScalar(1 + Math.sin(timeRef.current * 2 + index) * 0.2);
        orb.position.y += Math.sin(timeRef.current + index) * 0.01;
        orb.position.x += Math.cos(timeRef.current * 0.7 + index) * 0.01;
      });

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
      if (phase === 'fadeIn') {
        camera.position.z = 15 - (timeRef.current * 2);
        camera.lookAt(0, 0, 0);
      } else if (phase === 'display') {
        camera.position.x = Math.sin(timeRef.current * 0.3) * 1;
        camera.position.y = Math.cos(timeRef.current * 0.2) * 0.5;
        camera.lookAt(0, 0, 0);
      } else if (phase === 'fadeOut') {
        camera.position.z += 0.1;
        camera.lookAt(0, 0, 0);
      }

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
  }, [phase]);

  // Phase management - Extended timing for effects and text
  useEffect(() => {
    // Fade in phase - Keep longer for text animations
    setTimeout(() => {
      setPhase('display');
    }, 100); // 10 seconds - extended for effects

    // Particle burst at 4 seconds
    setTimeout(() => {
      setShowParticleBurst(true);
    }, 10000);

    // Fade out phase - After extended display time
    setTimeout(() => {
      setPhase('fadeOut');
      setTimeout(() => {
        onComplete();
      }, 1000); // 1 second fadeOut effect
    }, 12000); // 10 seconds total

    return () => {
      // Cleanup timers if component unmounts
    };
  }, [duration, onComplete]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Pre-Welcome Text */}
        <AnimatePresence>
          {(phase === 'fadeIn' || phase === 'display') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="text-center"
            >
              {/* Bungee Spice font import */}
              <link
                href="https://fonts.googleapis.com/css2?family=Bungee+Spice&display=swap"
                rel="stylesheet"
              />
              {/* Welcome Text - Appears first */}
              <motion.h2
                className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 mb-6"
                style={{
                  textShadow: '0 0 25px rgba(255, 165, 0, 0.9), 0 0 50px rgba(255, 140, 0, 0.6), 0 0 75px rgba(255, 69, 0, 0.4), 0 0 100px rgba(255, 0, 0, 0.2)',
                  WebkitTextStroke: '2px rgba(255, 165, 0, 0.8)',
                  fontFamily: "'Bungee Spice', cursive, sans-serif",
                  letterSpacing: '0.1em',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  transform: 'perspective(900px) rotateX(4deg)',
                  filter: 'drop-shadow(0 0 20px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 40px rgba(255, 140, 0, 0.4))'
                }}
                initial={{ opacity: 0, y: -50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0, duration: 1.7, ease: "easeOut" }}
                whileHover={{
                  scale: 1.03,
                  textShadow: '0 0 30px rgba(255, 165, 0, 1), 0 0 60px rgba(255, 140, 0, 0.8), 0 0 90px rgba(255, 69, 0, 0.6), 0 0 120px rgba(255, 0, 0, 0.3)',
                  filter: 'drop-shadow(0 0 25px rgba(255, 165, 0, 1)) drop-shadow(0 0 50px rgba(255, 140, 0, 0.6))'
                }}
              >
                Welcome to
              </motion.h2>
              
              {/* Title Name - Appears second with 2 second delay */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
                style={{
                  textShadow: '0 0 30px rgba(255, 165, 0, 0.9), 0 0 60px rgba(255, 140, 0, 0.6), 0 0 90px rgba(255, 69, 0, 0.4), 0 0 120px rgba(255, 0, 0, 0.2)',
                  WebkitTextStroke: '3px rgba(255, 165, 0, 0.8)',
                  fontFamily: "'Bungee Spice', cursive, sans-serif",
                  letterSpacing: '0.25em',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  transform: 'perspective(1000px) rotateX(5deg)',
                  filter: 'drop-shadow(0 0 25px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 50px rgba(255, 140, 0, 0.4))'
                }}
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 3, duration: 1.7, ease: "easeOut" }}
                whileHover={{
                  scale: 1.05,
                  textShadow: '0 0 40px rgba(255, 165, 0, 1), 0 0 80px rgba(255, 140, 0, 0.8), 0 0 120px rgba(255, 69, 0, 0.6), 0 0 160px rgba(255, 0, 0, 0.3)',
                  transform: 'perspective(1000px) rotateX(8deg) scale(1.05)',
                  filter: 'drop-shadow(0 0 30px rgba(255, 165, 0, 1)) drop-shadow(0 0 50px rgba(255, 140, 0, 0.6))'
                }}
              >
                <span style={{ display: 'block', letterSpacing: '0.05em' }}>SMART ENERGY</span>
                <span style={{ display: 'block', letterSpacing: '0.05em' }}>CONSUMPTION</span>
              </motion.h1>
              {/* Initializing Text - Appears last with 6 second delay */}
              <motion.p
                className="mt-6 text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500"
                style={{
                  textShadow: '0 0 20px rgba(255, 165, 0, 0.8), 0 0 40px rgba(255, 140, 0, 0.5), 0 0 60px rgba(255, 69, 0, 0.3), 0 0 80px rgba(255, 0, 0, 0.2)',
                  WebkitTextStroke: '1.5px rgba(255, 165, 0, 0.7)',
                  fontFamily: "'Bungee Spice', cursive, sans-serif",
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  transform: 'perspective(800px) rotateX(3deg)',
                  filter: 'drop-shadow(0 0 15px rgba(255, 165, 0, 0.6)) drop-shadow(0 0 30px rgba(255, 140, 0, 0.3))',
                  letterSpacing: '0.7em'
                }}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 3, duration: 1, ease: "easeOut" }}
                whileHover={{
                  scale: 1.02,
                  textShadow: '0 0 25px rgba(255, 165, 0, 1), 0 0 50px rgba(255, 140, 0, 0.7), 0 0 75px rgba(255, 69, 0, 0.5), 0 0 100px rgba(255, 0, 0, 0.3)',
                  filter: 'drop-shadow(0 0 20px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 40px rgba(255, 140, 0, 0.4))',
                  y: -2
                }}
              >
                Initializing...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particle Burst Effect */}
        <AnimatePresence>
          {showParticleBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 z-20 pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400 opacity-40" />
              <div className="absolute inset-0 bg-white opacity-30" />
            </motion.div>
          )}
        </AnimatePresence>
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

export default MindBlowing3DPreWelcome;