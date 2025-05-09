import React, { useState, useEffect, useContext } from 'react';
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/posts');
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const inCategory =
        selectedCategory === 'all' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
      return inCategory && matchesSearch;
    });
    setFilteredPosts(filtered);
  }, [posts, selectedCategory, search]);

  const handlePostCreated = (newPost) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    setOpenDialog(false);
  };

  const handlePostUpdate = (updatedPost) => {
    const updated = posts.map((p) => (p._id === updatedPost._id ? updatedPost : p));
    setPosts(updated);
  };

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'judge') return <Navigate to="/judge" replace />;

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        {/* <Box sx={{ textAlign: 'center', mb: 4, px: 2 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}
          >
            🎨 Art Showcase Feed
          </Typography>
        </Box> */}

        <Box sx={{ display: 'flex', gap: 5 }}>
          {/* Sidebar (Desktop Only) */}
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
              InputProps={{ endAdornment: <SearchIcon sx={{ color: 'gray' }} /> }}
            />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
              Categories
            </Typography>
            <List disablePadding>
              {categories.map((option) => (
                <ListItemButton
                  key={option.value}
                  selected={selectedCategory === option.value}
                  onClick={() => setSelectedCategory(option.value)}
                >
                  <ListItemText primary={option.label} />
                </ListItemButton>
              ))}
            </List>

            {user && (
              <Button
                variant="contained"
                fullWidth
                onClick={handleDialogOpen}
                sx={{ mt: 2 }}
              >
                Create Post
              </Button>
            )}
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
                onChange={(e) => setSelectedCategory(e.target.value)}
                fullWidth
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
                InputProps={{ endAdornment: <SearchIcon sx={{ color: 'gray' }} /> }}
                fullWidth
              />
              {user && (
                <Button variant="contained" fullWidth onClick={handleDialogOpen}>
                  Create Post
                </Button>
              )}
            </Box>

            {/* Post List (1 per row) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
              ))}
            </Box>
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
