import React from 'react';
import { Box, Typography } from '@mui/material';

function MessageItem({ message, userId }) {
  const isSent = message.sender._id === userId;

  return (
    <Box
      sx={{
        mb: 1,
        p: 1,
        bgcolor: isSent ? 'primary.light' : 'grey.200',
        borderRadius: 2,
        alignSelf: isSent ? 'flex-end' : 'flex-start',
        maxWidth: '70%',
      }}
    >
      <Typography variant="body2">{message.content}</Typography>
      <Typography variant="caption" color="text.secondary">
        {new Date(message.timestamp).toLocaleTimeString()}
      </Typography>
    </Box>
  );
}

export default MessageItem;
