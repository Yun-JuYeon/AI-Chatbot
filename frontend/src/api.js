import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // FastAPI 서버 주소

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 로그인: 사용자 존재 여부 확인
export const getUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/login?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    return null;
  }
};

// 새로운 채팅 생성
export const createNewChat = async (userId) => {
  try {
    const response = await apiClient.get(`/new_chat?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("New Chat Error:", error);
    return null;
  }
};

// 채팅 기록 가져오기
export const getChatHistory = async (userId) => {
  try {
    const response = await apiClient.get(`/chat_history?user_id=${userId}`);
    return response.data.chat_id || [];
  } catch (error) {
    console.error("Chat History Error:", error);
    return [];
  }
};

// Gemini 챗봇과 대화 (스트리밍)
export const chatWithGeminiStream = async (chatId, userId, message, onMessage, onFinish) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat_gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        user_id: userId,
        user_message: message,
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (onFinish) onFinish(); // 스트림 자연종료
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      let lines = buffer.split('\n\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim();

          if (line === '[DONE]') {
            if (onFinish) onFinish(); // 서버가 종료 신호 보냄
            return;
          }

          if (data) {
            onMessage(data);
          }
        }
      }
    }
  } catch (error) {
    console.error("Streaming Error:", error);
    if (onFinish) onFinish(); // 오류 나도 입력창 풀어야 함
  }
};

export const getChatDetails = async (userId, chatId) => {
  try {
    const response = await apiClient.get(`/chat_details`, {
      params: { user_id: userId, chat_id: chatId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat details:", error);
    return null;
  }
};
