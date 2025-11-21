import React, { useState, useEffect } from 'react';
import api from '../config/api';
import useAuthStore from '../store/useAuthStore';
import { Check, UserPlus, X } from 'lucide-react';

export const FriendRequest = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useAuthStore();

  const fetchFriendRequests = async () => {
    try {
      const res = await api.get('/friend-requests',);
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const searchUsers = async () => {
    if (searchTerm.trim() === '') {
      setUsers([]);
      return;
    }
    try {
      const res = await api.get(`/users/search?q=${searchTerm}`);
      // Filter out current user and users who have already sent a request or are friends
      const selfId = currentUser._id;
      const friendIds = currentUser.friends || [];
      const requestSenderIds = requests.map(req => req.sender._id);

      const filteredUsers = res.data.filter(user =>
        user._id !== selfId &&
        !friendIds.includes(user._id) &&
        !requestSenderIds.includes(user._id)
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleAccept = async (requestId) => {
    try {
      await api.put(`/friend-requests/${requestId}/accept`);
      fetchFriendRequests(); // Refresh the list
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.put(`/friend-requests/${requestId}/reject`);
      fetchFriendRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleSendRequest = async (recipientId) => {
    try {
      await api.post('/friend-requests', { recipientId });
      alert('Friend request sent!');
      setSearchTerm('');
      setUsers([]);
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert(error.response?.data?.message || 'Could not send friend request.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <h4 className="font-bold text-gray-800">Friend Requests</h4>
      <div className="space-y-3">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div key={req._id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={req.sender.avatar || 'https://placehold.co/40'} alt={req.sender.name} className="w-10 h-10 rounded-full" />
                <span className="font-semibold text-sm">{req.sender.name}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAccept(req._id)} className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors">
                  <Check size={20} />
                </button>
                <button onClick={() => handleReject(req._id)} className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No new requests</p>
        )}
      </div>

      <hr className="border-gray-200" />

      <h4 className="font-bold text-gray-800">Find Friends</h4>
      <div>
        <input
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {searchTerm && (
          <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                   <div className="flex items-center gap-2">
                    <img src={user.avatar || 'https://placehold.co/40'} alt={user.name} className="w-10 h-10 rounded-full" />
                    <span className="font-semibold text-sm">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => handleSendRequest(user._id)}
                    className="p-2 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Send friend request"
                  >
                    <UserPlus size={20} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 p-2">No users found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
