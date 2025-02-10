from typing import Dict, List
import uuid
from pydantic import BaseModel


class messageState(BaseModel):
    user_id: str
    chat_id: uuid.UUID
    
    messages: List[Dict] = []