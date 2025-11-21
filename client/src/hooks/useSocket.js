import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useAuthStore from '../store/useAuthStore';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:4000'); // Adjust the URL to your server
      setSocket(newSocket);

      newSocket.emit('addUser', user._id);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  return socket;
};

export default useSocket;
