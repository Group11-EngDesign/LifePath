import requests
from config import credentials


URL = "https://api.openai.com/v1/chat/completions"

payload = {
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": f"How many pictures do I have from 2015?"}],
    "temperature" : 1.0,
    "top_p":1.0,
    "n" : 1,
    "stream": True,
    "presence_penalty":0,
    "frequency_penalty":0,
}

headers = {
"Content-Type": "application/json",
"Authorization": f"Bearer {credentials.GPT3_API_KEY}"
}

response = requests.post(URL, headers=headers, json=payload, stream=True)

print(response.content)
