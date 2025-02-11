import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { createNewChat, chatWithGeminiStream, getChatHistory, getChatDetails } from "../api";
import History from "./History";

function Chat() {
  const [chatId, setChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // 현재 화면에 표시될 대화 기록
  const [userChats, setUserChats] = useState([]); // 좌측 히스토리 데이터
  const [isStreaming, setIsStreaming] = useState(false); // 스트리밍 상태
  let eventSource = null;

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
      setChatId(selectedChatId);
      setChatHistory(chatDetails.messages);
    } else {
      console.error("Failed to fetch chat details");
    }
  };

  // 메시지 전송 및 스트리밍 방식으로 응답 받기
  const sendMessage = async () => {
    if (!message.trim() || isStreaming) return;

    // 새로운 메시지 UI에 추가
    setChatHistory((prev) => [
      ...prev,
      { role: "user", parts: [message] },
      { role: "model", parts: [""] }, // 스트리밍 중인 응답을 표시할 공간
    ]);
    setMessage(""); // 입력창 비우기
    setIsStreaming(true);

    let newMessage = "";
    eventSource = chatWithGeminiStream(chatId, userId, message, (chunk) => {
      newMessage += chunk;

      setChatHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1] = {
          role: "model",
          parts: [newMessage], // 스트리밍된 메시지 업데이트
        };
        return updatedHistory;
      });
    });

    eventSource.onopen = () => console.log("SSE 연결됨");

    eventSource.onerror = () => {
      console.log("SSE 연결 종료");
      eventSource.close();
      setIsStreaming(false);
    };
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
              {/* 봇 응답 (스트리밍 중에도 실시간으로 업데이트됨) */}
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
            disabled={isStreaming} // 스트리밍 중일 때 입력 비활성화
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{ marginLeft: 2 }}
            disabled={isStreaming} // 스트리밍 중일 때 버튼 비활성화
          >
            전송
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;
