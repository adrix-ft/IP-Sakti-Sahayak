import React, { useState } from 'react';
import { Mic, Send } from 'lucide-react';
import { Jurisdiction } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
  jurisdiction: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isGenerating,
  jurisdiction,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="w-full bg-white border-t border-gray-200 py-4 px-4 flex-shrink-0">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <form onSubmit={handleSubmit} className="flex-1 max-w-3xl flex items-center gap-3 w-full">
          {/* Input Bar */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isGenerating}
              placeholder="Ask about Ayurveda IP & regulations..."
              className="w-full bg-white border border-gray-300 rounded-full pl-5 pr-12 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            {/* Mic icon inside on the right */}
            <button
              type="button"
              className="absolute right-3 p-1.5 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="flex-shrink-0 bg-[#1e40af] hover:bg-blue-800 text-white px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
          >
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
