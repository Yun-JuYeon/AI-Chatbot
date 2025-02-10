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
    return response.data; // 성공 시 데이터 반환
  } catch (error) {
    console.error("Login Error:", error);
    return null; // 실패 시 null 반환
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
    return response.data.chat_id || []; // chat_id 배열 반환
  } catch (error) {
    console.error("Chat History Error:", error);
    return []; // 오류 시 빈 배열 반환
  }
};


// Gemini 챗봇과 대화
export const chatWithGemini = async (chatId, userId, message) => {
  try {
    const response = await apiClient.post(
      `/chat_gemini?chat_id=${chatId}&user_id=${userId}&user_message=${message}`
    );
    return response.data;
  } catch (error) {
    console.error("Chat Gemini Error:", error);
    return null;
  }
};


export const getChatDetails = async (userId, chatId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/chat_details`, {
      params: { user_id: userId, chat_id: chatId },
    });
    return response.data; // 반환된 데이터
  } catch (error) {
    console.error("Error fetching chat details:", error);
    return null; // 실패 시 null 반환
  }
};