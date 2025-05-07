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
  const [evaluations, setEvaluations] = useState({});
  const [evaluatedPosts, setEvaluatedPosts] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, evalRes] = await Promise.all([
          api.get(`/api/judge/top-posts?category=${category}`),
          api.get('/api/judge/evaluations'),
        ]);

        const topPosts = postRes.data;
        setPosts(topPosts);
        setEvaluations({});

        // Create a Set of post IDs that have already been evaluated by this judge
        const evaluatedSet = new Set(
          evalRes.data
            .filter(ev => topPosts.some(p => p._id === ev.post._id))
            .map(ev => ev.post._id)
        );

        setEvaluatedPosts(evaluatedSet);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
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
    if (evaluatedPosts.has(postId)) return;

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
          ...prev[postId],
          isOpen: false,
        },
      }));

      setEvaluatedPosts(prev => new Set(prev).add(postId));
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
        const postId = post._id;
        const isOpen = evaluations[postId]?.isOpen || false;
        const score = evaluations[postId]?.score || '';
        const feedback = evaluations[postId]?.feedback || '';
        const isEvaluated = evaluatedPosts.has(postId);

        return (
          <Box key={postId} sx={{ mb: 4 }}>
            <PostCard post={post} showActions={false} />
            <Button
              variant="contained"
              onClick={() => toggleEvaluationForm(postId)}
              sx={{ mt: 1 }}
              disabled={isEvaluated}
            >
              {isEvaluated ? 'Evaluated' : isOpen ? 'Cancel Evaluation' : 'Evaluate'}
            </Button>

            {isOpen && !isEvaluated && (
              <Box
                component="form"
                onSubmit={(e) => handleSubmit(e, postId)}
                sx={{ mt: 2 }}
              >
                <TextField
                  label="Score (1–10)"
                  type="number"
                  value={score}
                  onChange={(e) => handleFieldChange(postId, 'score', e.target.value)}
                  fullWidth
                  required
                  inputProps={{ min: 1, max: 10 }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Feedback"
                  value={feedback}
                  onChange={(e) => handleFieldChange(postId, 'feedback', e.target.value)}
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
