import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import NotificationItem from '../components/NotificationItem';
import { Container, Typography, List } from '@mui/material';

function Notifications() {
  const { notifications, setNotifications } = useContext(AuthContext);

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.map(notification => (
          <NotificationItem key={notification._id} notification={notification} onMarkRead={handleMarkRead} />
        ))}
      </List>
    </Container>
  );
}

export default Notifications;
