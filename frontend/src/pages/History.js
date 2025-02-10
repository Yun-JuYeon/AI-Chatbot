import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

function History({ chats, onSelectChat }) {
  return (
    <Box width="300px" bgcolor="#f5f5f5" p={2} borderRight="1px solid #ccc">
      <Typography variant="h6" marginBottom={2}>
        채팅 기록
      </Typography>
      <List>
        {chats.map((chatId, index) => (
          <ListItem button key={index} onClick={() => onSelectChat(chatId)}>
            <ListItemText primary={`Chat ${index + 1}`} secondary={chatId} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default History;
