import React, { useContext,useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../utils/api';
import {
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';

function PostCard({ post, onUpdate, showActions = true, evaluation = null }) {
  const { user } = useContext(AuthContext);
  const [showFullContent, setShowFullContent] = useState(false);
  const toggleContent = () => setShowFullContent((prev) => !prev);

  // Handle Like functionality
  const handleLike = async () => {
    try {
      const response = await api.post(`/api/posts/${post._id}/like`);
      onUpdate?.(response.data);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const avatarUrl =
    post.user?.profile?.avatar
      ? `${process.env.REACT_APP_API_URL}/${post.user.profile.avatar}`
      : '/assets/default-avatar.png';

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left content (Post info) */}
        <Box sx={{ flex: 1, pr: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={avatarUrl} sx={{ width: 40, height: 40, mr: 2 }} />
            <Box>
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

          <Typography variant="h6">{post.title}</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
  {showFullContent ? post.content : post.content.slice(0, 100) + (post.content.length > 100 ? '...' : '')}
  {post.content.length > 100 && (
    <Button onClick={toggleContent} size="small" sx={{ ml: 1, textTransform: 'none' }}>
      {showFullContent ? 'See less' : 'See more'}
    </Button>
  )}
</Typography>


          {post.file && (
          
  <>
    {/\.(jpg|jpeg|png|gif)$/i.test(post.file) && (
      <CardMedia
        component="img"
        image={`${process.env.REACT_APP_API_URL}/${post.file}`}
        alt="Post media"
        sx={{ height: 200, mt: 2 }}
      />
    )}

    {/\.(mp3|wav)$/i.test(post.file) && (
      <Box sx={{ mt: 2 }}>
        <audio controls style={{ width: '100%' }}>
          <source src={`${process.env.REACT_APP_API_URL}/${post.file}`} type={`audio/${post.file.split('.').pop()}`} />
          Your browser does not support the audio element.
        </audio>
      </Box>
    )}

    {/\.(mp4|webm|ogg)$/i.test(post.file) && (
      <Box sx={{ mt: 2 }}>
        <video controls style={{ width: '100%' }}>
          <source src={`${process.env.REACT_APP_API_URL}/${post.file}`} type={`video/${post.file.split('.').pop()}`} />
          Your browser does not support the video tag.
        </video>
      </Box>
    )}
  </>
)}

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
        </Box>

        {/* Right side - Evaluation display */}
        {evaluation && (
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        )}

        {evaluation && (
          <Box sx={{ width: 200, textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'green' }}>
              Score: {evaluation.score}/10
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}

export default PostCard;
