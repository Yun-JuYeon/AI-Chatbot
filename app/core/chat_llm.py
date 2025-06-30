import google.generativeai as genai

from app.config import get_settings
from app.state import messageState

config = get_settings()
GEMINI_API_KEY = config.GEMINI_KEY

def chat_gemini(state: messageState, user_message):
    genai.configure(api_key=GEMINI_API_KEY)

    model = genai.GenerativeModel('gemini-1.5-flash')

    # user_message = "대한민국의 대통령 역사를 설명해줘"
    state.messages.append(
        {'role': 'user',
        'parts': [user_message]}
    )

    response = model.generate_content(state.messages, stream=True)

    for chunk in response:
        print(chunk.text)

    state.messages.append(
        {'role':'model',
        'parts':[response.text]}
    )

    print(f"history: {state.messages}")

    return response.text


if __name__ == "__main__":
    chat_gemini(state=messageState(), user_message="넌 누구냐?")
