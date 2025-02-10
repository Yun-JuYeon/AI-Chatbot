import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { createNewChat, chatWithGemini, getChatHistory, getChatDetails } from "../api";
import History from "./History";

function Chat() {
  const [chatId, setChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // 현재 화면에 표시될 대화 기록
  const [userChats, setUserChats] = useState([]); // 좌측 히스토리 데이터

  const userId = localStorage.getItem("user_id");

  // 채팅 초기화 및 히스토리 데이터 로드
  useEffect(() => {
    const initializeChat = async () => {
      const newChat = await createNewChat(userId);
      if (newChat) {
        setChatId(newChat.chat_id);
      }
      const history = await getChatHistory(userId); // 히스토리 API 호출
      setUserChats(history || []); // 히스토리 데이터 설정
    };
    initializeChat();
  }, [userId]);

  // 히스토리에서 선택된 채팅 조회
  const handleSelectChat = async (selectedChatId) => {
    const chatDetails = await getChatDetails(userId, selectedChatId); // API 호출
    if (chatDetails && chatDetails.messages) {
      setChatId(selectedChatId); // 현재 활성화된 chat_id 업데이트
      setChatHistory(chatDetails.messages); // API 응답의 messages를 채팅 기록에 설정
    } else {
      console.error("Failed to fetch chat details");
    }
  };

  // 메시지 전송
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
        { role: "user", parts: [message] },
        { role: "model", parts: [botReply] },
      ]);
      setMessage(""); // 입력창 비우기
    } else {
      console.error("챗봇 응답이 비어 있습니다.");
    }
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
            <Box key={index} marginBottom={2} display="flex" flexDirection="column">
              {/* 사용자 메시지 */}
              {chat.role === "user" && (
                <Box display="flex" justifyContent="flex-end" mb={1}>
                  <Card
                    sx={{
                      maxWidth: "70%",
                      backgroundColor: "#d1e7ff",
                      borderRadius: "12px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="body1" color="textPrimary">
                        {chat.parts.join(" ")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              )}
              {/* 봇 응답 */}
              {chat.role === "model" && (
                <Box display="flex" justifyContent="flex-start">
                  <Card
                    sx={{
                      maxWidth: "70%",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "12px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="body1" color="textPrimary">
                        <ReactMarkdown>{chat.parts.join(" ")}</ReactMarkdown>
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>
          ))}
        </Box>
        {/* 메시지 입력 */}
        <Box display="flex" mt={2}>
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
