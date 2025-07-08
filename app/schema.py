import uuid

from pydantic import BaseModel, Field


class userInfoResponse(BaseModel):
    user_id: str
    user_name: str


class chatInfoResponse(BaseModel):
    user_id: str
    chat_id: uuid.UUID = Field(default_factory=uuid.uuid4)


class getChatDBResponse(BaseModel):
    user_id: str
    chat_id: str
    messages: list[dict] = []


class allChatHistoryResponse(BaseModel):
    user_id: str
    chat_id: list[str] = []


class chatHistoryDetailsResponse(BaseModel):
    user_id: str
    chat_id: str
    messages: list[dict] = []


class ChatRequest(BaseModel):
    chat_id: str
    user_id: str
    user_message: str
