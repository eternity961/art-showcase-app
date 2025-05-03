import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default AdminDashboard;