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
  Paper, 
  InputAdornment,
  useMediaQuery,
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

function LiteralJudgeDashboard() {
  const [posts, setPosts] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [evaluatedPosts, setEvaluatedPosts] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, evalRes] = await Promise.all([
          api.get('/api/judge/top-posts?category=literal'),
          api.get('/api/judge/evaluations'),
        ]);

        const topPosts = postRes.data;
        setPosts(topPosts);
        setEvaluations({});

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
  }, []);

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

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = !searchTerm || post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'evaluated' && evaluatedPosts.has(post._id)) ||
      (filterStatus === 'unevaluated' && !evaluatedPosts.has(post._id));

    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar for desktop */}
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
            Status
          </Typography>
          <Link
            onClick={() => setFilterStatus('all')}
            sx={{
              fontFamily: 'sans-serif',
              display: 'block',
              padding: '8px',
              textDecoration: 'none',
              backgroundColor: filterStatus === 'all' ? theme.palette.primary.main : 'transparent',
              color: filterStatus === 'all' ? '#fff' : 'inherit',
              mb: 1,
              cursor: 'pointer',
            }}
          >
            All
          </Link>
          <Link
            onClick={() => setFilterStatus('evaluated')}
            sx={{
              fontFamily: 'sans-serif',
              display: 'block',
              padding: '8px',
              textDecoration: 'none',
              backgroundColor: filterStatus === 'evaluated' ? theme.palette.primary.main : 'transparent',
              color: filterStatus === 'evaluated' ? '#fff' : 'inherit',
              mb: 1,
              cursor: 'pointer',
            }}
          >
            Evaluated
          </Link>
          <Link
            onClick={() => setFilterStatus('unevaluated')}
            sx={{
              fontFamily: 'sans-serif',
              display: 'block',
              padding: '8px',
              textDecoration: 'none',
              backgroundColor: filterStatus === 'unevaluated' ? theme.palette.primary.main : 'transparent',
              color: filterStatus === 'unevaluated' ? '#fff' : 'inherit',
              cursor: 'pointer',
            }}
          >
            Un-Evaluated
          </Link>
        </Paper>
      )}

      {/* Main content */}
      <Container sx={{ ml: isMobile ? 0 : '270px', py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Literal Judge Dashboard
        </Typography>

        {/* Mobile filters */}
        {isMobile && (
          <>
            <TextField
              select
              label="Select Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="evaluated">Evaluated</MenuItem>
              <MenuItem value="unevaluated">Un-Evaluated</MenuItem>
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

        {/* Posts */}
        {filteredPosts.map(post => {
          const postId = post._id;
          const isOpen = evaluations[postId]?.isOpen || false;
          const score = evaluations[postId]?.score || '';
          const feedback = evaluations[postId]?.feedback || '';
          const isEvaluated = evaluatedPosts.has(postId);

          return (
            <Box
              key={postId}
              sx={{
                mb: 4,
                backgroundColor: isEvaluated ? '#f0f0f0' : 'transparent',
                cursor: isEvaluated ? 'not-allowed' : 'pointer',
                opacity: isEvaluated ? 0.6 : 1,
              }}
            >
              <PostCard post={post} showActions={false} />
              {!isEvaluated && (
                <Button
                  variant="contained"
                  onClick={() => toggleEvaluationForm(postId)}
                  sx={{ mt: 1 }}
                >
                  {isOpen ? 'Cancel Evaluation' : 'Evaluate'}
                </Button>
              )}

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
    </Box>
  );
}

export default LiteralJudgeDashboard;
