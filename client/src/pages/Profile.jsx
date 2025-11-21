import React from 'react';
import useAuthStore from '../store/useAuthStore';

const Profile = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="mb-2">
          <strong>Name:</strong> {user?.displayName}
        </p>
        <p className="mb-4">
          <strong>Email:</strong> {user?.email}
        </p>
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
