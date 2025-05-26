import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../utils/api';
import { Card, CardContent, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function CommentCard({ comment, onDelete }) {
  const { user } = useContext(AuthContext);

  const handleDelete = async () => {
    try {
      await api.delete(`/api/comments/${comment._id}`);
      onDelete(comment._id); // Notify parent to remove from UI
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Typography variant="body2">
          <Link to={`/profile/${comment.user._id}`}>
            {comment.user.username}
          </Link>: {comment.content}
        </Typography>
        {(user?.id === comment.user._id || user?.role === 'admin') && (
          <Button startIcon={<DeleteIcon />} color="error" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default CommentCard;