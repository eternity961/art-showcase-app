import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  Paper,
} from '@mui/material';
import api from '../utils/api';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(
        '/api/auth/verify-otp',
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(res.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
      setSuccess('');
    }
  };

  const handleResend = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(
        '/api/auth/resend-otp',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
      setSuccess('');
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
      }}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: '100%' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Verify OTP
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleVerify}>
          <TextField
            label="Enter OTP"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mb: 2 }}>
            Verify OTP
          </Button>
        </Box>

        <Typography variant="body2" align="center">
          Didn’t receive the code?{' '}
          <Link component="button" onClick={handleResend} underline="none">
            Resend OTP
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default VerifyOtp;
