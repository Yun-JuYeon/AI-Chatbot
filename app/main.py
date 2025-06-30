import uuid
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.core.chat_llm import chat_gemini
from app.schema import infoResponse
from app.state import messageState

app = FastAPI()
config = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins={"*"},
    allow_credentials=True,
    allow_methods={"OPTIONS", "GET", "POST"},
    allow_headers={"*"},
)

@app.get("/")
async def read_root():
    return "OK"

@app.get("/start_chat")
async def get_id():
    user_id = uuid.UUID()
    chat_id = uuid.UUID()

    return infoResponse(
        user_id=user_id,
        chat_id=chat_id
    )

@app.post("/chat_gemini")
async def chat_with_gemini(chat_id: str, user_message: str):
    state = messageState(chat_id=chat_id)

    response = chat_gemini(state, user_message)

    return response

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0")