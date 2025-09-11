import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntegratedChatbot = ({ isOpen, onClose }) => {
  const [chatbotUrl, setChatbotUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get chatbot URL from environment variables
    const url = import.meta.env.VITE_STREAMLIT_CHATBOT_URL || 'https://smartenergyconsumption.streamlit.app';
    setChatbotUrl(url);
    setIsLoading(false);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-lg">Smart Energy AI Assistant</h3>
                <p className="text-sm opacity-90">Ask me about energy consumption, savings, and more!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Chatbot Content */}
          <div className="h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading AI Assistant...</p>
                </div>
              </div>
            ) : (
              <iframe
                src={chatbotUrl}
                className="w-full h-full border-0"
                title="Smart Energy AI Chatbot"
                allow="microphone; camera"
                sandbox="allow-same-origin allow-scripts allow-forms"
                loading="lazy"
              />
            )}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-50 p-3 text-center text-sm text-gray-600">
            💡 Tip: Ask about energy bills, saving tips, or solar options
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IntegratedChatbot;