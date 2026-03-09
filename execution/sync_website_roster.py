import re
import os

def sync_roster():
    registry_path = '.agent/AGENT_REGISTRY.md'
    output_path = 'Clients/jonnyai.website/lib/data/agents.ts'
    
    if not os.path.exists(registry_path):
        print(f"❌ Registry not found at {registry_path}")
        return

    with open(registry_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Process line by line to avoid crossing row boundaries
    agents = []
    for line in content.splitlines():
        if line.startswith('| @'):
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 5:
                handle = parts[1]
                name = parts[2]
                nickname = parts[3]
                tier = parts[4]
                agents.append({
                    "handle": handle,
                    "name": name,
                    "nickname": nickname,
                    "role": f"{nickname} — {tier}",
                    "tier": tier.split('&')[0].strip()
                })

    # Generate TypeScript content
    ts_content = """export type AgentTier = 
  | "Command" 
  | "Development" 
  | "Design" 
  | "Growth" 
  | "Intelligence" 
  | "Operations" 
  | "Legal" 
  | "Specialized" 
  | "Quality" 
  | "Betting"
  | "Strategy"
  | "Education"
  | "Management"
  | "Additional";

export interface Agent {
  handle: string;
  name: string;
  nickname: string;
  role: string;
  tier: string;
  philosophy?: string;
}

export const agents: Agent[] = [
"""
    
    for agent in agents:
        ts_content += f'  {{ handle: "{agent["handle"]}", name: "{agent["name"]}", nickname: "{agent["nickname"]}", role: "{agent["role"]}", tier: "{agent["tier"]}" }},\n'

    ts_content += "];\n"

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"✅ Website roster synced: {len(agents)} agents pushed to {output_path}")

if __name__ == "__main__":
    sync_roster()
