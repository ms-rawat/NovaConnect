import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Briefcase, MessageSquare, Bell, Search } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/app/feed" className="navbar-logo">
            N
          </Link>
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="Search" />
          </div>
        </div>
        <div className="navbar-right">
          <Link to="/app/feed" className="nav-link">
            <Home size={24} />
            <span>Home</span>
          </Link>
          <Link to="friends" className="nav-link">
            <Users size={24} />
            <span>My Friends</span>
          </Link>
          <Link to="discover" className="nav-link">
            <Briefcase size={24} />
            <span>Discover</span>
          </Link>
          <Link to="notifications" className="nav-link">
            <Bell size={24} />
            <span>Notifications</span>
          </Link>
          {user && (
            <div className="nav-user-menu">
              <img src={user.avatar || 'https://placehold.co/40x40'} alt="user" />
              <div className="dropdown">
                <span>Me</span>
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  <button onClick={logout}>Logout</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
