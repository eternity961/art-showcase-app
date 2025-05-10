import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Box, useMediaQuery, IconButton } from '@mui/material';
import { Block, PersonAdd } from '@mui/icons-material';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm')); // Detect if it's a mobile device

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/admin/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleBan = async (id) => {
    try {
      await api.post(`/api/admin/ban/${id}`);
      setUsers(users.map(u => u._id === id ? { ...u, isBanned: true } : u));
    } catch (err) {
      console.error('Error banning user:', err);
    }
  };

  const handleUnban = async (id) => {
    try {
      await api.post(`/api/admin/unban/${id}`);
      setUsers(users.map(u => u._id === id ? { ...u, isBanned: false } : u));
    } catch (err) {
      console.error('Error unbanning user:', err);
    }
  };

  const handleAssignJudge = async (id) => {
    try {
      await api.post(`/api/admin/assign-judge/${id}`);
      setUsers(users.map(u => u._id === id ? { ...u, role: 'judge' } : u));
    } catch (err) {
      console.error('Error assigning judge:', err);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      {/* Wrapper Box to enable horizontal scroll on mobile */}
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isBanned ? 'Banned' : 'Active'}</TableCell>
                <TableCell>
                  {/* Mobile Icons */}
                  {isMobile ? (
                    <>
                      {user.isBanned ? (
                        <IconButton onClick={() => handleUnban(user._id)} color="success">
                          <Block />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => handleBan(user._id)} color="error">
                          <Block />
                        </IconButton>
                      )}
                      {user.role !== 'judge' && user.role !== 'admin' && (
                        <IconButton onClick={() => handleAssignJudge(user._id)} color="primary">
                          <PersonAdd />
                        </IconButton>
                      )}
                    </>
                  ) : (
                    // Desktop Buttons
                    <>
                      {user.isBanned ? (
                        <Button onClick={() => handleUnban(user._id)} color="success">
                          Unban
                        </Button>
                      ) : (
                        <Button onClick={() => handleBan(user._id)} color="error">
                          Ban
                        </Button>
                      )}
                      {user.role !== 'judge' && user.role !== 'admin' && (
                        <Button onClick={() => handleAssignJudge(user._id)} color="primary">
                          Make Judge
                        </Button>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}

export default AdminDashboard;