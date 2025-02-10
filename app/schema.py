import uuid

from pydantic import BaseModel, Field


class infoResponse(BaseModel):
    user_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    chat_id: uuid.UUID = Field(default_factory=uuid.uuid4)