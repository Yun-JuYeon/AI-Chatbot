import asyncio
import time
import google.generativeai as genai

from app.config import get_settings
from app.state import messageState

config = get_settings()
GEMINI_API_KEY = config.GEMINI_KEY

async def chat_gemini(state: messageState, user_message: str):
    genai.configure(api_key=GEMINI_API_KEY)

    model = genai.GenerativeModel('gemini-1.5-flash')

    state.messages.append(
        {'role': 'user',
        'parts': [user_message]}
    )

    response = model.generate_content(state.messages, stream=True)
    full_response = ""

    for chunk in response:  
        text = chunk.text.strip() if chunk.text else ""
        if text:
            full_response += text
            yield f"data: {text}\n\n" 
        await asyncio.sleep(0.1)

    if full_response:    
        state.messages.append({'role': 'model', 'parts': [full_response]}) 
    

    #print(f"history: {state.messages}")

    