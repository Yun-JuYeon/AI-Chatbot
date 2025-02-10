import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { createNewChat, chatWithGemini, getChatHistory } from "../api";
import History from "./History"; // 히스토리 컴포넌트 추가

function Chat() {
  const [chatId, setChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [userChats, setUserChats] = useState([]); // 히스토리 데이터

  const userId = localStorage.getItem("user_id");

  // 채팅 초기화 및 히스토리 불러오기
  useEffect(() => {
    const initializeChat = async () => {
      const newChat = await createNewChat(userId);
      if (newChat) {
        setChatId(newChat.chat_id);
      }
      const history = await getChatHistory(userId); // 히스토리 데이터 가져오기
      setUserChats(history || []);
    };
    initializeChat();
  }, [userId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const response = await chatWithGemini(chatId, userId, message);

    if (response && response.messages) {
      const latestBotMessage = [...response.messages]
        .reverse()
        .find((msg) => msg.role === "model");
      const botReply = latestBotMessage?.parts?.join(" ") || "응답을 가져올 수 없습니다.";

      setChatHistory([
        ...chatHistory,
        { user: message, bot: botReply }
      ]);
      setMessage(""); // 입력창 비우기
    } else {
      console.error("챗봇 응답이 비어 있습니다.");
    }
  };

  const handleSelectChat = (selectedChatId) => {
    setChatId(selectedChatId);
    // TODO: 서버에서 해당 chatId에 대한 대화를 불러오는 기능 추가 가능
  };

  return (
    <Box display="flex" height="100vh">
      {/* 히스토리 바 */}
      <History chats={userChats} onSelectChat={handleSelectChat} />

      {/* 채팅 화면 */}
      <Box flex={1} p={4} display="flex" flexDirection="column">
        <Typography variant="h5" marginBottom={2}>
          채팅창
        </Typography>
        <Box flex={1} overflow="auto" marginBottom={2}>
          {chatHistory.map((chat, index) => (
            <Box key={index} marginBottom={2}>
              <Typography variant="body1">
                <strong>나:</strong> {chat.user}
              </Typography>
              <Typography variant="body1">
                <strong>봇:</strong>{" "}
                <ReactMarkdown>{chat.bot}</ReactMarkdown>
              </Typography>
            </Box>
          ))}
        </Box>
        <Box display="flex">
          <TextField
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
          />
          <Button variant="contained" color="primary" onClick={sendMessage} sx={{ marginLeft: 2 }}>
            전송
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;
