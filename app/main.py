import json
from re import L
import uuid
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.chat_llm import chat_gemini
from app.database import get_all_chats, get_chats, get_user, upsert_chat
from app.schema import chatHistoryDetailsResponse, chatInfoResponse, userInfoResponse
from app.state import messageState

app = FastAPI(openapi_url="/openapi.json")
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

@app.get("/login")
async def get_user_id(user_id: str):
    user = get_user(user_id=user_id)

    if user:
        user_id = user.user_id
        user_name = user.user_name
    else:
        raise HTTPException(
            status_code=401,
            detail=f"ID {user_id}는 존재하지 않습니다. 관리자에게 문의하세요."
        )
    
    return userInfoResponse(
        user_id = user_id,
        user_name = user_name
    )

@app.get("/new_chat")
async def new_chatting(user_id: str):
    
    return chatInfoResponse(
        user_id = user_id,
        chat_id = uuid.uuid4()
    )


@app.get("/chat_history")
async def all_chat_history(user_id: str):
    chat_list = get_all_chats(user_id)
    return chat_list


@app.get("/chat_details")
async def chat_details(user_id: str, chat_id: str):
    rows = get_chats(user_id=user_id, chat_id=chat_id)
    messages = json.loads(rows.messages)
    
    return chatHistoryDetailsResponse(
        user_id = user_id,
        chat_id = chat_id,
        messages = messages 
    )


@app.post("/chat_gemini")
async def chat_with_gemini(chat_id: str, user_id: str, user_message: str):
    search_db = get_chats(user_id=user_id, chat_id=chat_id)
    #print(search_db)

    if search_db:
        state = messageState(chat_id=search_db.chat_id, user_id=search_db.user_id, messages=search_db.messages)
    else:
        state = messageState(chat_id=chat_id, user_id=user_id)

    chat_gemini(state, user_message)
    upsert_chat(user_id=user_id, chat_id=chat_id, messages=state.messages)

    return state



if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0")