import re
import json
from pathlib import Path

ROOT_DIR = Path("c:/Users/jonny/Desktop/JonnyAI_JaiOS_5.0")
ROSTER_PATH = ROOT_DIR / ".agent" / "TEAM_ROSTER.md"
SKILLS_DIR = ROOT_DIR / ".agent" / "skills"

def extract_from_roster():
    content = ROSTER_PATH.read_text(encoding='utf-8')
    roster_data = {}
    
    # scan for any pipe table rows
    for line in content.split('\n'):
        if '|' in line and '---' not in line:
            cols = [c.strip() for c in line.split('|') if c.strip()]
            
            # Check for the main roster row: | **Agent** | Name | Nickname | Role |
            # Handles like **Conductor**, **Jonny AI**, etc.
            if len(cols) >= 4 and '**' in cols[0] and 'Agent' not in cols[0]:
                handle = cols[0].replace('**', '').lower().replace(' ', '-').replace('@', '')
                handle = re.sub(r'[^\w\-]', '', handle)
                
                if handle and handle not in roster_data:
                    roster_data[handle] = {
                        "human_name": cols[1],
                        "nickname": cols[2].replace('"', ''),
                        "role": cols[3]
                    }
            
            # Check for Hall of Fame row: | Emoji | **Name** | Quote |
            # These sometimes have the handle in bold too
            elif len(cols) >= 3 and '**' in cols[1] and 'Name' not in cols[1]:
                # We can't easily get the role here, but we can verify the handle exists
                pass

    return roster_data

def get_agent_skills(handle):
    skill_file = SKILLS_DIR / handle / "SKILL.md"
    if not skill_file.exists():
        return []
    
    content = skill_file.read_text(encoding='utf-8')
    # Extract from Capabilities section
    cap_match = re.search(r'## Capabilities\s*\n\s*\n### Can Do ✅\n(.*?)\n###', content, re.DOTALL)
    if not cap_match:
        return []
    
    skills = []
    lines = cap_match.group(1).strip().split('\n')
    for line in lines:
        if line.startswith('- '):
            skills.append(line[2:].split(':')[0].strip().lower())
    return skills[:5]

def generate_dynamic_roster():
    roster = extract_from_roster()
    final_roster = {}
    for handle, data in roster.items():
        skills = get_agent_skills(handle)
        final_roster[handle] = {
            "human_name": data["human_name"],
            "nickname": data["nickname"],
            "role": data["role"],
            "skills": skills,
            "summon_prompt": f"You are now operating as @{handle.upper()} ({data['nickname']}). Your role is {data['role']}. Execute with precision."
        }
    return final_roster

if __name__ == "__main__":
    dynamic_roster = generate_dynamic_roster()
    with open(ROOT_DIR / "execution" / "agent_roster_data.json", 'w', encoding='utf-8') as f:
        json.dump(dynamic_roster, f, indent=2)
    print(f"Generated dynamic roster for {len(dynamic_roster)} agents.")
