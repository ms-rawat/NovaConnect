import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { CreatePost } from '../components/CreatPost';
import { PostCard } from '../components/PostCard';
import { FriendRequest } from '../components/FriendRequest';
import { API_BASE_URL } from '../config/StaticVars';
import api from '../config/api';

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const { user: currentUser } = useAuthStore();

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/posts`,);
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}`, {
        data: { userId: currentUser._id },
      });
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (error) {
      alert("You can only delete your own posts.");
    }
  };

  return (
    <div className="home-container">
      {/* Left Sidebar */}
      <div className="left-sidebar">
        <div className="profile-card">
          <img src={currentUser?.avatar || 'https://placehold.co/100x100'} alt="User Avatar" />
          <h3>{currentUser?.name}</h3>
          <p>{currentUser?.email}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <CreatePost currentUser={currentUser} onPostCreated={fetchPosts} />
        <div className="feed">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUser={currentUser}
              onDelete={() => handleDelete(post._id)}
            />
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <FriendRequest />
      </div>
    </div>
  );
};
