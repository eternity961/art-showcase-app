import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import { Button, ListItem, ListItemText } from '@mui/material';

function NotificationItem({ notification, onMarkRead }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();  // Initialize useNavigate

  const handleMarkRead = async () => {
    try {
      // Call the API to mark the notification as read
      await fetch(`/api/notifications/${notification._id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      onMarkRead(notification._id);  // Update the UI optimistically
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleViewPost = () => {
    // Use navigate to redirect to the post page
    navigate(`/post/${notification.relatedId}`);
  };

  return (
    <ListItem>
      <ListItemText primary={notification.content} />
      <Button onClick={handleViewPost}>View Post</Button>

      {!notification.read && (
        <Button onClick={handleMarkRead}>✅</Button>
      )}
    </ListItem>
  );
}

export default NotificationItem;
