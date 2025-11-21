import React, { useState, useEffect } from 'react';
import api from '../config/api';
import useAuthStore from '../store/useAuthStore';

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users/all');
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSendRequest = async (recipientId) => {
    try {
      await api.post(`/users/${recipientId}/friend-request`, { senderId: currentUser._id });
      alert('Friend request sent!');
      setUsers(users.map(u => u._id === recipientId ? { ...u, requestSent: true } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send friend request.');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Discover People</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map((user) => (
          <div key={user._id} className="border rounded-lg p-4 text-center shadow-md">
            <img src={user.avatar || 'https://placehold.co/100'} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-2" />
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <button
              onClick={() => handleSendRequest(user._id)}
              className={`mt-4 font-bold py-2 px-4 rounded ${user.requestSent ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
              disabled={user.requestSent}
            >
              {user.requestSent ? 'Request Sent' : 'Send Friend Request'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;