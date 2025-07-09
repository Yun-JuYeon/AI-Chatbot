from pydantic import BaseModel, AnyUrl, EmailStr, HttpUrl, PostgresDsn


class Item(BaseModel):
    name: str
    url: AnyUrl     # URL 문자열 검증. HTTP, FTP등 구분 안함.
    email: EmailStr
    httpurl: HttpUrl    # Http, Https 검증
    db: PostgresDsn


try:
    item = Item(
        name="예시사이트", 
        url="http://www.example.com", 
        email="example@ex.com",
        httpurl="https://example.com",
        db="postgresql://user:password@localhost/dbname"
    )
    print(item)

except Exception as e:
    print(f"error: {e}")
