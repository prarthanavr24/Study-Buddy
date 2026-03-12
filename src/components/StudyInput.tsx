import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface StudyInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const StudyInput: React.FC<StudyInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-end w-full max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all p-2"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything... (e.g., 'Explain Quantum Physics like I'm 5')"
        className="flex-1 max-h-60 resize-none bg-transparent border-0 focus:ring-0 py-3 px-4 text-slate-700 placeholder:text-slate-400"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
          input.trim() && !disabled 
            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm" 
            : "bg-slate-100 text-slate-400 cursor-not-allowed"
        )}
      >
        <Send size={18} />
      </button>
    </form>
  );
};
