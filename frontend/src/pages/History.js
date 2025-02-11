import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";

function History({ chats, onSelectChat, onNewChat }) {
  return (
    <Box width="300px" bgcolor="#f5f5f5" p={2} borderRight="1px solid #ccc">
      {/* 🔹 새 채팅 버튼 (최상단, 스타일 변경) */}
      <Button
        fullWidth
        variant="contained"
        onClick={onNewChat}
        sx={{
          backgroundColor: "#a7c7e7", // 연하늘색
          color: "#ffffff", // 흰색 텍스트
          padding: "12px", // 세로 길이 증가
          fontSize: "16px", // 텍스트 크기 조정
          fontWeight: "bold", // 글씨 굵게
          marginBottom: 2, // 아래 여백 추가
          "&:hover": { backgroundColor: "#8bb7e0" }, // 호버 시 색상 변경
        }}
      >
        + 새 채팅
      </Button>

      <Typography variant="h6" marginBottom={2}>
        채팅 기록
      </Typography>

      <List>
        {chats.map((chat, index) => (
          <ListItem button key={index} onClick={() => onSelectChat(chat.chatId)}>
            <ListItemText primary={chat.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default History;
