import React from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

function NotificationItem({ notification, onMarkRead }) {
  const handleMarkRead = async () => {
    try {
      await api.patch(`/api/notifications/${notification._id}/read`);
      onMarkRead(notification._id);
    } catch (err) {
      console.error('Error marking notification:', err);
    }
  };

  return (
    <ListItem>
      <ListItemText
        primary={notification.content}
        secondary={
          notification.relatedId && (
            <Link to={notification.type === 'message' ? '/messenger' : `/post/${notification.relatedId}`}>
              View
            </Link>
          )
        }
      />
      {!notification.read && (
        <ListItemSecondaryAction>
          <IconButton onClick={handleMarkRead}>
            <CheckIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

export default NotificationItem;