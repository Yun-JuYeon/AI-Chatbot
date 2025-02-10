from turtle import st
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
