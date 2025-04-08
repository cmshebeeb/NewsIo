import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ChatBotProps {
  articleId: string;
  onClose: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ articleId, onClose }) => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hi! I can help you understand this article better. What would you like to know?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: input, isUser: true }]);

    // Mock response - replace with actual AI/API call
    const mockResponse = `Thanks for asking about article ${articleId}. This is a mock response.`;
    setTimeout(() => {
      setMessages(prev => [...prev, { text: mockResponse, isUser: false }]);
    }, 1000);

    setInput('');
  };

  return (
    <div
      className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200"
      aria-label="Chatbot window for article interactions"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold" aria-label="Chatbot title">
          Chat about this article
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close chatbot"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
              aria-label={msg.isUser ? 'User message' : 'Bot message'}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 border-t" aria-label="Message input form">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Chatbot input"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};