import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../utils/api';
import { Card, CardContent, CardMedia, Typography, Button, Box, Avatar } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';

function PostCard({ post, onUpdate, showActions = true }) {
  const { user } = useContext(AuthContext);

  // Handle Like functionality
  const handleLike = async () => {
    try {
      const response = await api.post(`/api/posts/${post._id}/like`);
      onUpdate(response.data);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Safe check for user profile and avatar
  const avatarUrl = post.user && post.user.profile && post.user.profile.avatar
    ? `${process.env.REACT_APP_API_URL}/${post.user.profile.avatar}`
    : '/assets/default-avatar.png';  // Fallback to default avatar

  return (
    <Card sx={{ mb: 2, padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          src={avatarUrl}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body1">
            <Link to={`/profile/${post.user._id}`} style={{ textDecoration: 'none' }}>
              {post.user.username}
            </Link>
          </Typography>
          <Link to={`/profile/${post.user._id}`} style={{ textDecoration: 'none' }}>
            <Typography sx={{ fontSize: 14, color: 'blue' }}>View Profile</Typography>
          </Link>
        </Box>
      </Box>

      {/* Post Title */}
      <Typography variant="h6">{post.title}</Typography>

      {/* Post Content with "See more" functionality */}
      <Typography variant="body1" sx={{ mt: 1 }}>
        {post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}
        {post.content.length > 100 && (
          <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color: 'primary' }}>
            See more
          </Link>
        )}
      </Typography>

      {/* Media */}
      {post.file && (
        <CardMedia
          component={post.file.endsWith('.mp3') || post.file.endsWith('.wav') ? 'audio' : 'img'}
          src={`${process.env.REACT_APP_API_URL}/${post.file}`}
          controls={post.file.endsWith('.mp3') || post.file.endsWith('.wav')}
          sx={{ height: post.file.endsWith('.mp3') || post.file.endsWith('.wav') ? 'auto' : 200, mt: 2 }}
        />
      )}

      {/* Actions (Like, Comment) */}
      {showActions && (
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
      )}
    </Card>
  );
}

export default PostCard;
