import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

function ConversationList({ conversations, onSelect }) {
  return (
    <List>
      {conversations.map((conv) => {
        const otherUser = conv.participants.find(p => p._id !== localStorage.getItem('user')?.id);
        return (
          <ListItem
            button
            key={conv._id}
            onClick={() => onSelect(conv._id)}
            component={Link}
            to={`/messenger?conv=${conv._id}`}
          >
            <ListItemAvatar>
              <Avatar src={otherUser?.profile.avatar} />
            </ListItemAvatar>
            <ListItemText primary={otherUser?.username} secondary={conv.messages[conv.messages.length - 1]?.content} />
          </ListItem>
        );
      })}
    </List>
  );
}

export default ConversationList;
