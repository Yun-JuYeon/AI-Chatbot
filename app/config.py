from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENAPI_KEY: str
    GEMINI_KEY: str

    PG_PORT: str
    PG_DB: str
    PG_USER: str
    PG_PASSWORD: str

    class Config:
        env_file = ".env"

@lru_cache
def get_settings():
    return Settings()
