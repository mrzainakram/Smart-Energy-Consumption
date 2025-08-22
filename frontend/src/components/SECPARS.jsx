import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const SECPARS = ({ theme = 'dark' }) => {
    const [chatHistory, setChatHistory] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVoiceRecording, setIsVoiceRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [language, setLanguage] = useState('en');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [recognition, setRecognition] = useState(null);

    const chatEndRef = useRef(null);
    const mountRef = useRef(null);
    const scene = useRef(null);
    const camera = useRef(null);
    const renderer = useRef(null);
    const stars = useRef([]);

    const backendUrl = 'http://localhost:8001';
    const streamlitUrl = 'http://localhost:8501';

    useEffect(() => {
        scene.current = new THREE.Scene();
        camera.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer.current = new THREE.WebGLRenderer({ alpha: true });
        renderer.current.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.current.domElement);

        const starGeometry = new THREE.SphereGeometry(0.5, 24, 24);
        const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

        for (let i = 0; i < 500; i++) {
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
            stars.current.push(star);
            scene.current.add(star);
        }

        camera.current.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);
            stars.current.forEach(star => {
                star.rotation.x += 0.001;
                star.rotation.y += 0.001;
            });
            renderer.current.render(scene.current, camera.current);
        };
        animate();

        const handleResize = () => {
            camera.current.aspect = window.innerWidth / window.innerHeight;
            camera.current.updateProjectionMatrix();
            renderer.current.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && renderer.current) {
                mountRef.current.removeChild(renderer.current.domElement);
                renderer.current.dispose();
            }
        };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const sendMessage = async (message, isUser = true) => {
        if (!message.trim() && !imageFile) return;

        const newMessage = {
            id: Date.now(),
            text: message,
            sender: isUser ? 'user' : 'ai',
            timestamp: new Date().toLocaleTimeString()
        };
        setChatHistory((prev) => [...prev, newMessage]);
        setInputMessage('');
        setImageFile(null);
        setImagePreviewUrl(null);

        if (isUser) {
            setIsLoading(true);
            try {
                const formData = new FormData();
                formData.append('question', message);
                if (imageFile) {
                    formData.append('image', imageFile);
                }

                const response = await fetch(`${backendUrl}/api/secpars/ask/`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    sendMessage(data.response, false);
                } else {
                    sendMessage(`Error: ${data.detail || 'Failed to get response from AI.'}`, false);
                }
            } catch (error) {
                console.error('API Error:', error);
                sendMessage('Network error. Please try again.', false);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setImageFile(null);
            setImagePreviewUrl(null);
        }
    };

    const toggleLanguage = () => {
        setLanguage(prevLang => prevLang === 'en' ? 'ur' : 'en');
        setChatHistory([]);
    };

    const inputClasses = `w-full p-3 rounded-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-blue-500' : 'focus:ring-indigo-500'}`;
    const buttonClasses = `px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'}`;
    const chatBubbleClasses = (sender) =>
        `p-3 rounded-lg max-w-[70%] ${sender === 'user'
            ? (theme === 'dark' ? 'bg-blue-600 text-white self-end rounded-br-none' : 'bg-blue-500 text-white self-end rounded-br-none')
            : (theme === 'dark' ? 'bg-gray-700 text-gray-100 self-start rounded-bl-none' : 'bg-gray-200 text-gray-800 self-start rounded-bl-none')
        }`;

    return (
        <div className={`relative min-h-[80vh] flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg shadow-xl overflow-hidden`}>
            <div ref={mountRef} className="absolute inset-0 z-0"></div>
            <div className="relative z-10 flex flex-col flex-grow">
                <header className={`p-4 flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>SECPARS Chatbot</h2>
                    <button onClick={toggleLanguage} className={buttonClasses}>
                        {language === 'en' ? 'اردو (Urdu)' : 'English'}
                    </button>
                </header>

                <div className="flex flex-grow overflow-hidden">
                    <div className="flex flex-col flex-grow p-4 overflow-y-auto space-y-4">
                        {chatHistory.length === 0 && (
                            <div className="flex flex-col items-center justify-center flex-grow text-center text-gray-500">
                                <p>Start a conversation with SECPARS!</p>
                                <p>Ask about energy saving tips, predictions, or bill analysis.</p>
                            </div>
                        )}
                        {chatHistory.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={chatBubbleClasses(msg.sender)}
                                >
                                    <p>{msg.text}</p>
                                    <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
                                </motion.div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className={`flex ${theme === 'dark' ? 'justify-start' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg rounded-bl-none ${theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'} flex items-center`}>
                                    <div className="animate-pulse flex space-x-1">
                                        <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full delay-150"></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full delay-300"></div>
                                    </div>
                                    <span className="ml-2">SECPARS is typing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className={`w-1/3 p-4 border-l ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'} hidden lg:block`}>
                        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Streamlit Admin Panel</h3>
                        <iframe
                            src={streamlitUrl}
                            title="Streamlit Admin Panel"
                            className="w-full h-[calc(100%-40px)] border-none rounded-md"
                            allow="microphone"
                        ></iframe>
                        <p className={`text-sm mt-2 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Ensure Streamlit app is running on {streamlitUrl}</p>
                    </div>
                </div>

                <div className={`p-4 border-t flex flex-col ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                    {imagePreviewUrl && (
                        <div className="mb-2 relative w-24 h-24 rounded-md overflow-hidden">
                            <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button onClick={() => { setImageFile(null); setImagePreviewUrl(null); }} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">
                                X
                            </button>
                        </div>
                    )}
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(inputMessage); }}
                            placeholder={language === 'en' ? 'Type your message...' : 'اپنا پیغام لکھیں...'}
                            className={inputClasses}
                            disabled={isLoading || isVoiceRecording}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className={`${buttonClasses} flex items-center justify-center cursor-pointer`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </label>
                        <button
                            onClick={() => sendMessage(inputMessage)}
                            className={buttonClasses}
                            disabled={isLoading || (!inputMessage.trim() && !imageFile)}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SECPARS;
