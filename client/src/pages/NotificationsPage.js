import React, { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Tooltip,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
              secondaryAction={
                !n.read && (
                  <Tooltip title="Mark as read">
                    <IconButton edge="end" onClick={() => markAsRead(n._id)} size="small">
                      <CheckCircleIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                )
              }
              sx={{
                bgcolor: n.read ? 'background.paper' : 'rgba(25, 118, 210, 0.1)',
                borderRadius: 2,
                mb: 1,
                transition: 'background 0.3s',
                '&:hover': {
                  bgcolor: n.read ? 'grey.100' : 'rgba(25, 118, 210, 0.2)',
                },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: n.read ? 'grey.400' : 'primary.main' }}>
                  <NotificationsNoneIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={n.content}
                secondary={new Date(n.createdAt).toLocaleString()}
                primaryTypographyProps={{
                  fontWeight: n.read ? 'normal' : 'bold',
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NotificationsPage;
