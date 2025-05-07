import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Divider, Dialog, DialogContent, DialogTitle, IconButton
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import api from '../utils/api';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/api/chatbot/chat', { message: input });
      const botMessage = { sender: 'bot', text: res.data.reply || 'No response.' }; // updated to use `reply`
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error responding...' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  return (
    <>
      <IconButton
        onClick={handleDialogOpen}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          backgroundColor: '#1976d2',
          color: 'white',
          borderRadius: '50%',
          padding: 2,
          boxShadow: 2,
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        }}
      >
        <ChatIcon />
      </IconButton>

      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ position: 'relative' }}>
          Ask the Art Assistant
          <IconButton
            onClick={handleDialogClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#1976d2',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
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
                    color: msg.sender === 'user' ? '#fff' : '#000',
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
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              sx={{ ml: 2 }}
            >
              Send
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Chatbot;
