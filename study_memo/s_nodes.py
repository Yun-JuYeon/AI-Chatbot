from study_memo.s_state import SState
from langchain_openai import ChatOpenAI

async def add_name(state: SState) -> SState:
    state.name = "윤주연"
    return state

async def add_age(state: SState) -> SState:
    state.age = 25
    return state
