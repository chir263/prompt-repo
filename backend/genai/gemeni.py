import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv('GEMENI_API')

genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel('gemini-pro')



def generate_response(message):
    chat = model.start_chat()
    response = chat.send_message(message)
    return {
        'result': response.text,
    }
