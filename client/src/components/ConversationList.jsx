import React from 'react';
import useAuthStore from '../store/useAuthStore';

export const ConversationList = ({ conversations, onSelectChat, selectedChatId }) => {
  const { user: currentUser } = useAuthStore();

  if (!conversations.length) {
    return (
      <div className="w-1/3 border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <p className="text-gray-500">No conversations yet.</p>
      </div>
    );
  }

  return (
    <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {conversations.map((chat) => {
          const otherUser = chat.members.find(member => member._id !== currentUser._id);
          if (!otherUser) return null;

          return (
            <li key={chat._id} onClick={() => onSelectChat({ chatId: chat._id, recipient: otherUser })} className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedChatId === chat._id ? 'bg-blue-50' : ''}`}>
              <div className="flex items-center gap-3">
                <img src={otherUser.avatar || 'https://placehold.co/40'} alt={otherUser.name} className="w-10 h-10 rounded-full" />
                <span className="font-semibold">{otherUser.name}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};