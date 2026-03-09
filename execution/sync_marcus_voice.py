import os
import requests
import json
from pathlib import Path

# --- Configuration ---
AGENT_ID = "agent_0201kjx5r9tbfcy8tta4we659rsp"
ELEVENLABS_API_KEY = "sk_1f8b04ee135d89ed7a60323f403e037d7770fa6e3e9cea83"
SKILL_PATH = Path(r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\.agent\skills\marcus\SKILL.md")
PERSONA_PATH = Path(r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\.agent\skills\marcus\PERSONA.md")

def get_marcus_configs():
    prompt = ""
    voice_id = "ytcsltLTtCHxNn1vC76H" # Default/User Provided
    
    if PERSONA_PATH.exists():
        with open(PERSONA_PATH, "r", encoding="utf-8") as f:
            persona_content = f.read()
            # Find FourteenLabs system prompt
            if "```" in persona_content:
                parts = persona_content.split("```")
                # Usually it's in a code block
                if len(parts) >= 2:
                    prompt = parts[1].strip()
    
    # Fallback to SKILL.md for more context if prompt block is missing or too short
    if not prompt and SKILL_PATH.exists():
        with open(SKILL_PATH, "r", encoding="utf-8") as f:
            content = f.read()
            prompt = content[content.find("## Personality"):content.find("## Capabilities")].strip()

    return prompt, voice_id

def sync_to_elevenlabs():
    prompt, voice_id = get_marcus_configs()
    print(f"🚀 Syncing Marcus personality to ElevenLabs agent: {AGENT_ID}")
    print(f"🔊 Setting Voice ID: {voice_id}")
    
    url = f"https://api.elevenlabs.io/v1/convai/agents/{AGENT_ID}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {
        "conversation_config": {
            "agent": {
                "prompt": {
                    "prompt": prompt
                },
                "first_message": "Maestro online. Jonny, the Orchestra is ready. What's our next mission?",
            },
            "tts": {
                "voice_id": voice_id
            }
        }
    }
    
    response = requests.patch(url, headers=headers, json=payload)
    if response.status_code == 200:
        print("✅ Marcus Sync Complete (Voice + Personality)")
    else:
        print(f"❌ Error Syncing: {response.status_code} - {response.text}")
if __name__ == "__main__":
    sync_to_elevenlabs()
