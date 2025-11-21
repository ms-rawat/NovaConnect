import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import api from '../config/api';
import useAuthStore from '../store/useAuthStore';

const Network = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchFriends = async () => {
      try {
        const { data } = await api.get(`/users/${currentUser._id}/friends`);
        setFriends(data);
      } catch (err) {
        setError('Failed to fetch friends.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [currentUser]);

  const handleChat = (friend) => {
    navigate('/app/messaging', { state: { recipient: friend } });
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Friends</h1>
      {friends.length === 0 ? (
        <p>You have no friends yet. Go to the Discover page to add some!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {friends.map((friend) => (
            <div key={friend._id} className="border rounded-lg p-4 text-center shadow-md relative">
              <img src={friend.avatar || 'https://placehold.co/100'} alt={friend.name} className="w-24 h-24 rounded-full mx-auto mb-2" />
              <h2 className="text-lg font-semibold">{friend.name}</h2>
              <p className="text-gray-600 mb-4">{friend.email}</p>
              <button
                onClick={() => handleChat(friend)}
                className="absolute top-2 right-2 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                aria-label={`Chat with ${friend.name}`}
              >
                <MessageSquare size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Network;
