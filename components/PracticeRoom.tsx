
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PALLIATIVE_TOPICS } from '../constants';
import { getSimulationResponse } from '../services/gemini';
import { ChatMessage, Topic } from '../types';

// Extend window for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const PracticeRoom: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attendingComment, setAttendingComment] = useState<string | null>("I'm here to support. Lead the conversation, and I'll chime in with feedback.");
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const found = PALLIATIVE_TOPICS.find(t => t.id === topicId);
    if (found) {
      setTopic(found);
      setMessages([
        { role: 'patient', content: `Hello doctor. I'm feeling a bit overwhelmed... could we talk about ${found.title.toLowerCase()}?`, timestamp: Date.now() }
      ]);
    }

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setInputText(prev => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [topicId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, attendingComment]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !topic || loading) return;

    // Stop listening if sending
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const studentMsg: ChatMessage = { role: 'student', content: inputText, timestamp: Date.now() };
    const updatedMessages = [...messages, studentMsg];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const { patientResponse, attendingFeedback } = await getSimulationResponse(topic, updatedMessages);
      
      setMessages(prev => [...prev, { role: 'patient', content: patientResponse, timestamp: Date.now() }]);
      setAttendingComment(attendingFeedback);
    } catch (error) {
      console.error(error);
      setAttendingComment("I'm having trouble analyzing that. Take a breath and try rephrasing.");
    } finally {
      setLoading(false);
    }
  };

  if (!topic) return <div>Simulation not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
      {/* Simulation area */}
      <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold">P</div>
            <div>
              <h3 className="font-bold text-sm">Patient / Family Simulation</h3>
              <p className="text-[10px] text-indigo-200 uppercase tracking-widest">{topic.title}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition"
          >
            End Session
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'student' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                m.role === 'student' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                <p className="text-sm">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 border-t bg-slate-50">
          <div className="flex space-x-2 items-center">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full transition-all shadow-md ${
                isListening 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-white text-slate-400 hover:text-indigo-600 border border-slate-200'
              }`}
              title={isListening ? "Stop listening" : "Start speaking"}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Type or speak your clinical response..."}
              className={`flex-grow border rounded-full px-6 py-3 focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner transition-colors ${
                isListening ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white'
              }`}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !inputText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-3 rounded-full transition shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Attending Feedback Panel */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-inner">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Attending Bot</h4>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Real-time Coaching</p>
            </div>
          </div>
          
          <div className="flex-grow bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 overflow-y-auto">
            {attendingComment ? (
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "{attendingComment}"
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">Listening for the next turn...</p>
            )}
          </div>

          <div className="mt-4 pt-4 border-t text-[10px] text-slate-400 font-medium">
            Pro Tip: Try using "I wish" statements or the "Ask-Tell-Ask" method to align goals.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeRoom;
