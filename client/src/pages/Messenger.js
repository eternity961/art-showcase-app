import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import ConversationList from '../components/ConversationList';
import MessageItem from '../components/MessageItem';
import MessageButton from '../components/MessageButton';
import { Container, Box, TextField, Button, Typography, useMediaQuery, useTheme } from '@mui/material';

function Messenger() {
  const { user, socket } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // Detect if on mobile device

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get('/api/messages/conversations');
        setConversations(response.data);

        // Open the first conversation by default if none is selected
        if (!searchParams.get('conv') && response.data.length > 0) {
          setSelectedConv(response.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };
    fetchConversations();
  }, [searchParams]);

  useEffect(() => {
    if (selectedConv) {
      const fetchMessages = async () => {
        try {
          const conv = conversations.find(c => c._id === selectedConv);
          if (conv) setMessages(conv.messages);
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };
      fetchMessages();
    }
  }, [selectedConv, conversations]);

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
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        {/* For Mobile: User List at the Top */}
        {isMobile ? (
          <Box sx={{ mb: 2 }}>
            <MessageButton onNewConversation={(conv) => {
              setSelectedConv(conv._id);
              setMessages(conv.messages || []);
              setConversations(prev => [conv, ...prev.filter(c => c._id !== conv._id)]);
            }} />
            <ConversationList conversations={conversations} onSelect={setSelectedConv} />
          </Box>
        ) : (
          // For Desktop: Fixed Sidebar with White Background
          <Box
            sx={{
              position: 'fixed',
              top:65,
              left: 0,
              width: '250px',
              height: '100vh',
              backgroundColor: '#ffffff',  // White background for sidebar
              padding: '10px',
              boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <ConversationList conversations={conversations} onSelect={setSelectedConv} />

            <Box marginLeft={2} marginTop={2}>
              <MessageButton onNewConversation={(conv) => {
                setSelectedConv(conv._id);
                setMessages(conv.messages || []);
                setConversations(prev => [conv, ...prev.filter(c => c._id !== conv._id)]);
              }} />
            </Box>
          </Box>
        )}

        {/* Main Content Area */}
        <Box
          sx={{
            marginLeft: isMobile ? '0' : '250px',
            width: isMobile ? '100%' : 'calc(100% - 250px)',
            padding: '0 20px',
            mt: isMobile ? 2 : 0,  // Adjust top margin for mobile
            position: 'relative',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Messages
          </Typography>

          {selectedConv ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {messages.map((msg, idx) => (
                  <MessageItem key={idx} message={msg} userId={user.id} />
                ))}
              </Box>

              {/* Input Box Below Messages */}
              <Box component="form" onSubmit={handleSend} sx={{
                p: 2, borderTop: '1px solid #ccc', backgroundColor: 'transparent',
              }}>
                <TextField
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  fullWidth
                  placeholder="Type a message..."
                  sx={{
                    backgroundColor: 'transparent',  // Remove background color
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'transparent', // Ensure input is transparent
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 1,
                    backgroundColor: 'primary', // Remove background color
                    '&:hover': { opacity : "0.9" }, // Remove hover effect
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography>Select a conversation to start chatting.</Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Messenger;