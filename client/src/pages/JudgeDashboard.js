import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
} from '@mui/material';

function JudgeDashboard() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState('literal');
  const [evaluations, setEvaluations] = useState({}); // holds form state per post

  // Fetch top 10 liked posts when category changes
  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const response = await api.get(`/api/judge/top-posts?category=${category}`);
        setPosts(response.data);
        setEvaluations({}); // reset evaluations state on category change
      } catch (err) {
        console.error('Error fetching top posts:', err);
      }
    };
    fetchTopPosts();
  }, [category]);

  const handleFieldChange = (postId, field, value) => {
    setEvaluations(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [field]: value,
      },
    }));
  };

  const toggleEvaluationForm = (postId) => {
    setEvaluations(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        isOpen: !prev[postId]?.isOpen,
        score: prev[postId]?.score || '',
        feedback: prev[postId]?.feedback || '',
      },
    }));
  };

  const handleSubmit = async (e, postId) => {
    e.preventDefault();
    const { score, feedback } = evaluations[postId] || {};
    try {
      await api.post('/api/judge/evaluate', {
        postId,
        score: Number(score),
        feedback,
      });
      setEvaluations(prev => ({
        ...prev,
        [postId]: {
          isOpen: false,
          score: '',
          feedback: '',
        },
      }));
    } catch (err) {
      console.error('Error submitting evaluation:', err);
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

      {posts.map(post => {
        const isOpen = evaluations[post._id]?.isOpen || false;
        const score = evaluations[post._id]?.score || '';
        const feedback = evaluations[post._id]?.feedback || '';

        return (
          <Box key={post._id} sx={{ mb: 4 }}>
            <PostCard post={post} showActions={false} />
            <Button
              variant="contained"
              onClick={() => toggleEvaluationForm(post._id)}
              sx={{ mt: 1 }}
            >
              {isOpen ? 'Cancel Evaluation' : 'Evaluate'}
            </Button>

            {isOpen && (
              <Box
                component="form"
                onSubmit={(e) => handleSubmit(e, post._id)}
                sx={{ mt: 2 }}
              >
                <TextField
                  label="Score (1-10)"
                  type="number"
                  value={score}
                  onChange={(e) =>
                    handleFieldChange(post._id, 'score', e.target.value)
                  }
                  fullWidth
                  required
                  inputProps={{ min: 1, max: 10 }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Feedback"
                  value={feedback}
                  onChange={(e) =>
                    handleFieldChange(post._id, 'feedback', e.target.value)
                  }
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
          </Box>
        );
      })}
    </Container>
  );
}

export default JudgeDashboard;
