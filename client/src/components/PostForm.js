import React, { useState } from 'react';
import api from '../utils/api';
import { TextField, Button, MenuItem, Box } from '@mui/material';

function PostForm({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('literal');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    if (file) formData.append('file', file);

    try {
      const response = await api.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onPostCreated(response.data);
      setTitle('');
      setContent('');
      setCategory('literal');
      setFile(null);
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      <TextField
        select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="literal">Literal Art</MenuItem>
        <MenuItem value="visual">Visual Art</MenuItem>
        <MenuItem value="vocal">Vocal Art</MenuItem>
      </TextField>
      <input
        type="file"
        accept="image/*,audio/*"
        onChange={(e) => setFile(e.target.files[0])}
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
        Create Post
      </Button>
    </Box>
  );
}

export default PostForm;