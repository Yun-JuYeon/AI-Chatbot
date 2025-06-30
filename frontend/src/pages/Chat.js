import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Card, CardContent } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { createNewChat, chatWithGeminiStream, getChatHistory, getChatDetails } from "../api";
import History from "./History";

function Chat() {
  const [chatId, setChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // 현재 채팅 기록
  const [userChats, setUserChats] = useState([]); // 채팅 목록 (첫 번째 질문 포함)
  const [isStreaming, setIsStreaming] = useState(false); // 스트리밍 상태
  let eventSource = null;

  const userId = localStorage.getItem("user_id");

  // 🔹 채팅 히스토리 로드
  useEffect(() => {
    loadChatHistory();
  }, [userId]);

  // 🔹 히스토리 가져오기 (각 채팅의 첫 번째 메시지도 함께 불러옴)
  const loadChatHistory = async () => {
    const history = await getChatHistory(userId);
    const chatSummaries = await Promise.all(
      history.map(async (chatId) => {
        const chatDetails = await getChatDetails(userId, chatId);
        const firstMessage = chatDetails?.messages?.find((msg) => msg.role === "user")?.parts[0] || "새 채팅";
        return { chatId, title: firstMessage.slice(0, 20) + (firstMessage.length > 20 ? "..." : "") };
      })
    );
    setUserChats(chatSummaries);
  };

  // 🔹 새로운 채팅 시작 (버튼 클릭)
  const handleNewChat = async () => {
    const newChat = await createNewChat(userId);
    if (newChat) {
      setChatId(newChat.chat_id); // 새 채팅 ID 설정
      setChatHistory([]); // 기존 채팅 초기화

      // 🔹 새 채팅을 히스토리 목록에 추가 (즉시 반영)
      setUserChats((prevChats) => [{ chatId: newChat.chat_id, title: "새 채팅" }, ...prevChats]);
    }
  };

  // 🔹 히스토리에서 기존 채팅 선택
  const handleSelectChat = async (selectedChatId) => {
    const chatDetails = await getChatDetails(userId, selectedChatId);
    if (chatDetails && chatDetails.messages) {
      setChatId(selectedChatId);
      setChatHistory(chatDetails.messages);
    }
  };

  // 🔹 메시지 전송 및 스트리밍 처리
  const sendMessage = async () => {
    if (!message.trim() || isStreaming) return;

    // 채팅 메시지 UI에 추가
    setChatHistory((prev) => [
      ...prev,
      { role: "user", parts: [message] },
      { role: "model", parts: [""] }, // 스트리밍 응답을 위한 자리
    ]);
    setMessage("");
    setIsStreaming(true);

    let newMessage = "";
    eventSource = chatWithGeminiStream(chatId, userId, message, (chunk) => {
      newMessage += chunk;

      setChatHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1] = {
          role: "model",
          parts: [newMessage], // 스트리밍된 응답 업데이트
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
      {/* 🔹 히스토리 바 */}
      <History chats={userChats} onSelectChat={handleSelectChat} onNewChat={handleNewChat} />

      {/* 🔹 채팅 화면 */}
      <Box flex={1} p={4} display="flex" flexDirection="column">
        <Box flex={1} overflow="auto" marginTop={2}>
          {chatHistory.map((chat, index) => (
            <Box key={index} marginBottom={2} display="flex" flexDirection="column">
              {/* 사용자 메시지 */}
              {chat.role === "user" && (
                <Box display="flex" justifyContent="flex-end" mb={1}>
                  <Card sx={{ maxWidth: "70%", backgroundColor: "#d1e7ff", borderRadius: "12px" }}>
                    <CardContent>
                      <Typography variant="body1">{chat.parts.join(" ")}</Typography>
                    </CardContent>
                  </Card>
                </Box>
              )}
              {/* AI 응답 */}
              {chat.role === "model" && (
                <Box display="flex" justifyContent="flex-start">
                  <Card sx={{ maxWidth: "70%", backgroundColor: "#f5f5f5", borderRadius: "12px" }}>
                    <CardContent>
                        <ReactMarkdown>{chat.parts.join(" ")}</ReactMarkdown>
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* 🔹 메시지 입력 */}
        <Box display="flex" mt={2}>
          <TextField
            variant="outlined"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={isStreaming}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{ marginLeft: 2 }}
            disabled={isStreaming}
          >
            전송
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;
