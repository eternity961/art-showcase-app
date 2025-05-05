import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import ConversationList from '../components/ConversationList';
import MessageItem from '../components/MessageItem';
import MessageButton from '../components/MessageButton';
import { Container, Box, TextField, Button, Grid, Typography } from '@mui/material';

function Messenger() {
  const { user, socket } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get('/api/messages/conversations');
        setConversations(response.data);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const convId = searchParams.get('conv');
    if (convId) {
      setSelectedConv(convId);
      const fetchMessages = async () => {
        try {
          const conv = conversations.find(c => c._id === convId);
          if (conv) setMessages(conv.messages);
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };
      fetchMessages();
    }
  }, [searchParams, conversations]);

  useEffect(() => {
    if (socket && selectedConv) {
      socket.emit('joinConversation', selectedConv);
      socket.on('message', (message) => {
        setMessages((prev) => [...prev, message]);
      });
      return () => socket.off('message');
    }
  }, [socket, selectedConv]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const response = await api.post('/api/messages/send', { conversationId: selectedConv, content });
      setMessages((prev) => [...prev, response.data]);
      setContent('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <MessageButton onNewConversation={(conv) => {
  setSelectedConv(conv._id);
  setMessages(conv.messages || []);
  setConversations(prev => [conv, ...prev.filter(c => c._id !== conv._id)]);
}} />

      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ConversationList conversations={conversations} onSelect={setSelectedConv} />
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedConv ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {messages.map((msg, idx) => (
                  <MessageItem key={idx} message={msg} userId={user.id} />
                ))}
              </Box>
              <Box component="form" onSubmit={handleSend} sx={{ p: 2, borderTop: '1px solid #ccc' }}>
                <TextField
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  fullWidth
                  placeholder="Type a message..."
                  sx={{ mr: 1 }}
                />
                <Button type="submit" variant="contained" sx={{ mt: 1 }}>
                  Send
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography></Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Messenger;