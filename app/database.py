import json

from sqlalchemy import Column, MetaData, Table, create_engine, Text, TIMESTAMP, func
from app.config import get_settings

config = get_settings()

pg_username = config.PG_USER
pg_password = config.PG_PASSWORD
pg_port = config.PG_PORT
pg_db = config.PG_DB

DATABASE_URL = f"postgresql+psycopg2://{pg_username}:{pg_password}@localhost:{pg_port}/{pg_db}"

engine = create_engine(DATABASE_URL, echo=True)
metadata = MetaData()

chat_info = Table("chat_info", metadata, autoload_with=engine)

def insert_chat(user_id: str, chat_id: str, messages: list[dict]):
    with engine.connect() as conn:
        existing_user = conn.execute(chat_info.select().where(chat_info.c.user_id == user_id)).fetchone()
        if existing_user:
            print(f"Error: user_id '{user_id}' already exists!")
            return

        # messages를 JSON 문자열로 변환
        messages_str = json.dumps(messages)  # 리스트를 문자열로 변환
        insert_query = chat_info.insert().values(
            user_id=user_id,
            chat_id=chat_id,
            messages=messages_str
        )
        conn.execute(insert_query)
        conn.commit()
        print("데이터가 삽입되었습니다!")

# 데이터 조회 함수
def get_chats():
    with engine.connect() as conn:
        select_query = chat_info.select()
        result = conn.execute(select_query)

        for row in result:
            messages = json.loads(row.messages)
            print(f"User ID: {row.user_id}, Chat ID: {row.chat_id}, Messages: {messages}, Created At: {row.created_at}")


# 실행
if __name__ == "__main__":
    insert_chat("test_user_id", "test_chat_id2", [{"role": "user", "message": "안녕하세요!"}, {"role": "assistant", "message": "안녕하세요, 무엇을 도와드릴까요?"}])
    get_chats()