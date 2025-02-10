import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { getChatHistory } from "../api";

function History({ onSelectChat }) {
  const [userChats, setUserChats] = useState([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchHistory = async () => {
      const chatIds = await getChatHistory(userId);
      setUserChats(chatIds || []);
    };
    fetchHistory();
  }, [userId]);

  return (
    <Box width="300px" bgcolor="#ffffff" p={2} borderRight="1px solid #ccc">
      <Typography variant="h6" marginBottom={2}>
        채팅 기록
      </Typography>
      <List>
        {userChats.map((chatId, index) => (
          <ListItem key={index} onClick={() => onSelectChat(chatId)}>
            <ListItemText primary={`Chat ${index + 1}`} secondary={chatId} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default History;
