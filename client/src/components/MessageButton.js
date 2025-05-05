import React, { useEffect, useState, useContext } from 'react';
import {
  Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar,
  ListItemText, Button, TextField, DialogContent, DialogActions
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function MessageButton({ onNewConversation }) {
  const [openUserList, setOpenUserList] = useState(false);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleOpen = () => setOpenUserList(true);
  const handleCloseUserList = () => setOpenUserList(false);
  const handleCloseMessageDialog = () => {
    setOpenMessageDialog(false);
    setMessage('');
    setSelectedUser(null);
  };

  useEffect(() => {
    if (openUserList) {
      api.get('/api/users')
        .then(res => {
          const filtered = res.data.filter(u => u._id !== user.id);
          setUsers(filtered);
        })
        .catch(err => console.error('Error fetching users:', err));
    }
  }, [openUserList, user.id]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setOpenUserList(false);
    setOpenMessageDialog(true);
  };

  const handleStartConversationAndSend = async () => {
    if (!message.trim() || !selectedUser) return;
    try {
      const convRes = await api.post('/api/messages/conversation', {
        recipientId: selectedUser._id
      });
      const conv = convRes.data;

      // Send the initial message
      await api.post('/api/messages/send', {
        conversationId: conv._id,
        content: message
      });

      if (onNewConversation) onNewConversation(conv);

      handleCloseMessageDialog();
      navigate(`/messenger?conv=${conv._id}`);
    } catch (err) {
      console.error('Error starting conversation or sending message:', err);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<MessageIcon />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        New Message
      </Button>

      {/* User list dialog */}
      <Dialog open={openUserList} onClose={handleCloseUserList}>
        <DialogTitle>Select a user to message</DialogTitle>
        <List>
          {users.map((u) => (
            <ListItem
              button
              key={u._id}
              onClick={() => handleUserSelect(u)}
            >
              <ListItemAvatar>
                <Avatar src={u.profile?.avatar} />
              </ListItemAvatar>
              <ListItemText primary={u.username} />
            </ListItem>
          ))}
        </List>
      </Dialog>

      {/* Message input dialog */}
      <Dialog open={openMessageDialog} onClose={handleCloseMessageDialog}>
        <DialogTitle>Send message to {selectedUser?.username}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessageDialog}>Cancel</Button>
          <Button onClick={handleStartConversationAndSend} variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MessageButton;
