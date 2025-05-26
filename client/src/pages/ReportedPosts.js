import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Container,
  Paper,
  TextField,
  InputAdornment,
  MenuItem,
  useMediaQuery,
  Link,
  IconButton,
  Menu,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import api from '../utils/api'; // Make sure your api utility exports axios or similar configured instance

const categories = ['all', 'literal', 'visual', 'vocal'];

const ReportedPosts = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPostId, setMenuPostId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch reported posts on mount
  useEffect(() => {
    const fetchReportedPosts = async () => {
      try {
        const response = await api.get('/api/posts/reported/all');
        // Defensive: ensure posts have _id
        const postsWithId = response.data.map(post => ({
          ...post,
          _id: post._id || post.id || Math.random().toString(36).slice(2),
        }));
        setReportedPosts(postsWithId);
      } catch (err) {
        console.error('Failed to load reported posts:', err);
      }
    };
    fetchReportedPosts();
  }, []);

  // Filter posts by search and category whenever inputs change
  useEffect(() => {
    const filtered = reportedPosts.filter((post) => {
      const matchesSearch =
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    setFilteredPosts(filtered);
  }, [searchTerm, categoryFilter, reportedPosts]);

  // Delete post handler
  const handleDelete = async (postId) => {
    setLoading(true);
    try {
      await api.delete(`/api/posts/${postId}`);
      setReportedPosts((prev) => prev.filter((p) => p._id !== postId));
      setSelectedPost(null);
      handleMenuClose();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open menu for dropdown on a specific post
  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setMenuPostId(postId);
  };

  // Close dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPostId(null);
  };

  // Toggle post content expand/collapse
  const toggleExpand = (postId) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar - hidden on mobile */}
      {!isMobile && (
        <Paper
          elevation={3}
          sx={{
            width: 250,
            height: '100vh',
            position: 'fixed',
            top: 65,
            left: 0,
            bgcolor: '#fff',
            px: 2,
            py: 3,
            borderRight: '1px solid #ddd',
          }}
        >
          <TextField
            placeholder="Search posts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Category
          </Typography>
          {categories.map((cat) => (
            <Link
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              sx={{
                display: 'block',
                padding: '8px',
                textDecoration: 'none',
                backgroundColor: categoryFilter === cat ? theme.palette.primary.main : 'transparent',
                color: categoryFilter === cat ? '#fff' : 'inherit',
                mb: 1,
                fontFamily: 'sans-serif',
                cursor: 'pointer',
              }}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
        </Paper>
      )}

      {/* Main Content */}
      <Container sx={{ ml: isMobile ? 0 : '270px', py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Reported Posts
        </Typography>

        {/* Mobile filters */}
        {isMobile && (
          <>
            <TextField
              select
              label="Select Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              placeholder="Search posts"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
          </>
        )}

        {filteredPosts.length === 0 ? (
          <Typography>No reported posts found.</Typography>
        ) : (
          filteredPosts.map((post) => {
            const postId = post._id || post.id || Math.random().toString(36).slice(2);
            const isExpanded = expandedPostId === postId;
            const contentPreview = isExpanded
              ? post.content
              : post.content && post.content.length > 150
              ? `${post.content.slice(0, 150)}...`
              : post.content;

            return (
              <Card key={postId} sx={{ my: 2, p: 2, position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={
                        post.user?.profile?.avatar
                          ? `${process.env.REACT_APP_API_URL}/${post.user.profile.avatar}`
                          : '/assets/default-avatar.png'
                      }
                      sx={{ mr: 2 }}
                    />
                    <Typography variant="body1">{post.user?.username || 'Unknown User'}</Typography>
                  </Box>
                  <IconButton onClick={(e) => handleMenuOpen(e, postId)} aria-label="post menu">
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <CardContent>
                  <Typography variant="h6">{post.title || 'Untitled Post'}</Typography>

                  {/* Post Media Preview */}
                  {post.media && (
                    <Box sx={{ my: 2 }}>
                      {/\.(jpg|jpeg|png|gif|webp)$/i.test(post.media) && (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${post.media}`}
                          alt="Post media"
                          style={{ maxWidth: '100%', borderRadius: 8 }}
                        />
                      )}
                      {/\.(mp3|wav|ogg)$/i.test(post.media) && (
                        <audio controls style={{ width: '100%', marginTop: 8 }}>
                          <source src={`${process.env.REACT_APP_API_URL}/${post.media}`} />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                      {/\.(mp4|webm|ogg)$/i.test(post.media) && (
                        <video
                          controls
                          style={{ width: '100%', maxHeight: 300, borderRadius: 8, marginTop: 8 }}
                        >
                          <source src={`${process.env.REACT_APP_API_URL}/${post.media}`} />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </Box>
                  )}

                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {contentPreview}
                    {post.content && post.content.length > 150 && (
                      <Button size="small" onClick={() => toggleExpand(postId)}>
                        {isExpanded ? 'See less' : 'See more'}
                      </Button>
                    )}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                    Category: {post.category || 'N/A'}
                  </Typography>
                </CardContent>

                {/* Dropdown menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={menuPostId === postId}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      setSelectedPost(post);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    Delete Post
                  </MenuItem>
                </Menu>
              </Card>
            );
          })
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!selectedPost} onClose={() => setSelectedPost(null)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPost(null)} disabled={loading}>
            Cancel
          </Button>
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
