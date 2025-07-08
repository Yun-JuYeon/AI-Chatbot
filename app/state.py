from typing import Dict, List
from pydantic import BaseModel


class messageState(BaseModel):
    user_id: str
    chat_id: str

    messages: List[Dict] = []
