import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import './App.css'
import './index.css';
import Login from './pages/Login';
import { Home } from './pages/Home';
import { Navbar } from './components/Navbar';


import ProtectedRoute from './components/ProtectedRoute';

import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import Messaging from './components/Messaging';
import Network from './pages/Network';
import Discover from './pages/Discover';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />, // Your landing page component
  },
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Navigate to="/app/feed" replace />
          },
          {
            path: 'feed',
            element: <Home />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path:'messaging',
            element : <Messaging />
          },
          {
            path: 'friends',
            element: <Network />
          },
          {
            path: 'discover',
            element: <Discover />
          }
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

  return <RouterProvider router={router} />;
}

export default App;