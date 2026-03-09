import requests
import json

ELEVENLABS_API_KEY = "sk_1f8b04ee135d89ed7a60323f403e037d7770fa6e3e9cea83"
AGENT_ID = "agent_0201kjx5r9tbfcy8tta4we659rsp"

def get_agent():
    # Attempting to get agent info to see current voice and config
    url = f"https://api.elevenlabs.io/v1/convai/agents/{AGENT_ID}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(f"Agent Name: {data.get('agent_name')}")
        print(f"Agent ID: {data.get('agent_id')}")
        config = data.get('conversation_config', {})
        print(f"Voice ID: {config.get('tts', {}).get('voice_id')}")
        print(f"Prompt: {config.get('agent', {}).get('prompt', {}).get('prompt')[:500]}...")
    else:
        print(f"Error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    get_agent()
