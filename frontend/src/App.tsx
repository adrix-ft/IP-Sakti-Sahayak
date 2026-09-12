import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { ChatMessage, Jurisdiction } from './types';
import { sendMessageToAPI } from './api/legalApi';

const INITIAL_CONVERSATION: ChatMessage[] = [
  {
    id: 'msg-welcome-0',
    sender: 'assistant',
    text: "Welcome to 'IP-SAKTI Sahayak', your assistant in Ayush IP & regulatory matters!",
    citations: [
      {
        source: 'The Patents Act, 1970 - Section 3(p)',
        text: 'Statutory bar prohibiting the grant of patents for any invention which in effect is traditional knowledge.',
      },
    ],
    timestamp: '10:00 AM',
    jurisdiction: 'India',
  }
];

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CONVERSATION);
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('India');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [lastUserQuery, setLastUserQuery] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isGenerating) return;

    setLastUserQuery(userText);
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: currentTime,
      jurisdiction: jurisdiction,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const response = await sendMessageToAPI(userText, jurisdiction);

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        jurisdiction,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chat API Error:", err.message, "Payload:", { message: userText, jurisdiction });
      
      const errorMessage: ChatMessage = {
        id: `sys-err-${Date.now()}`,
        sender: 'system',
        text: err.message || 'An unknown error occurred',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetry = () => {
    if (lastUserQuery) {
      // Remove the last system error message from the UI
      setMessages(prev => prev.filter(msg => !msg.isError));
      handleSendMessage(lastUserQuery);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f4f6f8] text-slate-800 font-sans overflow-hidden">
      <Header
        jurisdiction={jurisdiction}
        onJurisdictionChange={setJurisdiction}
      />

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-4xl mx-auto flex flex-col min-h-full">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onRetry={msg.isError ? handleRetry : undefined}
            />
          ))}
          
          {isGenerating && (
             <div className="flex justify-start mb-6 pr-12">
               <div className="flex items-start gap-4">
                 <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm mt-1 animate-pulse">
                   <div className="w-4 h-4 bg-gray-300 rounded-full" />
                 </div>
                 <div className="bg-white rounded-2xl rounded-tl-none px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-2">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput
        onSendMessage={handleSendMessage}
        isGenerating={isGenerating}
        jurisdiction={jurisdiction}
      />
    </div>
  );
}
