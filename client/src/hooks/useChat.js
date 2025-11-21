import { useEffect, useState } from 'react';
import api from '../config/api';
import useAuthStore from '../store/useAuthStore';

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/chats/messages/${chatId}`);
        setMessages(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  const sendMessage = async (text) => {
    try {
      const { data } = await api.post('/chats/messages', { 
        chatId, 
        senderId: user._id,
        text 
      });
      setMessages([...messages, data]);
    } catch (err) {
      setError(err);
    }
  };

  return { messages, sendMessage, error, loading, setMessages };
};
