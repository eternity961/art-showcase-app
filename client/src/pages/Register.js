import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Container, TextField, Button, Typography, Box, Link, Paper } from '@mui/material';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', { username, email, password });
      navigate('/login');
    } catch (err) {
      console.error('Error registering:', err);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{
              mb: 3,
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
            }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
            Register
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Link href="/login" variant="body2" sx={{ display: 'block' }}>
            Already have an account? Login
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
