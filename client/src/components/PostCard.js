import React, { useContext, useState } from 'react';
import {
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  styled,
  Input,
  Snackbar,
  Alert,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../utils/api';
import { Filter } from 'bad-words';

// Styled components for enhanced dialog appearance
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    background: theme.palette.background.paper,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const filter = new Filter();

const PostCard = ({ post, onUpdate, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const { user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reportConfirmOpen, setReportConfirmOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const open = Boolean(anchorEl);
  const isOwner = user?.id === post.user._id;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleCloseMenu();
    setEditOpen(true);
  };

  const handleDelete = () => {
    handleCloseMenu();
    setConfirmOpen(true);
  };

  const handleReport = () => {
    handleCloseMenu();
    setReportConfirmOpen(true);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const submitEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editedTitle);
      formData.append('content', editedContent);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await api.put(`/api/posts/${post._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpdate?.(res.data);
      setEditOpen(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Error updating post:', err);
      setSnackbarMessage('Failed to update post');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const confirmDelete = async () => {
    try {
      console.log(`Attempting to delete post with ID: ${post._id}`);
      await api.delete(`/api/posts/${post._id}`);
      setConfirmOpen(false);
      setSnackbarMessage('Post deleted successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      console.log('Snackbar set to open for deletion success');
      // Delay onDelete to allow Snackbar to display
      setTimeout(() => {
        console.log(`Calling onDelete with ID: ${post._id}`);
        onDelete?.(post._id);
      }, 500); // 500ms delay to ensure Snackbar renders
    } catch (err) {
      console.error('Error deleting post:', err);
      setSnackbarMessage('Failed to delete post');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const confirmReport = async () => {
    try {
      await api.put(`/api/posts/${post._id}/report`);
      setReportConfirmOpen(false);
      setSnackbarMessage('Post reported successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error reporting post:', err);
      setSnackbarMessage('Failed to report post');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleLike = async () => {
    try {
      const res = await api.post(`/api/posts/${post._id}/like`);
      onUpdate?.(res.data);
    } catch (err) {
      console.error('Error liking post:', err);
      setSnackbarMessage('Failed to like post');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const cleanTitle = filter.clean(post.title);
  const cleanContent = filter.clean(post.content);
  const showContent = cleanContent.length <= 100;
  const avatarUrl = post.user?.profile?.avatar
    ? `${process.env.REACT_APP_API_URL}/${post.user.profile.avatar}`
    : '/assets/default-avatar.png';

  return (
    <Card sx={{ p: 2, mb: 2, boxShadow: 3 }}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <Avatar src={avatarUrl} sx={{ mr: 2 }} />
          <Box>
            <Typography variant="body1">
              <Link to={`/profile/${post.user._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {post.user.username}
              </Link>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {user && (
          <>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
              {isOwner ? (
                <>
                  <MenuItem onClick={handleEdit}>Edit</MenuItem>
                  <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleReport}>Report</MenuItem>
              )}
            </Menu>
          </>
        )}
      </Box>

      <Typography variant="h6" mt={1}>
        {cleanTitle}
      </Typography>
     <Typography variant="body2" mt={1}>
  {cleanContent.length <= 100 || expanded
    ? cleanContent
    : `${cleanContent.slice(0, 100)}...`}
</Typography>

{cleanContent.length > 100 && (
  <Button
    size="small"
    onClick={() => setExpanded(!expanded)}
    sx={{ textTransform: 'none', mt: 1, px: 0 }}
  >
    {expanded ? 'See Less' : 'See More'}
  </Button>
)}


      {post.file && (
        <CardMedia
          component={
            /\.(jpg|jpeg|png|gif)$/i.test(post.file)
              ? 'img'
              : /\.(mp3|wav)$/i.test(post.file)
              ? 'audio'
              : 'video'
          }
          controls
          src={`${process.env.REACT_APP_API_URL}/${post.file}`}
          alt="Post media"
          sx={{ mt: 2, borderRadius: 1, border: '1px solid #ccc' }}
        />
      )}

      <Box mt={2} display="flex" gap={2}>
        <Button
          startIcon={<ThumbUpIcon />}
          onClick={handleLike}
          color={post.likes.includes(user?.id) ? 'primary' : 'inherit'}
        >
          {post.likes.length} Likes
        </Button>
        <Button startIcon={<CommentIcon />} component={Link} to={`/post/${post._id}`}>
          Comments
        </Button>
      </Box>

      {/* Edit Dialog */}
      <StyledDialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <StyledDialogTitle>Edit Post</StyledDialogTitle>
        <StyledDialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            margin="dense"
            variant="outlined"
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Content"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            margin="dense"
            variant="outlined"
          />
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Upload New File (optional)
            </Typography>
            <Input
              type="file"
              onChange={handleFileChange}
              inputProps={{
                accept: 'image/*,audio/*,video/*',
              }}
            />
            {selectedFile && (
              <Typography variant="caption" color="text.secondary">
                Selected: {selectedFile.name}
              </Typography>
            )}
          </Box>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={() => setEditOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={submitEdit} variant="contained" color="primary">
            Save
          </Button>
        </StyledDialogActions>
      </StyledDialog>

      {/* Delete Confirm Dialog */}
      <StyledDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="xs">
        <StyledDialogTitle>Confirm Deletion</StyledDialogTitle>
        <StyledDialogContent>
          <Typography>Are you sure you want to delete this post? This action cannot be undone.</Typography>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </StyledDialogActions>
      </StyledDialog>

      {/* Report Confirm Dialog */}
      <StyledDialog open={reportConfirmOpen} onClose={() => setReportConfirmOpen(false)} fullWidth maxWidth="xs">
        <StyledDialogTitle>Report Post</StyledDialogTitle>
        <StyledDialogContent>
          <Typography>Are you sure you want to report this post? Our team will review it.</Typography>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={() => setReportConfirmOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmReport} color="warning" variant="contained">
            Report
          </Button>
        </StyledDialogActions>
      </StyledDialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default PostCard;