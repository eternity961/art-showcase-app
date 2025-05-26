import React, { useContext, useState, useEffect } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Tooltip,
  ListItemAvatar,
  Avatar,
  Paper,
  Link,
  useMediaQuery,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';

const categories = ['all', 'post', 'like', 'comment', 'evaluation'];

const categorizeNotification = (content) => {
  if (!content) return 'other';
  const c = content.toLowerCase();
  if (c.includes('created')) return 'post';
  if (c.includes('like')) return 'like';
  if (c.includes('comment') || c.includes('commented')) return 'comment';
  if (c.includes('evaluate') || c.includes('evaluated')) return 'evaluation';
  return 'other';
};

const NotificationsPage = () => {
  const { notifications, markAsRead } = useContext(NotificationContext);
  const [filter, setFilter] = useState('all');
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (filter === 'all') {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(
        notifications.filter((n) => categorizeNotification(n.content) === filter)
      );
    }
  }, [filter, notifications]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Sidebar - Desktop only */}
      {!isMobile && (
        <Paper
          elevation={3}
          sx={{
            width: 220,
            height: '100vh',
            position: 'fixed',
            top: 64,
            left: 0,
            p: 2,
            borderRight: '1px solid #ddd',
            bgcolor: '#fff',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Filter Notifications
          </Typography>
          {categories.map((cat) => (
            <Link
              key={cat}
              component="button"
              underline="none"
              onClick={() => setFilter(cat)}
              sx={{
                display: 'block',
                mb: 1.5,
                p: 1,
                borderRadius: 1,
                backgroundColor: filter === cat ? theme.palette.primary.main : 'transparent',
                color: filter === cat ? '#fff' : theme.palette.text.primary,
                textTransform: 'capitalize',
                fontWeight: filter === cat ? 'bold' : 'normal',
                fontFamily: 'Arial, sans-serif',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: filter === cat
                    ? theme.palette.primary.dark
                    : theme.palette.action.hover,
                },
              }}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
        </Paper>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: !isMobile ? '220px' : 0,
          width: '100%',
        }}
      >
        

        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
{/* Mobile filter select at the top */}
        {isMobile && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter</InputLabel>
              <Select
                label="Filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
        {filteredNotifications.length === 0 ? (
          <Typography>No notifications</Typography>
        ) : (
          <List>
            {filteredNotifications.map((n) => (
              <ListItem
                key={n._id}
                secondaryAction={
                  !n.read && (
                    <Tooltip title="Mark as read">
                      <IconButton
                        edge="end"
                        onClick={() => markAsRead(n._id)}
                        size="small"
                        aria-label="mark as read"
                      >
                        <CheckCircleIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  )
                }
                sx={{
                  bgcolor: n.read ? 'background.paper' : 'rgba(25, 118, 210, 0.1)',
                  borderRadius: 2,
                  mb: 1,
                  transition: 'background 0.3s',
                  '&:hover': {
                    bgcolor: n.read ? 'grey.100' : 'rgba(25, 118, 210, 0.2)',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: n.read ? 'grey.400' : 'primary.main' }}>
                    <NotificationsNoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={n.content}
                  secondary={new Date(n.createdAt).toLocaleString()}
                  primaryTypographyProps={{
                    fontWeight: n.read ? 'normal' : 'bold',
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default NotificationsPage;
