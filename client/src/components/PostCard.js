import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../utils/api';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';

function PostCard({ post, onUpdate }) {
  const { user } = useContext(AuthContext);

  const handleLike = async () => {
    try {
      const response = await api.post(`/api/posts/${post._id}/like`);
      onUpdate(response.data);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      {post.file && (
        <CardMedia
          component={post.file.endsWith('.mp3') || post.file.endsWith('.wav') ? 'audio' : 'img'}
          src={`${process.env.REACT_APP_API_URL}/${post.file}`}
          controls={post.file.endsWith('.mp3') || post.file.endsWith('.wav')}
          sx={{ height: post.file.endsWith('.mp3') || post.file.endsWith('.wav') ? 'auto' : 200 }}
        />
      )}
      <CardContent>
        <Typography variant="h6">{post.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          By <Link to={`/profile/${post.user._id}`}>{post.user.username}</Link> | {post.category}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>{post.content}</Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            startIcon={<ThumbUpIcon />}
            onClick={handleLike}
            disabled={!user}
            color={post.likes.includes(user?.id) ? 'primary' : 'inherit'}
          >
            {post.likes.length} Likes
          </Button>
          <Button
            startIcon={<CommentIcon />}
            component={Link}
            to={`/post/${post._id}`}
            disabled={!user}
          >
            Comments
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default PostCard;