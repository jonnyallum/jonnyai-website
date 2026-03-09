import requests
import json

ELEVENLABS_API_KEY = "sk_1f8b04ee135d89ed7a60323f403e037d7770fa6e3e9cea83"

def list_voices():
    url = "https://api.elevenlabs.io/v1/voices"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        voices = response.json().get("voices", [])
        for v in voices:
            print(f"{v['name']}: {v['voice_id']}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    list_voices()
