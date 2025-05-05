import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

function MessageItem({ message, userId }) {
  const isSent = message.sender._id === userId;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isSent ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        mb: 2,
      }}
    >
      <Avatar
        src={message.sender?.profile?.avatar}
        alt={message.sender?.username}
        sx={{ width: 32, height: 32, ml: isSent ? 1 : 0, mr: isSent ? 0 : 1 }}
      />
      <Box
        sx={{
          bgcolor: isSent ? 'primary.main' : 'grey.200',
          color: isSent ? 'white' : 'black',
          borderRadius: 2,
          px: 2,
          py: 1,
          maxWidth: '70%',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {message.sender?.username || 'Unknown'}
        </Typography>
        <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
          {message.content}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }} color="text.secondary">
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
}

export default MessageItem;
