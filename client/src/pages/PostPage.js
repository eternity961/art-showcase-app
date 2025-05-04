import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

function PostPage() {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);  // State to hold the post data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);  // Set the post data to state
      } catch (err) {
        setError(err.message);  // Set error state
      } finally {
        setLoading(false);  // Set loading to false once the request is done
      }
    };

    fetchPost();
  }, [id]); // This effect will rerun if the post ID changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p><strong>Category:</strong> {post.category}</p>
      <p><strong>Posted by:</strong> {post.user.username}</p>
      <img src={post.user.profile.avatar} alt={post.user.username} style={{ width: 50, height: 50, borderRadius: '50%' }} />
      {/* Render any other post details */}
    </div>
  );
}

export default PostPage;
