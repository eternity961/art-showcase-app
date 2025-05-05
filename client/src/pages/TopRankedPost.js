import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Button,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function TopRankedPost() {
  const [topPosts, setTopPosts] = useState([]);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const res = await api.get('/api/judge/top-ranked');
        setTopPosts(res.data || []);
      } catch (err) {
        console.error('Failed to load top posts:', err);
      }
    };
    fetchTopPosts();
  }, []);

  if (!topPosts.length) {
    return <Typography>Loading top ranked posts...</Typography>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Top 10 Ranked Posts</Typography>
      <Grid container spacing={2}>
        {topPosts.map(({ post, score }, index) => (
          post && post.user && (
            <Grid item xs={12} md={6} key={post._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    #{index + 1} — Score: {score}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
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
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    {post.content || 'No content'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        ))}
      </Grid>
    </Container>
  );
}

export default TopRankedPost;
