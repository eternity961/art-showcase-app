// src/components/Layout.jsx
import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';
import Chatbot from '../components/Chatbot';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext

const Layout = () => {
  const { user } = useContext(AuthContext); // Get the current user from context

  return (
    <>
      <Navbar />
      <Box sx={{ mt: 2, px: 2 }}>
        <Outlet />
        {user?.role === 'user' && <Chatbot />} {/* Only show chatbot for 'user' role */}
      </Box>
    </>
  );
};

export default Layout;
