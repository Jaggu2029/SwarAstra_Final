import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from '../context/LocaleContext';
import { askAiTutor } from '../services/aiTutor';
import { Loader2, RefreshCcw } from 'lucide-react';

const PLACEHOLDERS = [
  "Ask me about ka in Gujarati...",
  "Ask me about multiplication tables...",
  "What is the sign for 'Hello'?",
  "How does photosynthesis work?"
];

const AITutorWidget = () => {
  const { t } = useLocale();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e, retryMsg = null) => {
    if (e) e.preventDefault();
    const userMsg = retryMsg || input.trim();
    if (!userMsg || loading) return;

    if (!retryMsg) {
      setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
      setInput('');
    }
    
    setLoading(true);

    try {
      const response = await askAiTutor(userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response, isError: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oops, something went wrong. Please try again.', isError: true, originalQuestion: userMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-12 mb-8 glass-card p-6 md:p-8 rounded-2xl border border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-shadow duration-500">
      
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex items-center justify-center w-3 h-3">
          <div className="absolute w-full h-full bg-indigo-400 rounded-full opacity-75 animate-ping"></div>
          <div className="relative w-2 h-2 bg-indigo-500 rounded-full"></div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Ask AI Tutor</h2>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-6 py-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white/10 transition-all placeholder:text-gray-400 placeholder:transition-opacity placeholder:duration-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="self-start px-8 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-full font-semibold hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] active:scale-95 transform transition-all duration-200 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Thinking...
              </>
            ) : (
              "Ask"
            )}
          </button>
        </form>
      </div>

      {messages.length > 0 && (
        <div 
          ref={scrollRef}
          className="flex flex-col gap-6 max-h-[500px] overflow-y-auto mt-8 pr-2"
        >
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`animate-in fade-in slide-in-from-bottom-2 duration-300 flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[85%] md:max-w-[75%] bg-white/10 border border-white/10 text-white rounded-2xl rounded-br-sm px-5 py-4 shadow-md">
                  <p className="text-lg whitespace-pre-wrap">{msg.content}</p>
                </div>
              ) : (
                <div className="flex gap-3 max-w-[95%] md:max-w-[85%]">
                  {/* AI Badge */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg border border-indigo-300/30 mt-1">
                    <span className="text-white text-xs font-bold tracking-wider">AI</span>
                  </div>
                  
                  {/* Assistant Bubble */}
                  <div className={`px-5 py-4 rounded-2xl rounded-tl-sm shadow-md ${
                    msg.isError 
                      ? 'bg-red-500/10 border border-red-500/30 text-red-200' 
                      : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-50'
                  }`}>
                    <p className="text-lg whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {msg.isError && (
                      <button 
                        onClick={() => handleSubmit(null, msg.originalQuestion)}
                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-sm font-semibold transition-colors border border-red-500/40"
                      >
                        <RefreshCcw size={16} />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AITutorWidget;
