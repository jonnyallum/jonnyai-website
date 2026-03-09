import re
import os

def generate_roster():
    registry_path = '.agent/AGENT_REGISTRY.md'
    roster_path = '.agent/TEAM_ROSTER.md'
    
    if not os.path.exists(registry_path):
        print(f"❌ Registry not found")
        return

    with open(registry_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract agents from the "Completed Agents" table
    agents_match = re.search(r'## ✅ Completed Agents.*?\| :---.*?\|\n(.*?)\n---', content, re.DOTALL)
    if not agents_match:
        print("❌ Could not find Completed Agents table")
        return
        
    rows = agents_match.group(1).splitlines()
    agent_list = []
    for row in rows:
        if row.startswith('| @'):
            parts = [p.strip() for p in row.split('|')]
            if len(parts) >= 5:
                agent_list.append({
                    "handle": parts[1],
                    "name": parts[2],
                    "nickname": parts[3],
                    "tier": parts[4]
                })

    # Read existing TEAM_ROSTER.md to preserve HoF and Personalities
    with open(roster_path, 'r', encoding='utf-8') as f:
        roster_content = f.read()

    # Replace the "🎯 The Orchestra" section
    table_header = "| Agent | Human Name | Nickname | Role |\n| :--- | :--- | :--- | :--- |\n"
    table_body = ""
    for a in agent_list:
        table_body += f"| **{a['handle']}** | {a['name']} | {a['nickname']} | {a['tier']} |\n"
    
    new_orchestra_section = f"## 🎯 The Orchestra\n\n{table_header}{table_body}"
    
    # Precise replacement using regex to find the section between "## 🎯 The Orchestra" and the NEXT "---"
    updated_content = re.sub(r'## 🎯 The Orchestra.*?---', new_orchestra_section + "\n\n---", roster_content, flags=re.DOTALL)
    
    with open(roster_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print(f"✅ Updated TEAM_ROSTER.md with {len(agent_list)} agents")

if __name__ == "__main__":
    generate_roster()
