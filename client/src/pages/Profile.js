import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import { Container, Typography, TextField, Button, Avatar, Box } from '@mui/material';

function Profile() {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // Get user ID from URL params
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);

  // Fetch profile and posts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/users/${id || user.id}`);
        setProfile(response.data);
        setUsername(response.data.username);
        setBio(response.data.profile.bio);
  
        // ✅ Now this will work
        const postsResponse = await api.get(`/api/posts/user/${id || user.id}`);
        setPosts(postsResponse.data);
      } catch (err) {
        console.error('Error fetching profile or posts:', err);
        setPosts([]); // fallback
      }
    };
  
    fetchProfile();
  }, [id, user]);
  

  // Handle profile update
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

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {profile.username}'s Profile
      </Typography>
      
      {/* Profile Avatar */}
      <Avatar
        src={profile.profile.avatar ? `${process.env.REACT_APP_API_URL}/${profile.profile.avatar}` : '/assets/default-avatar.png'}
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      
      {/* Profile Bio */}
      <Typography variant="body1">{profile.profile.bio}</Typography>
      
      {/* Update Profile Form for the logged-in user */}
      {user && user.id === profile._id && (
        <Box component="form" onSubmit={handleUpdate} sx={{ mt: 4 }}>
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
            style={{ marginBottom: '16px' }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Update Profile
          </Button>
        </Box>
      )}

      {/* Display List of Posts */}
      {/* Display List of Posts only if user role is "user" */}
{profile.role === 'user' && (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h5" gutterBottom>
      {profile.username}'s Posts
    </Typography>
    {posts.length === 0 ? (
      <Typography>No posts yet.</Typography>
    ) : (
      posts.map((post) => (
        <Box key={post._id} sx={{ mb: 2 }}>
          <Link to={`/post/${post._id}`} style={{ textDecoration: 'none' }}>
            <PostCard post={post} />
          </Link>
        </Box>
      ))
    )}
  </Box>
)}

    </Container>
  );
}

export default Profile;
