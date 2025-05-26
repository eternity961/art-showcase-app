import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Container, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Button, Box, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Snackbar, Alert
} from '@mui/material';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedJudgeRole, setSelectedJudgeRole] = useState('');
  const [banActionType, setBanActionType] = useState('ban'); // or 'unban'
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/admin/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  const showToast = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleBan = async () => {
    try {
      await api.post(`/api/admin/${banActionType}/${selectedUserId}`);
      setUsers(users.map(u => u._id === selectedUserId ? { ...u, isBanned: banActionType === 'ban' } : u));
      setBanDialogOpen(false);
      showToast(`User ${banActionType === 'ban' ? 'banned' : 'unbanned'} successfully`);
    } catch (err) {
      console.error(`Error trying to ${banActionType} user:`, err);
      showToast(`Failed to ${banActionType} user`, 'error');
    }
  };

  const handleAssignJudge = async () => {
    try {
      await api.post(`/api/admin/assign-judge/${selectedUserId}`, { role: selectedJudgeRole });
      setUsers(users.map(u => u._id === selectedUserId ? { ...u, role: selectedJudgeRole } : u));
      setAssignDialogOpen(false);
      showToast('Judge role assigned successfully');
    } catch (err) {
      console.error('Error assigning judge:', err);
      showToast('Failed to assign judge', 'error');
    }
  };

  const openAssignModal = (userId) => {
    setSelectedUserId(userId);
    setSelectedJudgeRole('');
    setAssignDialogOpen(true);
  };

  const openBanModal = (userId, type) => {
    setSelectedUserId(userId);
    setBanActionType(type);
    setBanDialogOpen(true);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isBanned ? 'Banned' : 'Active'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color={user.isBanned ? 'success' : 'error'}
                      onClick={() => openBanModal(user._id, user.isBanned ? 'unban' : 'ban')}
                    >
                      {user.isBanned ? 'Unban' : 'Ban'}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => openAssignModal(user._id)}
                    >
                      Assign Judge
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Assign Judge Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Judge Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Select Judge Role</InputLabel>
            <Select
              value={selectedJudgeRole}
              onChange={(e) => setSelectedJudgeRole(e.target.value)}
              label="Select Judge Role"
            >
              <MenuItem value="literal_judge">Literal Judge</MenuItem>
              <MenuItem value="visual_judge">Visual Judge</MenuItem>
              <MenuItem value="vocal_judge">Vocal Judge</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAssignJudge} color="primary" variant="contained" disabled={!selectedJudgeRole}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Ban Confirmation Dialog */}
      <Dialog open={banDialogOpen} onClose={() => setBanDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{banActionType === 'ban' ? 'Confirm Ban' : 'Confirm Unban'}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {banActionType} this user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBanDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleBan} color={banActionType === 'ban' ? 'error' : 'success'} variant="contained">
            {banActionType === 'ban' ? 'Ban' : 'Unban'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Toast */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AdminDashboard;
