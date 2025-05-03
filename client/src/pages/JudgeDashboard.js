import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import { Container, Typography, TextField, Button, MenuItem, Box } from '@mui/material';

function JudgeDashboard() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('literal');
  const [selectedPost, setSelectedPost] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const response = await api.get(`/api/judge/top-posts?category=${category}`);
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching top posts:', err);
      }
    };
    fetchTopPosts();
  }, [category]);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/judge/evaluate', {
        postId: selectedPost,
        score: Number(score),
        feedback,
      });
      setSelectedPost(null);
      setScore('');
      setFeedback('');
    } catch (err) {
      console.error('Error evaluating post:', err);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Judge Dashboard
      </Typography>
      <TextField
        select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        sx={{ mb: 4 }}
      >
        <MenuItem value="literal">Literal Art</MenuItem>
        <MenuItem value="visual">Visual Art</MenuItem>
        <MenuItem value="vocal">Vocal Art</MenuItem>
      </TextField>
      <Box>
        {posts.map(post => (
          <Box key={post._id} sx={{ mb: 2 }}>
            <PostCard post={post} onUpdate={() => {}} showActions={false}/>
            <Button
              variant="contained"
              onClick={() => setSelectedPost(post._id)}
              sx={{ mt: 1 }}
            >
              Evaluate
            </Button>
          </Box>
        ))}
      </Box>
      {selectedPost && (
        <Box component="form" onSubmit={handleEvaluate} sx={{ mt: 4 }}>
          <TextField
            label="Score (1-10)"
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            fullWidth
            required
            inputProps={{ min: 1, max: 10 }}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained">
            Submit Evaluation
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default JudgeDashboard;