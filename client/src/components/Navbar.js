import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';

function Navbar() {
  const { user, logout, notifications } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

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
        {user ? (
          <>
            {user.role === 'user' && (
              <ListItem button component={Link} to="/top-ranked">
                <ListItemText primary="Rankings" />
              </ListItem>
            )}
            <ListItem button component={Link} to="/messenger">
              <ListItemText primary="Messages" />
            </ListItem>
            <ListItem button component={Link} to="/notifications">
              <Badge badgeContent={notifications.filter((n) => !n.read).length} color="error">
                <ListItemText primary="Notifications" />
              </Badge>
            </ListItem>
            <ListItem button component={Link} to={`/profile/${user.id}`}>
              <ListItemText primary="Profile" />
            </ListItem>
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
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemText primary="Register" />
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
            Art Showcase
          </Typography>

          {isMobile ? (
            <>
              <IconButton color="inherit" onClick={toggleDrawer(!drawerOpen)}>
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
            </>
          ) : (
            <Box>
              {user ? (
                <>
                  {user.role === 'user' && (
                    <Button color="inherit" component={Link} to="/top-ranked">
                      Rankings
                    </Button>
                  )}
                  <Button color="inherit" component={Link} to="/messenger">
                    Messages
                  </Button>
                  <IconButton color="inherit" component={Link} to="/notifications">
                    <Badge badgeContent={notifications.filter((n) => !n.read).length} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <Button color="inherit" component={Link} to={`/profile/${user.id}`}>
                    Profile
                  </Button>
                  {user.role === 'admin' && (
                    <Button color="inherit" component={Link} to="/admin">
                      Admin
                    </Button>
                  )}
                  {user.role === 'judge' && (
                    <Button color="inherit" component={Link} to="/judge">
                      Judge
                    </Button>
                  )}
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/register">
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer for fixed navbar */}
    </>
  );
}

export default Navbar;
