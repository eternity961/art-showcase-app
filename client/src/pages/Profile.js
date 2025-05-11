import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Card,
  CardContent,
  Paper,
  useMediaQuery,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';
const categoryOptions = ['visual', 'vocal', 'literal'];

function Profile() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/users/${id || user.id}`);
        setProfile(response.data);
        setUsername(response.data.username);
        setBio(response.data.profile.bio);

        const postsResponse = await api.get(`/api/posts/user/${id || user.id}`);
        setPosts(postsResponse.data);
      } catch (err) {
        console.error('Error fetching profile or posts:', err);
        setPosts([]);
      }
    };

    fetchProfile();
  }, [id, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    if (avatar) formData.append('avatar', avatar);

    try {
      const response = await api.patch('/api/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(response.data.user);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (!profile) return null;

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch = !searchTerm || post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar for desktop, only show if role is 'user' */}
      {!isMobile && profile.role === 'user' && (
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

          <Typography variant="h6" gutterBottom>Categories</Typography>
          {categoryOptions.map((cat) => (
            <Button
              key={cat}
              fullWidth
              variant={selectedCategory === cat ? 'contained' : 'text'}
              onClick={() => setSelectedCategory(cat)}
              sx={{ justifyContent: 'flex-start', mb: 1, textTransform: 'capitalize' }}
            >
              {cat}
            </Button>
          ))}
        </Paper>
      )}

      {/* Main content */}
      <Container sx={{ ml: isMobile || profile.role !== 'user' ? 0 : '270px', py: 4 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
          <Avatar
            src={
              profile.profile.avatar
                ? `${process.env.REACT_APP_API_URL}/${profile.profile.avatar}`
                : '/assets/default-avatar.png'
            }
            sx={{ width: 80, height: 80, border: '5px solid #ddd' }}
          />
          <Box>
            <Typography variant="h5" textTransform="uppercase">{profile.username}</Typography>
            <Typography variant="body1" color="gray">{profile.profile.bio}</Typography>
          </Box>
        </Box>

        {/* Update Profile Form (only for self) */}
        {user && user.id === profile._id && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box component="form" onSubmit={handleUpdate}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  style={{
                    marginBottom: '16px',
                    padding: '10px',
                    border: '2px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'block',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                <Button type="submit" variant="contained" fullWidth>
                  Update Profile
                </Button>

                <Box sx={{ py: 4, textAlign: 'center' }}>
  <Typography>
    Do you want to change your password?{' '}
    <Link
      component={RouterLink}
      to="/change-password"
      sx={{ textDecoration: 'none', color: 'primary.main' }} // Customize as needed
    >
      Click Here
    </Link>
  </Typography>
  </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Mobile filters */}
        {isMobile && profile.role === 'user' && (
          <>
            <TextField
              select
              label="Select Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="">All</MenuItem>
              {categoryOptions.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
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

        {/* Posts */}
        {profile.role === 'user' && (
          <Box>
            {filteredPosts.length === 0 ? (
              <Typography>No posts found.</Typography>
            ) : (
              filteredPosts.map((post) => (
                <Box key={post._id} sx={{ mb: 2 }}>
                  <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
                    <Box>
                      <PostCard post={post} />
                    </Box>
                  </Link>
                </Box>
              ))
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Profile;
