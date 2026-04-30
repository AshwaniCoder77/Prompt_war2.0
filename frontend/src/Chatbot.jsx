import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { FaPaperPlane, FaRobot, FaMicrophone, FaVolumeUp, FaVolumeMute, FaStop } from 'react-icons/fa';
import { useLanguage } from './LanguageContext';
import ReactMarkdown from 'react-markdown';
import { API_BASE_URL } from './config';


export default function Chatbot() {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState([
    { text: "Hello! 👋 How can I help you with elections today?", sender: "bot" }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState(true);
  
  const messagesEndRef = useRef(null);
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const abortControllerRef = useRef(null);


  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        stopCurrentActions(); // Stop bot if user starts talking
      };


      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      const speechLangMap = {
        'en': 'en-IN', 'hi': 'hi-IN', 'bn': 'bn-IN', 'te': 'te-IN', 
        'mr': 'mr-IN', 'ta': 'ta-IN', 'ur': 'ur-IN', 'gu': 'gu-IN',
        'kn': 'kn-IN', 'ml': 'ml-IN'
      };
      recognitionRef.current.lang = speechLangMap[lang] || 'en-IN';
    }
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const stopCurrentActions = () => {
    // Stop any ongoing fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    // Stop any ongoing speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsLoading(false);
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setInput(''); // clear input when starting new dictation
      
      // Define onresult here so it captures current submitChat and other states
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        setInput(finalTranscript || interimTranscript);
        
        // Auto-submit when voice input stops and gives final transcript
        if (finalTranscript) {
           submitChat(finalTranscript);
           setInput('');
        }
      };

      try {
        recognitionRef.current.start();
      } catch(e) {
        console.error("Recognition start error", e);
      }
    } else if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const submitChat = async (textToSubmit) => {
    if (!textToSubmit.trim()) return;

    stopCurrentActions(); // Stop previous bot response if any

    setMessages(prev => [...prev, { text: textToSubmit, sender: "user" }]);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSubmit, mode, language: lang }),
        signal: controller.signal
      });


      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { text: data.reply, sender: "bot" }]);
        speakText(data.reply);
      } else {
        setMessages(prev => [...prev, { text: data.reply || "Sorry, I am having trouble connecting right now.", sender: "bot" }]);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        setMessages(prev => [...prev, { text: "Error connecting to the server.", sender: "bot" }]);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const currentInput = input;
    setInput('');
    submitChat(currentInput);
  };

  const speakText = async (text) => {
    if (!voiceOutput) return;
    
    // Strip markdown formatting for speech
    const cleanText = text.replace(/[*_#\[\]`]/g, '');

    try {
      const response = await fetch(`${API_BASE_URL}/api/speech/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, language: lang })
      });


      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => {
          if (audioRef.current === audio) audioRef.current = null;
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch TTS:", response.status, errorData);
        alert(`Audio Error: ${response.status}. Check backend logs.`);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      alert("Network Error: Could not connect to audio service.");
    }
  };

  return (
    <div className="chatbot-container" id="chatbot-section">
      <div className="chatbot-header">
        <div className="header-title">
          <div className="bot-icon"><FaRobot /></div>
          <div className="header-title-text">
            <h3>{t('nav.askAssistant')}</h3>
            <p>Online</p>
          </div>
        </div>
        <div className="mode-selector" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className="icon-btn" 
            style={{ width: '36px', height: '36px', fontSize: '1rem', background: 'transparent' }}
            onClick={() => setVoiceOutput(!voiceOutput)}
          >
            {voiceOutput ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.sender}`}>
            <div className={`message-bubble ${msg.sender}`}>
              {msg.sender === 'bot' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper bot">
            <div className="message-bubble bot typing-indicator"><span>.</span><span>.</span><span>.</span></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <img src="/robot.png" alt="3D Robot" className="floating-robot" />

      <form className="chatbot-input-container" onSubmit={handleSend}>
        <button 
          type="button" 
          className={`icon-btn ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <FaStop /> : <FaMicrophone />}
        </button>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isRecording ? "Recording... Click stop to send" : "Ask a question..."}
          disabled={isLoading || isRecording}
        />
        <button type="submit" className="icon-btn primary" disabled={isLoading || !input.trim() || isRecording}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}
