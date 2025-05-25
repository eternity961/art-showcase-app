import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import CommentCard from '../components/CommentCard';
import { Container, TextField, Button, Box } from '@mui/material';
import { Filter } from 'bad-words';

const filter = new Filter(); // Extend with filter.addWords('yourword') if needed

function PostDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await api.get(`/api/posts/${id}`);
        setPost(postResponse.data);
      } catch (err) {
        console.error('Error fetching post:', err);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    try {
      const commentsResponse = await api.get(`/api/comments/${id}`);
      const cleanedComments = commentsResponse.data.map((comment) => ({
        ...comment,
        content: filter.clean(comment.content),
      }));
      setComments(cleanedComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/comments/${id}`, { content });
      setContent('');
      fetchComments(); // Refetch after comment is added
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/comments/delete/${commentId}`);
      fetchComments(); // Refetch after deletion
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  if (!post) return null;

  return (
    <Container sx={{ py: 4 }}>
      <PostCard post={post} onUpdate={setPost} />
      {user && (
        <Box component="form" onSubmit={handleComment} sx={{ mb: 4 }}>
          <TextField
            label="Add a comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained">
            Comment
          </Button>
        </Box>
      )}
      <Box>
        {comments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            onDelete={handleDeleteComment}
          />
        ))}
      </Box>
    </Container>
  );
}

export default PostDetail;
