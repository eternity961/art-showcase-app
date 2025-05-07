import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Divider } from '@mui/material';
import api from '../utils/api';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/api/chatbot/chat', { message: input });
      const botMessage = { sender: 'bot', text: res.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error responding...' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Ask the Art Assistant</Typography>
      <Paper variant="outlined" sx={{ p: 2, minHeight: 300, mb: 2 }}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ textAlign: msg.sender === 'user' ? 'right' : 'left', my: 1 }}>
            <Typography
              variant="body1"
              sx={{
                display: 'inline-block',
                p: 1.5,
                borderRadius: 2,
                bgcolor: msg.sender === 'user' ? '#1976d2' : '#eee',
                color: msg.sender === 'user' ? '#fff' : '#000'
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Paper>
      <Divider />
      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          fullWidth
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button variant="contained" onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default Chatbot;
