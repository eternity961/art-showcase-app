import React, { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';

const NotificationsPage = () => {
  const { notifications, markAsRead } = useContext(NotificationContext);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      {notifications.length === 0 ? (
        <Typography>No notifications</Typography>
      ) : (
        <List>
          {notifications.map((n) => (
            <ListItem
              key={n._id}
              button
              onClick={() => markAsRead(n._id)}
              sx={{ bgcolor: n.read ? 'inherit' : 'rgba(25, 118, 210, 0.1)' }}
            >
              <ListItemText
                primary={n.content}
                secondary={new Date(n.createdAt).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationsPage;
