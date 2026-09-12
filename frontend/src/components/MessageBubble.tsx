import React from 'react';
import { ChatMessage } from '../types';
import { CitationCard } from './CitationCard';
import { FailureState } from './FailureState';

interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: () => void;
  onOpenExpertModal?: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onRetry, onOpenExpertModal }) => {
  const isUser = message.sender === 'user';

  if (message.isError || message.sender === 'system') {
    return (
      <FailureState 
        errorMessage={message.text} 
        onRetry={onRetry || (() => {})} 
        onOpenExpertModal={onOpenExpertModal || (() => {})} 
      />
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end mb-6 pl-12">
        <div className="bg-[#1e40af] text-white px-5 py-3.5 rounded-2xl rounded-br-none shadow-sm max-w-2xl text-[15px] leading-relaxed">
          {message.text}
        </div>
      </div>
    );
  }

  // Assistant Bubble
  return (
    <div className="flex justify-start mb-6 pr-12">
      <div className="flex items-start gap-4 max-w-3xl w-full">
        {/* Circular AI Avatar */}
        <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-700">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-1H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM9.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
          </svg>
        </div>

        <div className="flex flex-col flex-1 min-w-0 gap-3">
          <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm text-gray-800 text-[15px] leading-relaxed border border-gray-100 w-fit">
            {message.text}
          </div>

          {message.citations && message.citations.length > 0 && (
            <div className="flex flex-col gap-3">
              {message.citations.map((citation, idx) => (
                <CitationCard key={`${citation.source}-${idx}`} citation={citation} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
