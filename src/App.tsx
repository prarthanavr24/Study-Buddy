/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  History, 
  Plus, 
  Settings, 
  GraduationCap, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Bookmark,
  Bot
} from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { StudyInput } from './components/StudyInput';
import { askStudyAssistant } from './services/geminiService';
import { Message, SavedTopic } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [savedTopics, setSavedTopics] = useState<SavedTopic[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await askStudyAssistant(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I couldn't generate an explanation. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please check your connection and try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the current chat?')) {
      setMessages([]);
    }
  };

  const saveTopic = (message: Message) => {
    const newTopic: SavedTopic = {
      id: Date.now().toString(),
      title: message.content.slice(0, 30) + '...',
      content: message.content,
      category: 'General',
      timestamp: Date.now(),
    };
    setSavedTopics((prev) => [newTopic, ...prev]);
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-slate-200 bg-slate-50 flex flex-col h-full"
          >
            <div className="p-4 flex items-center gap-3 border-bottom border-slate-200">
              <div className="bg-emerald-600 p-2 rounded-lg text-white">
                <GraduationCap size={20} />
              </div>
              <h1 className="font-bold text-lg tracking-tight">StudyBuddy AI</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <button 
                onClick={() => setMessages([])}
                className="w-full flex items-center gap-2 bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-100 transition-colors shadow-sm text-sm font-medium"
              >
                <Plus size={16} />
                New Study Session
              </button>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
                  <Bookmark size={12} />
                  Saved Topics
                </div>
                {savedTopics.length === 0 ? (
                  <p className="text-xs text-slate-400 px-2 italic">No saved topics yet.</p>
                ) : (
                  savedTopics.map((topic) => (
                    <button
                      key={topic.id}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-200 transition-colors text-sm truncate"
                      onClick={() => setMessages([{ id: 'saved', role: 'assistant', content: topic.content, timestamp: topic.timestamp }])}
                    >
                      {topic.title}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 space-y-2">
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-200 transition-colors text-sm text-slate-600">
                <Settings size={18} />
                Settings
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            <div className="flex items-center gap-2 ml-2">
              <Sparkles size={18} className="text-emerald-600" />
              <span className="font-semibold text-slate-700">
                {messages.length === 0 ? "Start Learning" : "Current Session"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                title="Clear Chat"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto space-y-8">
              <div className="bg-emerald-50 p-6 rounded-3xl text-emerald-600">
                <BookOpen size={48} />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  What are we learning today?
                </h2>
                <p className="text-slate-500 text-lg">
                  Ask me to explain a concept, summarize a chapter, or create a study guide for you.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {[
                  "Explain photosynthesis simply",
                  "Summarize the French Revolution",
                  "How do black holes work?",
                  "Create a study guide for Calculus"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSendMessage(suggestion)}
                    className="p-4 text-left border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                  >
                    <p className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">
                      {suggestion}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto pb-32">
              {messages.map((message) => (
                <div key={message.id} className="relative group">
                  <ChatMessage message={message} />
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => saveTopic(message)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-all"
                      title="Save Topic"
                    >
                      <Bookmark size={16} />
                    </button>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 p-4 bg-slate-50/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-emerald-500 text-white border-emerald-600">
                    <Bot size={18} />
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
          <StudyInput onSend={handleSendMessage} disabled={isLoading} />
          <p className="text-[10px] text-center text-slate-400 mt-3 uppercase tracking-widest font-semibold">
            Powered by Gemini AI • Academic Assistant
          </p>
        </div>
      </main>
    </div>
  );
}
