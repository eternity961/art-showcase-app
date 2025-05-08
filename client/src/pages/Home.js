import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
    <Box sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" fontWeight="bold">
            🎨 Art Showcase Feed
          </Typography>
        </Box>

        {/* Category + Search Filters */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
          <TextField
            select
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ minWidth: 200 }}
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
            sx={{ flexGrow: 1, minWidth: 200 }}
          />
           {user && (
          <Fab
            color="primary"
            onClick={handleDialogOpen}
            sx={{
              boxShadow: 3,
            }}
          >
            <AddIcon />
          </Fab>
        )}
        </Box>

        {/* Posts Grid */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
          }}
        >
          {filteredPosts.map((post) => (
            <Box key={post._id} sx={{ flex: '1 1 calc(50% - 24px)', minWidth: 300 }}>
              <PostCard post={post} onUpdate={handlePostUpdate} />
            </Box>
          ))}
        </Box>

        {/* Floating Create Post Button */}
       

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
