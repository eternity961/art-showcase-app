import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import {
  Container,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Box
} from '@mui/material';

function RankPage() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await api.get('/api/judge/rankings');
        setRankings(res.data);
      } catch (err) {
        console.error('Error fetching rankings:', err);
      }
    };
    fetchRankings();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Rankings
      </Typography>
      <List>
        {rankings.map((user, index) => (
          <React.Fragment key={user.userId}>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={user.avatar} alt={user.username} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ mr: 2 }}>
                      #{index + 1}
                    </Typography>
                    <Typography variant="body1">{user.username}</Typography>
                  </Box>
                }
                secondary={`Average Score: ${user.averageScore.toFixed(2)} | Total Score: ${user.totalScore}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}

export default RankPage;
