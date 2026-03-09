
import re
import os
import json
from datetime import datetime

# Paths
TEAM_ROSTER_PATH = "c:/Users/jonny/Desktop/AgOS 3.0 template/.agent/TEAM_ROSTER.md"
NEWS_PATH = "c:/Users/jonny/Desktop/AgOS 3.0 template/.agent/NEWS.md"
WEBSITE_DATA_DIR = "c:/Users/jonny/Desktop/AgOS 3.0 template/Clients/jonnyai.website/src/data"

def parse_roster():
    print(f"Parsing {TEAM_ROSTER_PATH}...")
    with open(TEAM_ROSTER_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Parse the Orchestra table
    orchestra_match = re.search(r"## 🎯 The Orchestra\n\n\| Agent \| Human Name \| Nickname \| Role \|\n\| :--- \| :--- \| :--- \| :--- \|\n(.*?)\n\n---", content, re.DOTALL)
    if not orchestra_match:
        print("Could not find Orchestra table.")
        return []
    
    rows = orchestra_match.group(1).strip().split('\n')
    agents = []
    
    for row in rows:
        cols = [c.strip() for c in row.split('|') if c.strip()]
        if len(cols) < 4: continue
        
        handle = cols[0].replace('**', '').lower().replace(' ', '')
        # Special case mapping
        if handle == 'jonnyai': handle = 'jonny'
        
        agent = {
            "id": handle,
            "name": cols[0].replace('**', ''),
            "humanName": cols[1],
            "nickname": cols[2].replace('"', ''),
            "role": cols[3],
            "featured": False,
            "color": "#8b5cf6", # Default purple
            "capabilities": [],
            "personality": []
        }
        
        # Determine Tier
        if handle in ['marcus', 'arthur']: agent['tier'] = 'orchestration'
        elif handle in ['jonny', 'priya', 'sam', 'diana', 'victor', 'derek']: agent['tier'] = 'development'
        elif handle in ['felix', 'grace', 'elena', 'carlos', 'maya', 'hannah']: agent['tier'] = 'business'
        elif handle in ['sophie', 'patrick']: agent['tier'] = 'research'
        elif handle in ['alex', 'mason', 'adrian', 'owen']: agent['tier'] = 'deployment'
        else: agent['tier'] = 'support'
        
        # Color Mapping
        colors = {
            'marcus': '#8b5cf6', 'sebastian': '#3b82f6', 'priya': '#ec4899',
            'sam': '#ef4444', 'derek': '#0ea5e9', 'diana': '#4f46e5',
            'felix': '#eab308', 'grace': '#22c55e', 'elena': '#f43f5e',
            'owen': '#f97316', 'milo': '#06b6d4'
        }
        agent['color'] = colors.get(handle, '#8b5cf6')
        
        # Avatar check
        avatar_path = f"c:/Users/jonny/Desktop/AgOS 3.0 template/Clients/jonnyai.website/public/agents/{handle}.png"
        if os.path.exists(avatar_path):
            agent['avatar'] = f"/agents/{handle}.png"
            
        agents.append(agent)

    # 2. Parse Personalities and Philosophies
    personality_section = re.findall(r"### (.*?) \(.*?\)\n> \*\"(.*?)\"\*\n\n\*\*Vibe:\*\* (.*?)\.", content, re.DOTALL)
    for p_name, philosophy, vibe in personality_section:
        p_id = p_name.split()[0].lower()
        if p_id == 'jonny': p_id = 'jonny' # matches
        
        for agent in agents:
            if agent['id'] == p_id:
                agent['philosophy'] = philosophy
                agent['personality'] = [vile_part.strip() for vile_part in vibe.split(',')]
                agent['featured'] = True
                break

    return agents

def parse_news():
    if not os.path.exists(NEWS_PATH):
        # Create a default NEWS.md if it doesn't exist
        with open(NEWS_PATH, 'w') as f:
            f.write("# Agency News\n\n- **2026-02-05**: Jai.OS 5.0 successfully deployed across the entire orchestra.\n")
    
    with open(NEWS_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    news_items = []
    for line in lines:
        match = re.search(r"- \*\*(.*?)\*\*: (.*)", line)
        if match:
            news_items.append({
                "date": match.group(1),
                "message": match.group(2)
            })
    
    return news_items

def sync_to_website():
    agents = parse_roster()
    news = parse_news()
    
    # 1. Update agents.ts
    agents_ts_content = "export interface Agent {\n  id: string;\n  name: string;\n  humanName: string;\n  nickname: string;\n  role: string;\n  philosophy?: string;\n  capabilities: string[];\n  personality: string[];\n  tier: 'orchestration' | 'development' | 'deployment' | 'business' | 'research' | 'support';\n  featured: boolean;\n  avatar?: string;\n  color: string;\n}\n\n"
    agents_ts_content += f"export const agents: Agent[] = {json.dumps(agents, indent=2)};"
    
    with open(os.path.join(WEBSITE_DATA_DIR, "agents.ts"), 'w') as f:
        f.write(agents_ts_content)
    print("Updated agents.ts")

    # 2. Update news.ts
    news_ts_content = f"export const news = {json.dumps(news, indent=2)};"
    with open(os.path.join(WEBSITE_DATA_DIR, "news.ts"), 'w', encoding='utf-8') as f:
        f.write(news_ts_content)
    print("Updated news.ts")

if __name__ == "__main__":
    sync_to_website()
