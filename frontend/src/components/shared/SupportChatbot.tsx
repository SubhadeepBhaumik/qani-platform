import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useApp } from '../AppContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const SupportChatbot: React.FC = () => {
  const { navigate, login } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "### Welcome to QANI Support!\nHow can I assist you today? Feel free to ask about our **AI scorecards**, **server-side credential protection**, or **role-switching sandbox**.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "How does candidate evaluation work?",
    "Is my OpenAI API key secure on QANI?",
    "How do I switch roles for testing?",
    "How to post a job screening?"
  ];

  // Auto scroll to bottom when messages list updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/v1/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, chatHistory })
      });

      if (!res.ok) throw new Error('API request failed');

      const data = await res.json();

      const assistantMsg: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: data.reply || "I didn't receive a clear response from the server, but I am still here to help!",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      // Offline/Local Simulated replies
      const assistantMsg: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: "### Operational Update\nI am currently operating in standalone backup mode. Please verify your connection or inspect the server logs! Let me know if you would like me to summarize **QANI Features**.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      <button
        id="support-chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none group relative"
        title="Open Support Chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6 transform rotate-90 transition-all duration-300" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 transform group-hover:-rotate-6 transition-all duration-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>

      {/* Main Drawer Container */}
      {isOpen && (
        <div 
          id="support-chatbot-drawer"
          className="absolute bottom-18 right-0 w-80 sm:w-96 h-[32rem] bg-white rounded-2xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 z-50"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-500 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold tracking-tight">QANI Support Terminal</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                  <span className="text-[9px] text-blue-100 font-medium tracking-wide uppercase">AI Assistant Node Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Secure Environment Banner */}
          <div className="bg-blue-50 border-b border-blue-100/50 p-2 text-[10px] text-blue-800 flex items-center justify-center gap-1 px-4 text-center font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Fully Secure: Prompts are verified on our server-side container proxy. No keys are ever exposed.</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}
              >
                {/* Avatar Icon placeholder */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                  {m.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4 text-indigo-600" />
                  )}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm border ${
                      m.role === 'user'
                        ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none text-left'
                        : 'bg-white text-gray-800 border-gray-200/80 rounded-tl-none font-medium'
                    }`}
                  >
                    {m.role === 'assistant' ? (
                      // Support simple customized Markdown display natively
                      <div className="space-y-2 markdown-chat-custom">
                        {m.content.split('\n').map((line, idx) => {
                          if (line.startsWith('###')) {
                            return <h5 key={idx} className="font-extrabold text-gray-900 mt-2 text-[12px]">{line.replace('###', '').trim()}</h5>;
                          }
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={idx} className="font-bold text-gray-900">{line.replace(/\*\*/g, '').trim()}</p>;
                          }
                          
                          // Handle bold inline tags manually (**text**)
                          let processedText = line;
                          const boldMatches = line.match(/\*\*(.*?)\*\*/g);
                          if (boldMatches) {
                            boldMatches.forEach(match => {
                              const clean = match.replace(/\*\*/g, '');
                              processedText = processedText.replace(match, `__STRONG__${clean}__STRONG__`);
                            });
                          }

                          const parts = processedText.split('__STRONG__');
                          return (
                            <p key={idx} className="text-gray-700 leading-normal">
                              {parts.map((part, pIdx) => (
                                pIdx % 2 === 1 ? <strong key={pIdx} className="text-gray-900 font-bold">{part}</strong> : part
                              ))}
                            </p>
                          );
                        })}
                      </div>
                    ) : (
                      <span>{m.content}</span>
                    )}
                  </div>
                  <span className="text-[9px] text-gray-400 font-mono block px-1">
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Simulated typing loading bubble */}
            {isLoading && (
              <div className="flex gap-2.5 max-w-[80%] mr-auto">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Support Suggestions */}
          {messages.length === 1 && !isLoading && (
            <div className="bg-gray-100/50 p-3 border-t border-gray-100 flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block px-1">Suggested inquiries:</span>
              <div className="flex flex-wrap gap-1">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestionClick(q)}
                    className="text-[10px] text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100/60 rounded-full py-1 px-2.5 text-left transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input tray */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your support ticket question..."
              className="flex-1 h-10 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl px-3.5 text-xs transition outline-none"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 text-white disabled:text-gray-400 rounded-xl flex items-center justify-center transition shrink-0 shadow-md shadow-blue-500/10 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
