import json

from sqlalchemy import MetaData, Table, create_engine, func
from app.config import get_settings
from app.schema import allChatHistoryResponse, getChatDBResponse, userInfoResponse

config = get_settings()

pg_username = config.PG_USER
pg_password = config.PG_PASSWORD
pg_port = config.PG_PORT
pg_db = config.PG_DB

DATABASE_URL = f"postgresql+psycopg2://{pg_username}:{pg_password}@localhost:{pg_port}/{pg_db}"

engine = create_engine(DATABASE_URL, echo=False)  # echo는 추가적인 로그를 자동으로 찍어줌(True 일 경우)
metadata = MetaData()

chat_info = Table("chat_info", metadata, autoload_with=engine)
user_info = Table("user_info", metadata, autoload_with=engine)

# 데이터 삽입, 수정
def upsert_chat(user_id: str, chat_id: str, messages: list[dict]):
    with engine.connect() as conn:
        messages_str = json.dumps(messages)

        existing_chat = conn.execute(chat_info.select().where(chat_info.c.chat_id == chat_id)).fetchone()
        if existing_chat:
            update_query = (
                chat_info.update()
                .where(chat_info.c.chat_id == chat_id)
                .values(messages=messages_str,
                        created_at=func.now())
            )
            conn.execute(update_query)
            conn.commit()
            print(f"기존 chat_id '{chat_id}'의 messages가 업데이트되었습니다!")
        else:
            # 새로운 행 삽입
            insert_query = chat_info.insert().values(
                user_id=user_id,
                chat_id=chat_id,
                messages=messages_str
            )
            conn.execute(insert_query)
            conn.commit()
            print("새로운 데이터가 삽입되었습니다!")


# user_info 테이블에서 사용자 확인
def get_user(user_id: str):
    with engine.connect() as conn:
        select_user_query = user_info.select().where(
            user_info.c.user_id==user_id,
        )

        get_user = conn.execute(select_user_query)
        rows = get_user.first()

        if rows:
            print(f"로그인 사용자 ID: {rows.user_id}")
            print(f"로그인 사용자 이름: {rows.user_name}")

        return rows

# 데이터 조회
def get_chats(user_id: str, chat_id: str):
    with engine.connect() as conn:
        select_query = chat_info.select().where(
            chat_info.c.user_id==user_id,
            chat_info.c.chat_id==chat_id
        )
        result = conn.execute(select_query)
        rows = result.first()

        if not rows:
            print("DB에 데이터가 없습니다")
            return None

        # messages = json.loads(rows.messages)

        # print(messages)

        return rows

# 해당 유저 전체 chatting 내역
def get_all_chats(user_id: str):
    with engine.connect() as conn:
        select_query = chat_info.select().where(
            chat_info.c.user_id==user_id
        )
        result = conn.execute(select_query)
        rows = result.fetchall()
        
        chat_id = []
        for row in rows:
            chat_id.append(row.chat_id)

        print(chat_id)

        return allChatHistoryResponse(
            user_id=user_id,
            chat_id=chat_id
        )


# 실행
if __name__ == "__main__":
    upsert_chat("test_user_id", "test_chat_id3", [{"role": "user", "parts": ["채팅테스트!"]}, {"role": "assistant", "parts": ["안녕하세요, 무엇을 도와드릴까요?"]}])
    # get_chats("wndus01", "test_chat_id2")
    # get_all_chats("test_user_id")