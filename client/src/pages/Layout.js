// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ mt: 2, px: 2 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
