import React, { useEffect, useState } from 'react';
import {
  Typography, Card, CardContent, Button, Box, Avatar, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Adjust the import based on your project structure
const ReportedPosts = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReportedPosts = async () => {
    try {
      const response = await api.get('/api/posts/reported/all');
      setReportedPosts(response.data);
    } catch (err) {
      console.error('Failed to load reported posts:', err);
    }
  };

  const handleDelete = async (postId) => {
    setLoading(true);
    try {
      await api.delete(`/api/posts/${postId}`);
      setReportedPosts((prev) => prev.filter((p) => p._id !== postId));
      setSelectedPost(null);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedPosts();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reported Posts
      </Typography>

      {reportedPosts.length === 0 ? (
        <Typography>No reported posts found.</Typography>
      ) : (
        reportedPosts.map((post) => (
          <Card key={post._id} sx={{ my: 2, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={post.user?.profile?.avatar ? `${process.env.REACT_APP_API_URL}/${post.user.profile.avatar}` : '/assets/default-avatar.png'}
                sx={{ mr: 2 }}
              />
              <Typography variant="body1">{post.user?.username}</Typography>
            </Box>

            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2">{post.content.slice(0, 100)}...</Typography>

              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => setSelectedPost(post)}
              >
                Delete Post
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!selectedPost} onClose={() => setSelectedPost(null)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPost(null)} disabled={loading}>Cancel</Button>
          <Button
            onClick={() => handleDelete(selectedPost._id)}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportedPosts;
