import requests
import os
from datetime import datetime, timedelta

def get_env(key):
    env_path = "c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.env"
    if not os.path.exists(env_path):
        return None
    with open(env_path, "r", encoding="utf-8-sig", errors="ignore") as f:
        for line in f:
            line = line.strip()
            if line.startswith(f"{key}="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None

def fetch_report():
    brain_url = "https://lkwydqtfbdjhxaarelaz.supabase.co"
    brain_key = get_env("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY")
    
    headers = {
        "apikey": brain_key,
        "Authorization": f"Bearer {brain_key}"
    }
    
    # Last 5 days
    since = (datetime.now() - timedelta(days=5)).isoformat()
    
    print(f"Fetching dreamer ideas since {since}...")
    resp = requests.get(
        f"{brain_url}/rest/v1/chatroom?agent_id=eq.dreamer&created_at=gte.{since}&order=created_at.desc",
        headers=headers
    )
    
    if resp.status_code != 200:
        return f"Error fetching from Supabase: {resp.status_code} {resp.text}"
        
    messages = resp.json()
    
    report = "# 🍖 @dreamer 5-Day Empire Feed Report\n\n"
    report += f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}\n\n---\n\n"
    
    current_date = ""
    for msg in messages:
        ts = msg['created_at'][:10]
        content = msg['message']
        
        # Skip repetitive "analysis complete" footers if redundant
        if "DAILY EMPIRE FEED READY" in content and len(content) < 300:
            continue
            
        if ts != current_date:
            report += f"## 📅 {ts}\n\n"
            current_date = ts
            
        report += content + "\n\n---\n\n"
        
    return report

if __name__ == "__main__":
    report_md = fetch_report()
    with open("dreamer_5day_report.md", "w", encoding="utf-8") as f:
        f.write(report_md)
    print("Report generated: dreamer_5day_report.md")
