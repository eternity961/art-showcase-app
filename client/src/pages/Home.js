import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Navigate } from 'react-router-dom';

import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'literal', label: 'Literal' },
  { value: 'visual', label: 'Visual' },
  { value: 'vocal', label: 'Vocal' },
];

function Home() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  // Fetch posts from backend
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/posts');
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter posts based on category and search query
  useEffect(() => {
    const filtered = posts.filter((post) => {
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = post.title?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredPosts(filtered);
  }, [posts, selectedCategory, search]);

  // Handle post creation: refetch posts and close dialog
  const handlePostCreated = useCallback(() => {
    fetchPosts();
    setOpenDialog(false);
  }, [fetchPosts]);

  // Update a post in the state
  const handlePostUpdate = useCallback((updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  }, []);

  // Remove a deleted post from both posts and filteredPosts
  const handleDelete = useCallback((postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
    setFilteredPosts((prev) => prev.filter((post) => post._id !== postId));
  }, []);

  // Handlers for dialog open/close
  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  // Redirect based on role
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (['literal_judge', 'visual_judge', 'vocal_judge'].includes(user?.role))
    return <Navigate to="/judge" replace />;

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', gap: 5 }}>
          {/* Sidebar - hidden on xs, visible md+ */}
          <Paper
            elevation={2}
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              width: 250,
              p: 2,
              backgroundColor: '#fff',
              gap: 2,
              height: 'calc(100vh - 160px)',
              position: 'sticky',
              top: 100,
              borderRadius: 2,
            }}
          >
            <TextField
              fullWidth
              label="Search posts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                readOnly: !user,
              }}
              disabled={!user}
            />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
              Categories
            </Typography>
            <List disablePadding>
              {categories.map((option) => (
                <ListItemButton
                  key={option.value}
                  selected={selectedCategory === option.value}
                  onClick={() => user && setSelectedCategory(option.value)}
                  disabled={!user}
                >
                  <ListItemText primary={option.label} />
                </ListItemButton>
              ))}
            </List>

            <Button
              variant="contained"
              fullWidth
              onClick={handleDialogOpen}
              sx={{ mt: 2 }}
              disabled={!user}
            >
              Create Post
            </Button>
          </Paper>

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            {/* Mobile Filters */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                flexDirection: 'column',
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                select
                label="Category"
                value={selectedCategory}
                onChange={(e) => user && setSelectedCategory(e.target.value)}
                fullWidth
                disabled={!user}
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Search posts"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  endAdornment: <SearchIcon sx={{ color: 'gray' }} />,
                  readOnly: !user,
                }}
                fullWidth
                disabled={!user}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleDialogOpen}
                disabled={!user}
              >
                Create Post
              </Button>
            </Box>

            {/* Post List */}
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 6,
                }}
              >
                <CircularProgress />
              </Box>
            ) : filteredPosts.length === 0 ? (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 6 }}>
                No posts found.
              </Typography>
            ) : (
              <Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    pointerEvents: user ? 'auto' : 'none',      // disables interaction when no user
    cursor: user ? 'default' : 'not-allowed',   // changes cursor style when disabled
    opacity: user ? 1 : 0.6,                     // optionally dim it to show disabled state
  }}
>
  {filteredPosts.map((post) => (
    <PostCard
      key={post._id}
      post={post}
      onUpdate={handlePostUpdate}
      onDelete={handleDelete}
      disableActions={!user || post.userId !== user._id}
    />
  ))}
</Box>

            )}
          </Box>
        </Box>

        {/* Create Post Dialog */}
        <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogContent sx={{ pt: 0 }}>
            <PostForm onPostCreated={handlePostCreated} />
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Home;
