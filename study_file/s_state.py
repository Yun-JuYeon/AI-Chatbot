from pydantic import BaseModel


class SState(BaseModel):
    name: str = ""
    age: int = 0
