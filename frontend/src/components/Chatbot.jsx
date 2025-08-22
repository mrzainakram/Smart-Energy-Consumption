import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = ({ isDarkMode = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your Smart Energy Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return 'Hello! How can I assist you with energy consumption analysis today?';
    }
    
    if (input.includes('prediction') || input.includes('forecast')) {
      return 'I can help you with energy consumption predictions! Enter your bill data and appliance information to get accurate forecasts.';
    }
    
    if (input.includes('seasonal') || input.includes('season')) {
      return 'Seasonal factors affect energy consumption significantly. Summer months typically see 40% higher usage due to AC, while winter shows 20% increase for heating.';
    }
    
    if (input.includes('save') || input.includes('efficient')) {
      return 'To save energy: Use appliances during off-peak hours (11 PM - 6 AM), set AC to 24°C, use LED lights, and maintain appliances regularly.';
    }
    
    if (input.includes('bill') || input.includes('cost')) {
      return 'Your bill depends on consumption units and LESCO slab rates. I can help calculate your bill and suggest ways to reduce costs.';
    }
    
    if (input.includes('compare') || input.includes('house')) {
      return 'I can compare different houses based on efficiency factors like occupants, appliances, insulation, and solar panels. Try the house comparison feature!';
    }
    
    return 'I\'m here to help with energy consumption analysis, predictions, and optimization tips. Feel free to ask about seasonal factors, bill calculations, or energy-saving advice!';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        } text-white`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-24 right-6 z-40 w-80 h-96 rounded-2xl shadow-2xl border-2 ${
              isDarkMode 
                ? 'bg-black/90 backdrop-blur-xl border-cyan-400/30' 
                : 'bg-white/90 backdrop-blur-xl border-blue-400/30'
            } flex flex-col`}
          >
            {/* Header */}
            <div className={`p-4 border-b ${
              isDarkMode ? 'border-cyan-400/30' : 'border-blue-400/30'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  isDarkMode ? 'bg-cyan-400' : 'bg-blue-400'
                }`}></div>
                <h3 className={`font-bold ${
                  isDarkMode ? 'text-cyan-300' : 'text-blue-700'
                }`}>
                  Smart Energy Assistant
                </h3>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.type === 'user'
                      ? isDarkMode 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-blue-500 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-200' 
                        : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-cyan-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                    isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
                  }`}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${
              isDarkMode ? 'border-cyan-400/30' : 'border-blue-400/30'
            }`}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about energy consumption..."
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                    isDarkMode 
                      ? 'bg-gray-800 text-white border border-cyan-400/30 focus:border-cyan-400' 
                      : 'bg-white text-gray-800 border border-blue-400/30 focus:border-blue-400'
                  } focus:outline-none`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className={`px-4 py-2 rounded-lg ${
                    inputMessage.trim()
                      ? isDarkMode 
                        ? 'bg-cyan-500 hover:bg-cyan-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                      : isDarkMode 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gray-300 cursor-not-allowed'
                  } text-white transition-colors duration-200`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot; 