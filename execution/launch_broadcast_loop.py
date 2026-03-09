"""
Antigravity Phase 3 Launcher
Starts the webhook receiver + ngrok tunnel in parallel, prints the Supabase setup URL.
Run: python execution/launch_broadcast_loop.py
"""

import subprocess
import threading
import time
import sys
import os
import json
import requests
from pathlib import Path

ROOT = Path(r"C:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0")
NGROK_BIN = ROOT / "execution" / "tools" / "ngrok.exe"
PORT = 5001
STATIC_DOMAIN = "nonpenetrably-uncatering-rebbeca.ngrok-free.dev"  # Permanent free dev domain

def start_webhook_server():
    """Launch Flask webhook receiver in subprocess."""
    print("🚀 Starting webhook receiver on :5001...")
    python = sys.executable
    script = ROOT / "execution" / "webhook_receiver.py"
    subprocess.run([python, str(script)], cwd=str(ROOT))


def wait_for_ngrok_url(retries=15) -> str:
    """Poll ngrok local API to get the public HTTPS URL."""
    for i in range(retries):
        time.sleep(2)
        try:
            r = requests.get("http://localhost:4040/api/tunnels", timeout=3)
            tunnels = r.json().get("tunnels", [])
            for t in tunnels:
                if t.get("proto") == "https":
                    return t["public_url"]
        except Exception:
            pass
        print(f"  ⏳ Waiting for ngrok ({i+1}/{retries})...")
    return None


def start_ngrok():
    """Start ngrok tunnel and return the public URL."""
    print(f"🌐 Starting ngrok tunnel for port {PORT}...")
    proc = subprocess.Popen(
        [str(NGROK_BIN), "http", f"--url={STATIC_DOMAIN}", str(PORT)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    url = wait_for_ngrok_url()
    return url, proc


if __name__ == "__main__":
    # Start Flask in background thread
    server_thread = threading.Thread(target=start_webhook_server, daemon=True)
    server_thread.start()
    time.sleep(2)  # Let Flask boot

    # Start ngrok
    ngrok_url, ngrok_proc = start_ngrok()

    if not ngrok_url:
        print("❌ ngrok failed to start. Run manually:")
        print(f"   {NGROK_BIN} http {PORT}")
        sys.exit(1)

    webhook_url = f"{ngrok_url}/webhook/chatroom"
    test_url = f"{ngrok_url}/webhook/test"

    print(f"""
╔══════════════════════════════════════════════════════════════════╗
║  🎯 PHASE 3 BROADCAST LOOP — ONLINE                             ║
╠══════════════════════════════════════════════════════════════════╣
║  Ngrok URL:    {ngrok_url:<50}║
║  Webhook:      {webhook_url:<50}║
╠══════════════════════════════════════════════════════════════════╣
║  SUPABASE SETUP (do this once):                                  ║
║                                                                  ║
║  1. Go to: Supabase Dashboard → Database → Webhooks              ║
║  2. Create webhook:                                              ║
║     Name: antigravity_social_broadcast                           ║
║     Table: chatroom                                              ║
║     Events: INSERT                                               ║
║     URL: {webhook_url:<57}║
║     Method: POST                                                 ║
║     Headers: Content-Type: application/json                      ║
║                                                                  ║
║  3. Test it:                                                     ║
║     POST {test_url:<58}║
║     Body: {{"message": "[MILESTONE] Test!", "agent": "marcus"}}  ║
╠══════════════════════════════════════════════════════════════════╣
║  Loop: Chatroom INSERT → Supabase → Ngrok → Flask → FB + IG     ║
║  Lag: < 5 seconds from chatroom post to live social             ║
╚══════════════════════════════════════════════════════════════════╝
""")

    # Write URL to .tmp for reference
    url_file = ROOT / ".tmp" / "ngrok_webhook_url.txt"
    url_file.write_text(f"{webhook_url}\n{test_url}\n", encoding="utf-8")
    print(f"📄 URLs saved to .tmp/ngrok_webhook_url.txt")
    print("   Press Ctrl+C to stop.\n")

    # Keep alive
    try:
        server_thread.join()
    except KeyboardInterrupt:
        print("\n🛑 Broadcast loop stopped.")
        ngrok_proc.terminate()
