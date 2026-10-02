import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Trash2,
  Minimize2,
  ChevronDown,
  User,
  Loader2,
  Code2,
  Zap,
} from 'lucide-react';
import { apiChat } from '../../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch('/data/chatbot/chatbot_config.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.suggestions) setSuggestions(data.suggestions);
        if (data.welcomeMessage) {
          setMessages([
            {
              id: 'welcome-1',
              role: 'assistant',
              content: data.welcomeMessage,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      })
      .catch((err) => console.error('Error loading chatbot_config.json:', err));
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const payloadMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await apiChat.sendMessage(payloadMessages);

      if (res.success && res.reply) {
        const assistantMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(res.message || 'Failed to get response');
      }
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Error**: Could not connect to Sarvam AI. ${err.message || 'Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          "Chat history cleared. How can I help you with your CS & Interview preparation today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Helper to format code snippets & clean text inside messages
  const renderFormattedMessage = (content: string) => {
    // Strip raw markdown headers (##, ###), dividers (---), and table grid symbols
    const cleanedContent = content
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^[-\*]{3,}$/gm, '')
      .replace(/\|[\s:-]+\|/g, '');

    const parts = cleanedContent.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9]+$/.test(firstLine);
        const language = hasLang ? firstLine : 'code';
        const code = hasLang ? lines.slice(1).join('\n') : lines.join('\n');

        return (
          <div key={index} className="my-2.5 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden text-xs shadow-lg">
            <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-slate-200 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Code2 size={13} className="text-cyan-600" />
                {language.toUpperCase()}
              </span>
            </div>
            <pre className="p-3 text-slate-600 font-mono overflow-x-auto whitespace-pre font-normal text-[11.5px] leading-relaxed">
              {code}
            </pre>
          </div>
        );
      }

      // Inline formatting: Bold **text**
      const inlineParts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={index} className="whitespace-pre-wrap leading-relaxed">
          {inlineParts.map((sub, sIdx) => {
            if (sub.startsWith('**') && sub.endsWith('**')) {
              return (
                <strong key={sIdx} className="font-semibold text-cyan-700">
                  {sub.slice(2, -2)}
                </strong>
              );
            }
            return sub;
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[9999] group flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-cyan-500/25 border border-cyan-400/30 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-subtle"
          title="Open Sarvam AI Assistant"
        >
          <div className="relative">
            <Bot size={20} className="text-white drop-shadow" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300"></span>
            </span>
          </div>
          <span className="font-bold text-xs tracking-wide text-white hidden sm:inline-block">AlgoVault AI</span>
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-black/30 backdrop-blur-md rounded-full text-cyan-200 border border-white/10 uppercase tracking-wider">
            Sarvam 105B
          </span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-[9999] w-[calc(100vw-24px)] sm:w-[420px] bg-white border border-slate-200 rounded-3xl shadow-2xl backdrop-blur-2xl transition-all duration-300 flex flex-col overflow-hidden ${
            isMinimized ? 'h-16' : 'h-[500px] sm:h-[580px] max-h-[78vh]'
          }`}
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative p-2 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl shadow-md border border-cyan-400/30">
                <Sparkles size={16} className="text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white tracking-tight">AlgoVault AI</h3>
                  <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Sarvam 105B
                  </span>
                </div>
                <p className="text-[10px] text-slate-300">CS & Interview Preparation Assistant</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={clearChat}
                title="Clear Conversation"
                className="p-1.5 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMinimized ? <ChevronDown size={16} /> : <Minimize2 size={15} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 text-xs bg-slate-50/50">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-md border ${
                          isUser
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-gradient-to-br from-indigo-900 to-slate-900 text-cyan-300 border-indigo-700'
                        }`}
                      >
                        {isUser ? <User size={14} /> : <Bot size={15} />}
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[82%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl shadow-sm leading-relaxed ${
                            isUser
                              ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                          }`}
                        >
                          {renderFormattedMessage(msg.content)}
                        </div>
                        <span className="text-[9px] text-slate-400 block px-1">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Loading Indicator */}
                {loading && (
                  <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                    <div className="h-7 w-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-cyan-600 shrink-0">
                      <Loader2 size={14} className="animate-spin" />
                    </div>
                    <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
                      <span className="text-slate-500 text-[11px]">Sarvam AI is thinking</span>
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-1.5 w-1.5 bg-cyan-500 rounded-full animate-bounce"></span>
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips - Clean Flex Wrap (No Horizontal Scroll) */}
              {messages.length <= 3 && !loading && (
                <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-1.5">
                  {suggestions.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(chip.replace(/^[^\s]+\s*/, ''))}
                      className="px-2.5 py-1 text-[10.5px] bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-xl transition-all shrink-0 flex items-center gap-1 shadow-sm"
                    >
                      <Zap size={10} className="text-amber-500" />
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 rounded-2xl px-3 py-1.5 transition-all">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Sarvam AI about DSA, OS, DBMS..."
                    className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-1"
                    disabled={loading}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="p-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm"
                    title="Send Message"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[9.5px] text-slate-400 px-1">
                  <span>Powered by Sarvam 105B</span>
                  <span>Press Enter to send</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
