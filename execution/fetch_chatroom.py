import os
from supabase import create_client

url = "https://lkwydqtfbdjhxaarelaz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd3lkcXRmYmRqaHhhYXJlbGF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDI5ODI4MiwiZXhwIjoyMDg1ODc0MjgyfQ.35gJkeetflYO5FYXrjELwikxqFvcScxFCQr5qDD-Z24"
supabase = create_client(url, key)

try:
    response = supabase.table("chatroom").select("*").order("created_at", desc=True).limit(10).execute()
    messages = response.data
    
    with open('tmp_chatroom_logs.txt', 'w', encoding='utf-8') as f:
        f.write(f"Total messages fetched: {len(messages)}\n")
        for msg in messages:
            f.write(f"[{msg.get('created_at')}] {msg.get('agent_id')} -> {msg.get('message_type')}\n")
            f.write(f"{str(msg.get('message'))[:200]}...\n")
            f.write("-" * 80 + "\n")
except Exception as e:
    print(f"Error: {e}")
