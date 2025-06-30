import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import { getUserId } from "../api";

function Home() {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const userData = await getUserId(userId);
    if (userData) {
      localStorage.setItem("user_id", userId); // 사용자 ID 저장
      navigate("/chat"); // 채팅 페이지로 이동
    } else {
      alert("로그인 정보를 찾을 수 없습니다. 관리자에게 문의하세요!"); // 경고 메시지
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Typography variant="h4" marginBottom={4}>
        FastAPI Chat Login
      </Typography>
      <TextField
        label="User ID"
        variant="outlined"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        fullWidth
        sx={{ maxWidth: 400, marginBottom: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        로그인
      </Button>
    </Box>
  );
}

export default Home;
