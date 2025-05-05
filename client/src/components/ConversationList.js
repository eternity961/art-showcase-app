import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';

function ConversationList({ conversations, onSelect }) {
  const currentUser = JSON.parse(localStorage.getItem('user'));

  return (
    <List>
      {conversations.map((conv) => {
        const otherUser = conv.participants.find(p => p._id !== currentUser.id);
        return (
          <ListItem
            button
            key={conv._id}
            onClick={() => onSelect(conv._id)}
            component={Link}
            to={`/messenger?conv=${conv._id}`}
          >
            <ListItemAvatar>
              <Avatar src={otherUser?.profile?.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={otherUser?.username || 'Unknown User'}
              secondary={conv.messages?.[conv.messages.length - 1]?.content || ''}
            />
          </ListItem>
        );
      })}
    </List>
  );
}

export default ConversationList;
