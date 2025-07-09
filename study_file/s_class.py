from typing import Optional
from openai import BaseModel
from pydantic import field_validator

"""
field_validator: "link" 이렇게 지정한 값을 검증함.
        mode=after가 기본값이며, 기본적으로 pydantic이 변형 후 검증하지만 before로 하면 그 전에 실행됨. 
classmethod: 클래스 자체로 호출할 수 있게 해줌.
"""


class MakeLink(BaseModel):
    link: str

    @field_validator("link", mode="before")
    @classmethod
    def make_link(cls, value):
        if value is None:
            return None

        if not isinstance(value, str):
            raise ValueError("link는 str 타입이여야 합니다.")

        if not value.startswith("https://"):
            return "https://" + value

        return value


if __name__ == "__main__":
    link1 = MakeLink.make_link("testlinktestlink.com")
    link2 = MakeLink.make_link("https://testlink2.com")
    link3 = MakeLink.make_link(None)

    print("link1: ", link1)
    print("link2: ", link2)
    print("link3: ", link3)
