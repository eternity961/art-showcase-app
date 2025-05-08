import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link,
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      console.error('Error logging in:', err);
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
        overflow: 'hidden', // Prevent vertical scroll bar
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
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
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
                borderRadius: 2, // Rounded corners for input field
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
                borderRadius: 2, // Rounded corners for input field
              },
            }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
            Login
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Link href="/register" variant="body2" sx={{ display: 'block', mb: 1 }}>
            Don’t have an account? Register
          </Link>
          <Link href="/forgot-password" variant="body2">
            Forgot password?
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;