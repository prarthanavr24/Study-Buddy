import React from 'react';
import Markdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
import { cn } from '../lib/utils';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4 transition-colors",
        isAssistant ? "bg-slate-50/50" : "bg-transparent"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
        isAssistant ? "bg-emerald-500 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200"
      )}>
        {isAssistant ? <Bot size={18} /> : <User size={18} />}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="prose prose-slate max-w-none break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
          <Markdown>{message.content}</Markdown>
        </div>
      </div>
    </div>
  );
};
