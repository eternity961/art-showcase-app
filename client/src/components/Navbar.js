import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { AppBar, Toolbar, Typography, Button, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

function Navbar() {
  const { user, logout, notifications } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Navigate to login after logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Art Showcase
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/messenger">
              Messages
            </Button>
            <Button color="inherit" component={Link} to="/notifications">
              <Badge badgeContent={notifications.filter(n => !n.read).length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </Button>
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
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;