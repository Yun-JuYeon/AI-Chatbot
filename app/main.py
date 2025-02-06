import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings

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

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0")