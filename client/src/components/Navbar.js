import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
function Navbar() {
  const { notifications, unreadCount } = useContext(NotificationContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const avatarSrc = user?.profile?.avatar
    ? `${process.env.REACT_APP_API_URL}/${user?.profile?.avatar}`
    : '/assets/default-avatar.png';

  const drawerLinks = (
    <Box
      sx={{
        width: 250,
        height: '100%',
        backgroundColor: '#1976d2',
        color: 'white',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        {!user ? (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary="Register" />
            </ListItem>
          </>
        ) : (
          <>
            {user.role === 'user' && (
              <ListItem button component={Link} to="/top-ranked">
                <ListItemText primary="Rankings" />
              </ListItem>
            )}
            {user.role === 'admin' && (
              <ListItem button component={Link} to="/admin">
                <ListItemText primary="Admin Panel" />
              </ListItem>
            )}
            {user.role === 'judge' && (
              <ListItem button component={Link} to="/judge">
                <ListItemText primary="Judge Panel" />
              </ListItem>
            )}
            <ListItem button component={Link} to="/messenger">
              <ListItemText primary="Messages" />
            </ListItem>
            <ListItem button component={Link} to={`/profile/${user?.id}`}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#1976d2',
          width: '100%',
          padding: isMobile ? '0 6px' : '0 28px',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 400,
              fontSize: '1.3rem',
            }}
          >
            🎨 Art Showcase
          </Typography>

          {isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user ? ( <>
               <IconButton color="inherit" component={Link} to="/notifications">
  <Badge badgeContent={unreadCount} color="secondary">
    <NotificationsIcon />
  </Badge>
</IconButton>

              </>) : (<></>) }
              <IconButton onClick={toggleDrawer(true)} color="inherit">
                <MenuIcon />
              </IconButton>

              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{ sx: { backgroundColor: '#1976d2' } }}
              >
                {drawerLinks}
              </Drawer>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!user ? (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </>
              ) : (
                <>
                  {user && user.role === 'user' && (
                    <Button color="inherit" component={Link} to="/top-ranked">
                      Rankings
                    </Button>
                  )}
                  {user && user.role === 'admin' && (
                    <Button color="inherit" component={Link} to="/admin">
                      Admin
                    </Button>
                  )}
                  {user && user.role === 'judge' && (
                    <Button color="inherit" component={Link} to="/judge">
                      Judge
                    </Button>
                  )}
                  <IconButton color="inherit" component={Link} to="/notifications">
                    <Badge badgeContent={notifications.filter((n) => !n.read).length} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>

                  <Button
                    color="inherit"
                    startIcon={<Avatar sx={{ width: 24, height: 24 }} src={avatarSrc} />}
                    onClick={handleMenuOpen}
                  >
                    {user.username}
                  </Button>

                  <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                    <MenuItem component={Link} to={`/profile/${user?.id}`} onClick={handleMenuClose}>
                      Profile
                    </MenuItem>
                    <MenuItem component={Link} to="/messenger" onClick={handleMenuClose}>
                      Messages
                    </MenuItem>
                    <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}

export default Navbar;
