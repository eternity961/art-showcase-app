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
  MenuItem,
  InputAdornment,
  useMediaQuery,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import api from '../utils/api';

function TopRankedPost() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const res = await api.get('/api/judge/top-ranked');
        setCategories(res.data || []);
        if (res.data.length > 0) {
          setSelectedCategory(res.data[0].category);
        }
      } catch (err) {
        console.error('Failed to load top posts:', err);
      }
    };
    fetchTopPosts();
  }, []);

  const currentCategory = categories.find(c => c.category === selectedCategory);

  const filteredPosts = currentCategory?.top10?.filter(({ post }) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box display="flex">
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: 250,
            height: '100vh',
            position: 'fixed',
            top: 65,
            left: 0,
            bgcolor: 'white',
            borderRight: '1px solid #ddd',
            p: 2,
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

          <Typography variant="h6" gutterBottom>Categories</Typography>
          {categories.map(({ category }) => (
            <Button
              key={category}
              fullWidth
              variant={selectedCategory === category ? 'contained' : 'text'}
              onClick={() => setSelectedCategory(category)}
              sx={{ justifyContent: 'flex-start', mb: 1, textTransform: 'capitalize' }}
            >
              {category}
            </Button>
          ))}
        </Box>
      )}

      <Container sx={{ ml: isMobile ? 0 : '270px', py: 4 }}>
        <Typography textTransform="capitalize" variant="h5" gutterBottom>Top Ranked {currentCategory?.category} Posts</Typography>

        {/* Mobile: Category selector and search */}
        {isMobile && (
          <>
            <TextField
              select
              label="Select Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              {categories.map(({ category }) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} Art
                </MenuItem>
              ))}
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
        

        {currentCategory && (
          <>
           
            <Grid container spacing={3}>
              {filteredPosts?.map(({ post, finalScore, userScore, judgeScore }, index) =>
                post && post.user && (
                  <Grid item xs={12} key={post._id}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar src={post.user && post.user.profile && post.user.profile.avatar
    ? `${process.env.REACT_APP_API_URL}/${post.user.profile.avatar}`
    : '/assets/default-avatar.png'} />
                            <Box>
                              <Typography fontWeight="bold">{post.user.username}</Typography>
                             <Link to={`/profile/${post.user._id}`} style={{ textDecoration: 'none' }}>
                                         <Typography sx={{ fontSize: 14, color: 'blue' }}>View Profile</Typography>
                                       </Link>
                            </Box>
                          </Box>
                          <Typography fontWeight="bold">
                            #{index + 1} — Score: {finalScore.toFixed(2)}
                          </Typography>
                        </Box>

                        <Typography variant="h6">{post.title}</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {post.content.length > 200 ? `${post.content.slice(0, 200)}...` : post.content}
                        </Typography>

                        {post.file && (
                          <Box mt={2}>
                            {post.file.endsWith('.jpg') || post.file.endsWith('.png') || post.file.endsWith('.jpeg') ? (
                              <img src={post.file} alt="Post media" style={{ maxWidth: '100%' }} />
                            ) : post.file.endsWith('.mp3') || post.file.endsWith('.wav') ? (
                              <audio controls style={{ width: '100%' }}>
                                <source src={post.file} type="audio/mpeg" />
                              </audio>
                            ) : post.file.endsWith('.mp4') ? (
                              <video controls style={{ width: '100%' }}>
                                <source src={post.file} type="video/mp4" />
                              </video>
                            ) : (
                              <Typography variant="caption">Unsupported media format</Typography>
                            )}
                          </Box>
                        )}

                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2">
                          User Score: {userScore.toFixed(2)} | Judge Score: {judgeScore.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              )}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}

export default TopRankedPost;
