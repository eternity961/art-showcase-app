import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { Container, Typography, Box, TextField, MenuItem } from '@mui/material';
import { Navigate } from 'react-router-dom';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'literal', label: 'Literal' },
  { value: 'visual', label: 'Visual' },
  { value: 'vocal', label: 'Vocal' },
];

function Home() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/api/posts');
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(p => p._id === updatedPost._id ? updatedPost : p));
  };

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'judge') return <Navigate to="/judge" replace />;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Art Showcase Feed
      </Typography>

      

      {user && <PostForm onPostCreated={handlePostCreated} />}
      <TextField
        select
        label="Filter by Category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      >
        {categories.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Box>
        {filteredPosts.map(post => (
          <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
        ))}
      </Box>
    </Container>
  );
}

export default Home;
