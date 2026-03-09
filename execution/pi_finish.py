#!/usr/bin/env python3
"""pi_finish.py — Write .env to Pi, get Tailscale auth URL, create task_queue in Supabase."""
import sys, json, uuid, threading, queue as Q, urllib.request, os
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from dotenv import dotenv_values

PI_BASE = "http://192.168.1.64:8747"

# ── Pi MCP client (minimal) ──────────────────────────────────────────────────
class PiMCP:
    def __init__(self):
        self.conn = None; self.session_url = None; self.results = {}; self._lock = threading.Lock()
    def connect(self):
        self.conn = urllib.request.urlopen(f"{PI_BASE}/sse", timeout=15)
        for _ in range(30):
            line = self.conn.readline().decode().strip()
            if line.startswith("data:"):
                self.session_url = f"{PI_BASE}{line[5:].strip()}"; break
        if not self.session_url: raise RuntimeError("No session URL")
        threading.Thread(target=self._read_sse, daemon=True).start()
        self._send_wait({"jsonrpc":"2.0","id":"init","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"pi-finish","version":"1.0"}}}, 10)
        self._post({"jsonrpc":"2.0","method":"notifications/initialized"})
    def _read_sse(self):
        while True:
            try:
                line = self.conn.readline()
                if not line: break
                line = line.decode().strip()
                if line.startswith("data:"):
                    try:
                        msg = json.loads(line[5:].strip())
                        mid = msg.get("id")
                        if mid:
                            with self._lock:
                                if mid in self.results: self.results[mid].put(msg)
                    except: pass
            except: break
    def _post(self, p):
        req = urllib.request.Request(self.session_url, data=json.dumps(p).encode(), headers={"Content-Type":"application/json"}, method="POST")
        urllib.request.urlopen(req, timeout=10).close()
    def _send_wait(self, p, timeout=30):
        mid = p.get("id"); q = Q.Queue()
        with self._lock: self.results[mid] = q
        self._post(p)
        try: return q.get(timeout=timeout)
        except Q.Empty: return {"error":f"Timeout {mid}"}
        finally:
            with self._lock: self.results.pop(mid, None)
    def shell(self, cmd, timeout=60):
        cid = f"s-{uuid.uuid4().hex[:6]}"
        resp = self._send_wait({"jsonrpc":"2.0","id":cid,"method":"tools/call","params":{"name":"run_shell","arguments":{"command":cmd,"timeout_sec":timeout}}}, timeout+5)
        content = resp.get("result",{}).get("content",[])
        if content:
            try: d = json.loads(content[0].get("text","{}"))
            except: return content[0].get("text","")
            return d.get("stdout","") + d.get("stderr","")
        return str(resp)
    def write_file(self, path, content):
        cid = f"w-{uuid.uuid4().hex[:6]}"
        resp = self._send_wait({"jsonrpc":"2.0","id":cid,"method":"tools/call","params":{"name":"write_file","arguments":{"path":path,"content":content}}}, 15)
        content_list = resp.get("result",{}).get("content",[])
        if content_list:
            try: return json.loads(content_list[0].get("text","{}")).get("success","?")
            except: return content_list[0].get("text","")
        return "?"
    def close(self):
        try: self.conn.close()
        except: pass


def create_task_queue_in_supabase():
    """Create task_queue table via Supabase REST (run SQL via pg function)."""
    env = dotenv_values("c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.env")
    brain_url = env.get("ANTIGRAVITY_BRAIN_URL","")
    brain_key = env.get("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY","")

    # Check if table exists
    req = urllib.request.Request(
        brain_url + "/rest/v1/task_queue?limit=1",
        headers={"apikey": brain_key, "Authorization": "Bearer " + brain_key}
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            print("task_queue table already EXISTS")
            return True
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print("task_queue does not exist — needs to be created via Supabase SQL editor")
            return False
        print(f"task_queue check: HTTP {e.code}")
        return False


if __name__ == "__main__":
    env = dotenv_values("c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.env")
    brain_url = env.get("ANTIGRAVITY_BRAIN_URL","")
    brain_key = env.get("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY","")
    anthropic = env.get("ANTHROPIC_API_KEY","")
    elevenlabs = env.get("ELEVENLABS_API_KEY","")
    brain_anon = env.get("ANTIGRAVITY_BRAIN_ANON_KEY","")

    print("=== PI FINISH ===")
    pi = PiMCP()
    pi.connect()
    print("Connected\n")

    # 1. Write .env to Pi
    print("[1] Writing .env to Pi...")
    pi_env = f"""# Antigravity Pi .env
ANTIGRAVITY_BRAIN_URL={brain_url}
ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY={brain_key}
ANTIGRAVITY_BRAIN_ANON_KEY={brain_anon}
ANTHROPIC_API_KEY={anthropic}
ELEVENLABS_API_KEY={elevenlabs}
NODE_ID=pi-research-01
NODE_TIER=research
"""
    result = pi.write_file("/home/jonny/antigravity/.env", pi_env)
    print(f"  .env written: {result}")

    # 2. Get Tailscale auth URL
    print("\n[2] Getting Tailscale auth URL...")
    auth_out = pi.shell("sudo tailscale up --timeout 5s 2>&1 || sudo tailscale status 2>&1", timeout=20)
    print(auth_out)

    # Also try getting login URL directly
    login_url = pi.shell("sudo tailscale up --qr=false 2>&1 | grep -o 'https://login.tailscale.com[^ ]*'", timeout=20)
    if login_url.strip():
        print(f"\n*** TAILSCALE AUTH URL ***\n{login_url.strip()}\n*** OPEN IN BROWSER ***")

    # 3. Check Supabase task_queue
    print("\n[3] Checking Supabase task_queue...")
    create_task_queue_in_supabase()

    # 4. Test heartbeat
    print("\n[4] Testing pi_heartbeat.py...")
    hb_test = pi.shell("cd /home/jonny/antigravity && python3 pi_heartbeat.py 2>&1", timeout=20)
    print(hb_test)

    # 5. Verify crontab
    print("\n[5] Crontab on Pi:")
    cron = pi.shell("crontab -l 2>&1")
    print(cron)

    pi.close()
    print("\n=== DONE ===")
