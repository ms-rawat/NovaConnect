import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import useSocket from '../hooks/useSocket';
import useAuthStore from '../store/useAuthStore';

export const ChatWindow = ({ chat }) => {
  const { chatId, recipient } = chat || {};
  const { user: currentUser } = useAuthStore();
  const { messages, sendMessage, setMessages, loading } = useChat(chatId);
  const [newMessage, setNewMessage] = useState('');
  const socket = useSocket();
  const scrollRef = useRef();

  useEffect(() => {
    // When the chat prop changes, we clear the new message input
    setNewMessage('');
  }, [chatId]);

  useEffect(() => {
    if (socket) {
      socket.on('getMessage', (data) => {
        if (data.chatId === chatId) {
          setMessages((prev) => [...prev, data]);
        }
      });
    }
  }, [socket, chatId, setMessages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      senderId: currentUser._id,
      text: newMessage,
      chatId: chatId,
    };

    socket.emit('sendMessage', {
      ...messageData,
      recipientId: recipient._id,
    });

    await sendMessage(newMessage);
    setNewMessage('');
  };

  if (!recipient || !chatId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center">
        <MessageSquare size={80} className="text-gray-300" />
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">Your Messages</h2>
        <p className="text-gray-500">Select a conversation to see messages.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* Chat Header */}
      <div className="flex items-center p-3 border-b border-gray-200">
        <img
          src={recipient?.avatar || 'https://placehold.co/40'}
          alt={recipient?.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <h3 className="font-bold text-lg text-gray-800">{recipient?.name || 'Chat'}</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div
              ref={scrollRef}
              key={msg._id}
              className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender === currentUser._id
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 flex items-center gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 w-full px-4 py-2 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-400"
          disabled={!newMessage.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
