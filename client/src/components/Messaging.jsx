import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import api from '../config/api';

const Messaging = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // On component mount, fetch all conversations for the current user
      const fetchConversations = async () => {
      try {
        const { data } = await api.get('chats');
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };
  useEffect(() => {

    fetchConversations();
  }, []);

  // If navigated from a PostCard, a recipient will be in the location state.
  // We need to find or create that chat and set it as selected.
  useEffect(() => {
    const { recipient: recipientFromNav } = location.state || {};
    if (recipientFromNav) {
      const openChat = async () => {
        try {
          const { data } = await api.post('/chats', { recipientId: recipientFromNav._id });
          setSelectedChat({ chatId: data.chatId, recipient: data.recipient });
          // Clear location state to prevent re-triggering
          navigate(location.pathname, { replace: true, state: {} });
        } catch (error) {
          console.error('Failed to open chat from navigation:', error);
        }
      };
      openChat();
    }
  }, [location.state, navigate]);

  return (
    <div className="flex h-[calc(100vh-60px)]">
        <button onClick={fetchConversations}>fetchConversations</button>
      <ConversationList conversations={conversations} onSelectChat={setSelectedChat} selectedChatId={selectedChat?.chatId} />
      <div className="flex-1"><ChatWindow chat={selectedChat} /></div>
    </div>
  );
};

export default Messaging;