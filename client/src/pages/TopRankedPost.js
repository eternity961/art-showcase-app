import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function TopRankedPost() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const res = await api.get('/api/judge/top-ranked');
        setCategories(res.data || []);
        if (res.data.length > 0) {
          setSelectedCategory(res.data[0].category); // default to first
        }
      } catch (err) {
        console.error('Failed to load top posts:', err);
      }
    };
    fetchTopPosts();
  }, []);

  const currentCategory = categories.find(c => c.category === selectedCategory);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Top 10 Ranked Posts</Typography>

      <TextField
        select
        label="Select Category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        fullWidth
        sx={{ mb: 4 }}
      >
        {categories.map(({ category }) => (
          <MenuItem key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)} Art
          </MenuItem>
        ))}
      </TextField>

      {currentCategory && (
        <>
          <Typography variant="h5" gutterBottom textTransform="capitalize">
            {currentCategory.category} Art
          </Typography>
          <Grid container spacing={2}>
            {currentCategory.top10.map(({ post, finalScore, userScore, judgeScore }, index) => (
              post && post.user && (
                <Grid item xs={12} md={6} key={post._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        #{index + 1} — Total Score: {finalScore.toFixed(2)}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar src={post.user?.profile?.avatar} />
                        <Box>
                          <Typography>{post.user?.username}</Typography>
                          <Button
                            component={Link}
                            to={`/profile/${post.user._id}`}
                            size="small"
                          >
                            View Profile
                          </Button>
                        </Box>
                      </Box>

                      {currentCategory.category === 'literal' && (
                        <>
                          <Typography variant="subtitle1">
                            Title: {post.title}
                          </Typography>
                          <Typography variant="body2">
                            Content: {post.content}
                          </Typography>
                        </>
                      )}

                      {post.file && (
                        <>
                          {post.file.endsWith('.jpg') || post.file.endsWith('.png') || post.file.endsWith('.jpeg') ? (
                            <img
                              src={post.file}
                              alt="Visual Post"
                              style={{ maxWidth: '100%', marginTop: 8 }}
                            />
                          ) : post.file.endsWith('.mp3') || post.file.endsWith('.wav') ? (
                            <audio controls style={{ marginTop: 8, width: '100%' }}>
                              <source src={post.file} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          ) : post.file.endsWith('.mp4') ? (
                            <video controls style={{ marginTop: 8, width: '100%' }}>
                              <source src={post.file} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              File format not supported
                            </Typography>
                          )}
                        </>
                      )}

                      <Typography variant="body2" sx={{ mt: 2 }}>
                        User Score (Likes): {userScore.toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        Judge Score: {judgeScore.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}

export default TopRankedPost;
