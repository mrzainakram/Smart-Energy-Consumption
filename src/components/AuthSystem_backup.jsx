import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const AuthSystem = ({ onAuthSuccess, theme = 'dark', onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState('');
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

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

    // 3D DNA Helix Background (like loading page)
    const createDNAHelixBackground = () => {
      // Central sphere (planet/moon)
      const centralSphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
      const centralSphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.9,
        shininess: 100
      });
      
      const centralSphere = new THREE.Mesh(centralSphereGeometry, centralSphereMaterial);
      centralSphere.position.set(0, 0, 0);
      scene.add(centralSphere);

      // Orbital rings
      const innerRingGeometry = new THREE.RingGeometry(2.5, 2.8, 64);
      const innerRingMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff, // Purple
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      
      const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
      innerRing.rotation.x = Math.PI / 2;
      scene.add(innerRing);

      const outerRingGeometry = new THREE.RingGeometry(3.5, 3.8, 64);
      const outerRingMaterial = new THREE.MeshBasicMaterial({
        color: 0xff69b4, // Magenta-pink
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      
      const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
      outerRing.rotation.x = Math.PI / 2;
      scene.add(outerRing);

      // Orbiting spheres
      const orbitingSpheres = [];
      const sphereColors = [0xff00ff, 0x00ffff, 0xff69b4, 0x00ff00]; // Purple, cyan, magenta, green
      
      for (let i = 0; i < 12; i++) {
        const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const sphereMaterial = new THREE.MeshPhongMaterial({
          color: sphereColors[i % sphereColors.length],
          transparent: true,
          opacity: 0.8,
          emissive: sphereColors[i % sphereColors.length],
          emissiveIntensity: 0.3
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2.5 + (i % 2) * 1.5; // Alternate between inner and outer orbit
        
        sphere.position.set(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        );
        scene.add(sphere);
        orbitingSpheres.push(sphere);
      }

      // Square stars (like in image)
      const squareStars = [];
      for (let i = 0; i < 100; i++) {
        const starGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
        const starMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.9),
          transparent: true,
          opacity: 0.8
        });
        
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25
        );
        star.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        scene.add(star);
        squareStars.push(star);
      }

      return { centralSphere, innerRing, outerRing, orbitingSpheres, squareStars };
    };

    const dnaBackground = createDNAHelixBackground();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate central sphere (slower)
      dnaBackground.centralSphere.rotation.y += 0.005;
      dnaBackground.centralSphere.material.opacity = 0.8 + Math.sin(Date.now() * 0.0005) * 0.1;

      // Animate orbital rings (slower)
      dnaBackground.innerRing.rotation.y += 0.002;
      dnaBackground.innerRing.material.opacity = 0.6 + Math.sin(Date.now() * 0.0003) * 0.2;

      dnaBackground.outerRing.rotation.y += 0.001;
      dnaBackground.outerRing.material.opacity = 0.5 + Math.sin(Date.now() * 0.0002) * 0.2;

      // Animate orbiting spheres (slower)
      dnaBackground.orbitingSpheres.forEach((sphere, index) => {
        const angle = (Date.now() * 0.0005 + index * 0.3) % (Math.PI * 2);
        const radius = 2.5 + (index % 2) * 1.5;
        
        sphere.position.x = Math.cos(angle) * radius;
        sphere.position.z = Math.sin(angle) * radius;
        sphere.rotation.y += 0.01;
        sphere.material.opacity = 0.7 + Math.sin(Date.now() * 0.001 + index) * 0.2;
      });

      // Animate square stars (slower)
      dnaBackground.squareStars.forEach((star, index) => {
        star.rotation.x += 0.005 * (index % 3 + 1);
        star.rotation.y += 0.004 * (index % 4 + 1);
        star.rotation.z += 0.003 * (index % 5 + 1);
        star.position.y += Math.sin(Date.now() * 0.0005 + index) * 0.002;
        star.material.opacity = 0.6 + Math.sin(Date.now() * 0.0008 + index) * 0.3;
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

  // OTP Timer
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const validateGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate Gmail
    if (!validateGmail(email)) {
      setError('Please use a valid Gmail address');
      setIsLoading(false);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          username: username || email.split('@')[0] 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('OTP sent to your Gmail!');
        setShowOtp(true);
        setOtpTimer(30);
      } else {
        setError(data.message || 'Sign up failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate Gmail
    if (!validateGmail(email)) {
      setError('Please use a valid Gmail address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/api/auth/signin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('OTP sent to your Gmail!');
        setShowOtp(true);
        setOtpTimer(30);
      } else {
        setError(data.message || 'Password is incorrect');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate Gmail
    if (!validateGmail(forgotPasswordEmail)) {
      setError('Please use a valid Gmail address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/api/auth/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('OTP sent to your Gmail!');
        setForgotPasswordStep(2); // Move to OTP step
        setOtpTimer(30);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8001/api/auth/verify-forgot-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: forgotPasswordEmail, 
          otp: forgotPasswordOtp 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('OTP verified! Set your new password.');
        setForgotPasswordStep(3); // Move to new password step
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/api/auth/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: forgotPasswordEmail, 
          otp: forgotPasswordOtp, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successfully! Please sign in.');
        // Reset everything and go back to sign in
        setShowForgotPassword(false);
        setForgotPasswordStep(1);
        setForgotPasswordEmail('');
        setForgotPasswordOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
        setError('');
        setSuccess('');
        // Show success message for 2 seconds then redirect
        setTimeout(() => {
          setIsSignUp(false);
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8001/api/auth/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.action === 'signup_success') {
          setSuccess('Account created successfully! Please sign in.');
          setShowOtp(false);
          setIsSignUp(false);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setUsername('');
          setOtp('');
        } else {
          setSuccess('Authentication successful!');
          localStorage.setItem('token', data.token);
          setTimeout(() => {
            onAuthSuccess(data.user);
          }, 1000);
        }
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8001/api/auth/resend-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('OTP resent!');
        setOtpTimer(30);
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <style>
        {`
          @keyframes whiteShine {
            0% {
              text-shadow: 0 0 20px rgba(255, 255, 255, 0.7), 0 0 40px rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 255, 255, 0.2);
              filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));
            }
            50% {
              text-shadow: 0 0 40px rgba(255, 255, 255, 1), 0 0 80px rgba(255, 255, 255, 0.7), 0 0 120px rgba(255, 255, 255, 0.4);
              filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.7));
            }
            100% {
              text-shadow: 0 0 20px rgba(255, 255, 255, 0.7), 0 0 40px rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 255, 255, 0.2);
              filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4));
            }
          }
        `}
      </style>
      {/* 3D Galaxy Background */}
      <div ref={mountRef} className="absolute inset-0 z-0" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Auth Card */}
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-cyan-400/30 p-8 shadow-2xl relative">
            {onBack && (
              <button
                onClick={onBack}
                className="absolute top-4 left-4 text-cyan-300 hover:text-cyan-200 transition-colors duration-300 z-20"
              >
                ← Back
              </button>
            )}
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2"
                  style={{
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.3)',
                    WebkitTextStroke: '1px rgba(255, 255, 255, 0.5)',
                    fontFamily: 'Orbitron, monospace',
                    letterSpacing: '0.15em',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))',
                    transform: 'perspective(600px) rotateX(3deg)'
                  }}>
                AI PREDICTION AUTH PAGE
              </h1>
              <p className="text-cyan-300 text-lg">
                {isSignUp ? 'Create Your Account' : 'Sign In to Continue'}
              </p>
            </motion.div>

            {/* Tabs */}
            <div className="flex mb-6 bg-black/20 rounded-lg p-1">
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                  !isSignUp 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                    : 'text-cyan-300 hover:text-cyan-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                  isSignUp 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                    : 'text-cyan-300 hover:text-cyan-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {!showOtp ? (
                <motion.form
                  key="auth-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={isSignUp ? handleSignUp : handleSignIn}
                  className="space-y-6"
                >
                  {/* Username Field (Sign Up Only) */}
                  {isSignUp && (
                    <div>
                                          <label className="block text-cyan-300 text-sm font-semibold mb-2">
                      Username
                   </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                        placeholder="Enter your username"
                        required
                      />
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-cyan-300 text-sm font-semibold mb-2">
                      Gmail Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      placeholder="Enter your Gmail address"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-cyan-300 text-sm font-semibold mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-300 transition-colors duration-200"
                      >
                        {showPassword ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field (Sign Up Only) */}
                  {isSignUp && (
                    <div>
                      <label className="block text-cyan-300 text-sm font-semibold mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-300 transition-colors duration-200"
                        >
                          {showConfirmPassword ? "👁️" : "🙈"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </motion.button>

                  {/* Forgot Password Link (Sign In Only) */}
                  {!isSignUp && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors duration-200 underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </motion.form>
              ) : (
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleOtpVerification}
                  className="space-y-6"
                >
                  {/* OTP Field */}
                  <div>
                    <label className="block text-cyan-300 text-sm font-semibold mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength="6"
                      required
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      OTP sent to {email}
                    </p>
                  </div>

                  {/* Timer */}
                  {otpTimer > 0 && (
                    <p className="text-center text-cyan-300">
                      Resend OTP in {otpTimer}s
                    </p>
                  )}

                  {/* Submit OTP Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      'Verify OTP'
                    )}
                  </motion.button>

                  {/* Resend OTP */}
                  {otpTimer === 0 && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={resendOtp}
                        disabled={isLoading}
                        className="text-cyan-300 hover:text-cyan-200 transition-colors duration-300 disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    </div>
                  )}

                  {/* Back to Auth */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowOtp(false);
                        setOtp('');
                        setError('');
                        setSuccess('');
                      }}
                      className="text-gray-400 hover:text-gray-300 transition-colors duration-300"
                    >
                      ← Back to {isSignUp ? 'Create Account' : 'Sign In'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Forgot Password Forms - Step Wise */}
            <AnimatePresence>
              {/* Step 1: Email Form */}
              {showForgotPassword && forgotPasswordStep === 1 && (
                <motion.form
                  key="forgot-password-email"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleForgotPasswordEmail}
                  className="space-y-6 mt-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-2">Forgot Password</h3>
                    <p className="text-gray-400">Enter your Gmail to receive OTP</p>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-cyan-300 text-sm font-semibold mb-2">
                      Gmail Address
                    </label>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                      placeholder="Enter your Gmail address"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending OTP...
                      </div>
                    ) : (
                      'Send OTP'
                    )}
                  </motion.button>

                  {/* Back to Sign In */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordStep(1);
                        setForgotPasswordEmail('');
                        setError('');
                        setSuccess('');
                      }}
                      className="text-cyan-300 hover:text-cyan-200 transition-colors duration-300"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 2: OTP Form */}
              {showForgotPassword && forgotPasswordStep === 2 && (
                <motion.form
                  key="forgot-password-otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleForgotPasswordOtp}
                  className="space-y-6 mt-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-2">Enter OTP</h3>
                    <p className="text-gray-400">OTP sent to {forgotPasswordEmail}</p>
                  </div>

                  {/* OTP Field */}
                  <div>
                    <label className="block text-cyan-300 text-sm font-semibold mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={forgotPasswordOtp}
                      onChange={(e) => setForgotPasswordOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength="6"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying OTP...
                      </div>
                    ) : (
                      'Verify OTP'
                    )}
                  </motion.button>

                  {/* Back to Email */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordStep(1);
                        setForgotPasswordOtp('');
                        setError('');
                        setSuccess('');
                      }}
                      className="text-cyan-300 hover:text-cyan-200 transition-colors duration-300"
                    >
                      ← Back to Email
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 3: New Password Form */}
              {showForgotPassword && forgotPasswordStep === 3 && (
                <motion.form
                  key="forgot-password-reset"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleForgotPasswordReset}
                  className="space-y-6 mt-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-2">Set New Password</h3>
                    <p className="text-gray-400">Create your new password</p>
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label className="block text-cyan-300 text-sm font-semibold mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-300 transition-colors duration-200"
                      >
                        {showPassword ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password Field */}
                  <div>
                    <label className="text-cyan-300 text-sm font-semibold mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-300 transition-colors duration-200"
                        >
                        {showConfirmPassword ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Resetting Password...
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </motion.button>

                  {/* Back to OTP */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordStep(2);
                        setNewPassword('');
                        setConfirmNewPassword('');
                        setError('');
                        setSuccess('');
                      }}
                      className="text-cyan-300 hover:text-cyan-200 transition-colors duration-300"
                    >
                      ← Back to OTP
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>


                <motion.form
                  key="forgot-password-otp-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  onSubmit={handleForgotPasswordOtp}
                  className="space-y-6 mt-6"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-2">Reset Password</h3>
                    <p className="text-gray-400">Enter OTP and new password</p>
                  </div>

                  {/* OTP Field */}
                  <div>
                    <label className="block text-cyan-300 text-sm font-semibold mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={forgotPasswordOtp}
                      onChange={(e) => setForgotPasswordOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength="6"
                      required
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      OTP sent to {forgotPasswordEmail}
                    </p>
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label className="block text-cyan-300 text-sm font-semibold mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-300 transition-colors duration-200"
                      >
                        {showPassword ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password Field */}
                  <div>
                    <label className="text-cyan-300 text-sm font-semibold mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-black/30 border border-cyan-400/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-300 transition-colors duration-200"
                        >
                        {showConfirmPassword ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Resetting Password...
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </motion.button>

                  {/* Back to OTP */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordStep(2);
                        setNewPassword('');
                        setConfirmNewPassword('');
                        setError('');
                        setSuccess('');
                      }}
                      className="text-cyan-300 hover:text-cyan-200 transition-colors duration-300"
                    >
                      ← Back to OTP
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Error/Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-center"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-center"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthSystem; 