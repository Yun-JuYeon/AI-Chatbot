import uuid

from pydantic import BaseModel


class infoResponse(BaseModel):
    user_id: uuid.UUID
    chat_id: uuid.UUID