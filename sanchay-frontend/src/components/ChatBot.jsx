// ChatBot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaPaperPlane, FaTimes } from 'react-icons/fa';

const recommendations = {
  en: [
    'What is your purpose?',
    'How can I stay safe?',
    'Tell me about cyber safety.',
    'What to do in case of emergency?'
  ],
  hi: [
    'आपका उद्देश्य क्या है?',
    'मैं सुरक्षित कैसे रहूं?',
    'साइबर सुरक्षा क्या है?',
    'आपातकाल की स्थिति में क्या करें?'
  ]
};

const responses = {
  en: {
    'What is your purpose?': "I'm Sakhi, an AI-powered cybersecurity assistant designed to help users detect and prevent digital fraud.",
    'How can I stay safe?': 'Avoid unknown links, verify UPI IDs, never share OTPs, and use strong passwords.',
    'Tell me about cyber safety.': 'Cyber safety involves protecting your digital identity from scams, phishing, and fraud.',
    'What to do in case of emergency?': 'Immediately stop interaction, report the fraud, and contact official support channels.'
  },
  hi: {
    'आपका उद्देश्य क्या है?': 'मैं सखी हूं, एक एआई-संचालित साइबर सुरक्षा सहायक।',
    'मैं सुरक्षित कैसे रहूं?': 'अज्ञात लिंक से बचें, OTP साझा न करें।',
    'साइबर सुरक्षा क्या है?': 'डिजिटल धोखाधड़ी से अपनी पहचान की रक्षा करना।',
    'आपातकाल की स्थिति में क्या करें?': 'तुरंत संपर्क बंद करें और रिपोर्ट करें।'
  }
};

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'sakhi', text: 'Hi 👋 I’m Sakhi, your AI cyber safety assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en');
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // 🔊 Voice Output
  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    synth.cancel();
    synth.speak(utter);
  };

  // 🎤 Voice Input
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;

      recognition.onresult = (event) => {
        setInput(event.results[0][0].transcript);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🚀 MAIN SEND FUNCTION (STATIC + DYNAMIC)
  const handleSend = async (text = null) => {
    const userInput = text || input.trim();
    if (!userInput) return;

    const updatedMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    // ✅ 1. Static predefined questions
    if (responses[language][userInput]) {
      const reply = responses[language][userInput];
      setTimeout(() => {
        setMessages([...updatedMessages, { sender: 'sakhi', text: reply }]);
        speak(reply);
        setIsTyping(false);
      }, 500);
      return;
    }

    // ✅ 2. Dynamic AI call
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });

      const data = await response.json();

      setMessages([...updatedMessages, { sender: 'sakhi', text: data.reply }]);
      speak(data.reply);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { sender: 'sakhi', text: '⚠️ Unable to connect to Sakhi AI services right now.' }
      ]);
    }

    setIsTyping(false);
  };

  const startListening = () => {
    recognitionRef.current?.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-2xl rounded-xl w-[360px] h-[550px] flex flex-col z-50 border-2 border-orange-300">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-green-300 text-white p-3 rounded-t-xl flex justify-between items-center">
        <h2 className="font-semibold">🤖 Sakhi AI</h2>
        <button onClick={onClose}><FaTimes /></button>
      </div>

      {/* Chat */}
      <div className="flex-1 p-3 overflow-y-auto bg-orange-50">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === 'sakhi' ? 'text-left' : 'text-right'}`}>
            <span className={`inline-block px-3 py-2 rounded-xl text-sm ${
              msg.sender === 'sakhi' ? 'bg-emerald-100' : 'bg-orange-200'
            }`}>
              {msg.text}
            </span>
          </div>
        ))}
        {isTyping && <p className="text-xs italic">Sakhi is analyzing...</p>}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      <div className="p-2 flex flex-wrap gap-2">
        {recommendations[language].map((q, i) => (
          <button key={i} onClick={() => handleSend(q)}
            className="text-xs bg-orange-100 px-3 py-1 rounded-full">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 flex gap-2 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Sakhi..."
          className="flex-1 border rounded-full px-4 py-1 text-sm"
        />
        <button onClick={() => handleSend()}><FaPaperPlane /></button>
        <button onMouseDown={startListening} onMouseUp={stopListening}><FaMicrophone /></button>
      </div>
    </div>
  );
};

export default ChatBot;
