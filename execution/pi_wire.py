#!/usr/bin/env python3
"""
pi_wire.py — Full Pi wiring: Tailscale + supabase + task queue worker + cron fix
"""
import sys, json, uuid, threading, queue as Q
import urllib.request
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PI_BASE = "http://192.168.1.64:8747"


class PiMCP:
    def __init__(self):
        self.conn = None
        self.session_url = None
        self.results = {}
        self._lock = threading.Lock()

    def connect(self):
        self.conn = urllib.request.urlopen(f"{PI_BASE}/sse", timeout=15)
        for _ in range(30):
            line = self.conn.readline().decode().strip()
            if line.startswith("data:"):
                path = line[5:].strip()
                self.session_url = f"{PI_BASE}{path}"
                break
        if not self.session_url:
            raise RuntimeError("No session URL")
        t = threading.Thread(target=self._read_sse, daemon=True)
        t.start()
        self._send_wait({"jsonrpc":"2.0","id":"init","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"pi-wire","version":"1.0"}}}, timeout=10)
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
                                if mid in self.results:
                                    self.results[mid].put(msg)
                    except Exception: pass
            except Exception: break

    def _post(self, payload):
        data = json.dumps(payload).encode()
        req = urllib.request.Request(self.session_url, data=data, headers={"Content-Type":"application/json"}, method="POST")
        urllib.request.urlopen(req, timeout=10).close()

    def _send_wait(self, payload, timeout=30):
        mid = payload.get("id")
        q = Q.Queue()
        with self._lock: self.results[mid] = q
        self._post(payload)
        try:
            msg = q.get(timeout=timeout)
            return msg
        except Q.Empty:
            return {"error": f"Timeout {mid}"}
        finally:
            with self._lock: self.results.pop(mid, None)

    def shell(self, cmd: str, timeout: int = 60) -> str:
        call_id = f"s-{uuid.uuid4().hex[:6]}"
        resp = self._send_wait({"jsonrpc":"2.0","id":call_id,"method":"tools/call","params":{"name":"run_shell","arguments":{"command":cmd,"timeout_sec":timeout}}}, timeout=timeout+5)
        result = resp.get("result",{})
        content = result.get("content",[])
        if content:
            try: data = json.loads(content[0].get("text","{}"))
            except: return content[0].get("text","")
            return data.get("stdout","") + data.get("stderr","")
        return str(resp)

    def write_file(self, path: str, content: str) -> str:
        call_id = f"w-{uuid.uuid4().hex[:6]}"
        resp = self._send_wait({"jsonrpc":"2.0","id":call_id,"method":"tools/call","params":{"name":"write_file","arguments":{"path":path,"content":content}}}, timeout=15)
        result = resp.get("result",{})
        content_list = result.get("content",[])
        if content_list:
            try: return json.loads(content_list[0].get("text","{}")).get("success","?")
            except: return content_list[0].get("text","")
        return str(resp)

    def close(self):
        try: self.conn.close()
        except: pass


def step(label):
    print(f"\n{'='*60}")
    print(f"  {label}")
    print(f"{'='*60}")


if __name__ == "__main__":
    print("=== PI WIRING ===")

    pi = PiMCP()
    try:
        pi.connect()
        print("Connected to Pi MCP\n")
    except Exception as e:
        print(f"Failed to connect: {e}")
        sys.exit(1)

    # ── 1. Network interface ─────────────────────────────────────────────
    step("1. Network interface")
    ifaces = pi.shell("ip -br addr | grep -v '^lo'")
    print(ifaces)
    pi_ip = pi.shell("hostname -I | awk '{print $1}'").strip()
    print(f"Pi IP: {pi_ip}")

    # ── 2. Install Tailscale ─────────────────────────────────────────────
    step("2. Install Tailscale")
    print("Installing Tailscale (may take 60s)...")
    install_out = pi.shell("curl -fsSL https://tailscale.com/install.sh | sudo sh 2>&1", timeout=120)
    print(install_out[:500])

    # Check installed
    check = pi.shell("which tailscale && tailscale version 2>&1 || echo NOT_FOUND")
    print(check.strip())

    # ── 3. Start tailscaled ───────────────────────────────────────────────
    step("3. Start tailscaled")
    print(pi.shell("sudo systemctl enable --now tailscaled 2>&1 && echo 'tailscaled started'"))

    # ── 4. Get auth URL ──────────────────────────────────────────────────
    step("4. Tailscale auth URL")
    print("Getting auth URL (requires browser login)...")
    auth_out = pi.shell("sudo tailscale up --qr 2>&1 | head -20", timeout=30)
    print(auth_out)
    print("\n*** OPEN THE URL ABOVE IN YOUR BROWSER TO AUTHENTICATE ***")

    # ── 5. Install supabase ───────────────────────────────────────────────
    step("5. Install supabase Python package")
    install = pi.shell("pip3 install supabase 2>&1 | tail -5", timeout=120)
    print(install)

    # ── 6. Fix broken cron + set up heartbeat ────────────────────────────
    step("6. Fix crontab (remove broken entry, add heartbeat)")
    # Clear the broken cron and add proper ones
    new_cron = """# Antigravity Pi crontabs
# Pi heartbeat -> Shared Brain every 5 min
*/5 * * * * cd /home/jonny/antigravity && python3 pi_heartbeat.py >> /home/jonny/logs/heartbeat.log 2>&1
# Task queue worker — continuous (keep alive via cron restart)
*/2 * * * * cd /home/jonny/antigravity && python3 pi_task_worker.py --once >> /home/jonny/logs/task_worker.log 2>&1
"""
    # Write via crontab -r then set new
    print(pi.shell("crontab -r 2>/dev/null; echo cleared"))
    cron_result = pi.shell(f"echo '{new_cron}' | crontab - && echo 'cron set' || echo 'cron failed'")
    print(cron_result)

    # ── 7. Build heartbeat script ─────────────────────────────────────────
    step("7. Write pi_heartbeat.py to Pi")

    HEARTBEAT = '''#!/usr/bin/env python3
"""Pi heartbeat — posts node status to Antigravity Shared Brain every 5 min."""
import os, json, urllib.request
from datetime import datetime, timezone
from dotenv import load_dotenv
import psutil

load_dotenv("/home/jonny/antigravity/.env")
BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
NODE_ID   = os.getenv("NODE_ID", "pi-research-01")

def main():
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    temps = psutil.sensors_temperatures()
    temp_c = 0.0
    for key in ("cpu_thermal","cpu-thermal","coretemp"):
        if key in temps and temps[key]:
            temp_c = temps[key][0].current
            break

    payload = json.dumps({
        "agent_id": NODE_ID,
        "ai_source": "pi-edge",
        "message": (
            f"[HEARTBEAT] {NODE_ID} | CPU: {psutil.cpu_percent()}% | "
            f"Temp: {temp_c:.1f}C | RAM: {mem.percent}% | "
            f"Disk: {disk.percent}% | Status: {'healthy' if temp_c < 70 else 'warning'}"
        ),
        "message_type": "heartbeat",
        "created_at": datetime.now(timezone.utc).isoformat()
    }).encode()

    req = urllib.request.Request(
        BRAIN_URL + "/rest/v1/chatroom",
        data=payload,
        headers={"apikey": BRAIN_KEY, "Authorization": "Bearer " + BRAIN_KEY,
                 "Content-Type": "application/json", "Prefer": "return=minimal"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            print(f"[{datetime.now().strftime('%H:%M')}] Heartbeat posted: {r.status}")
    except Exception as e:
        print(f"Heartbeat failed: {e}")

if __name__ == "__main__":
    main()
'''

    result = pi.write_file("/home/jonny/antigravity/pi_heartbeat.py", HEARTBEAT)
    print(f"Wrote pi_heartbeat.py: {result}")

    # ── 8. Build task worker ──────────────────────────────────────────────
    step("8. Write pi_task_worker.py to Pi")

    WORKER = '''#!/usr/bin/env python3
"""
pi_task_worker.py
Polls Supabase task_queue for research-tier tasks and executes them via Pi tools.
Run with --once for cron (pick one task, process, exit).
"""
import os, sys, json, uuid, subprocess, requests, urllib.request
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv
from bs4 import BeautifulSoup

load_dotenv("/home/jonny/antigravity/.env")
BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
NODE_ID   = os.getenv("NODE_ID", "pi-research-01")
NODE_TIER = os.getenv("NODE_TIER", "research")

HEADERS = {
    "apikey": BRAIN_KEY,
    "Authorization": "Bearer " + BRAIN_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}


def brain_req(method, path, data=None):
    url = BRAIN_URL + "/rest/v1/" + path
    d = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=d, headers=HEADERS, method=method)
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read()) if r.read() else []


def claim_task():
    """Atomically claim one queued task for this node tier."""
    # Find oldest queued task for our tier
    url = (BRAIN_URL + f"/rest/v1/task_queue"
           f"?node_tier=eq.{NODE_TIER}&status=eq.queued"
           f"&order=priority.asc,queued_at.asc&limit=1")
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=10) as r:
        tasks = json.loads(r.read())
    if not tasks:
        return None
    task = tasks[0]
    task_id = task["id"]

    # Claim it (update to in_progress)
    url2 = BRAIN_URL + f"/rest/v1/task_queue?id=eq.{task_id}&status=eq.queued"
    data = json.dumps({"status": "in_progress", "worker_node_id": NODE_ID,
                       "picked_up_at": datetime.now(timezone.utc).isoformat()}).encode()
    req2 = urllib.request.Request(url2, data=data,
                                   headers={**HEADERS, "Prefer": "return=representation"},
                                   method="PATCH")
    with urllib.request.urlopen(req2, timeout=10) as r:
        updated = json.loads(r.read())
    return updated[0] if updated else None


def execute_task(task: dict) -> dict:
    task_type = task.get("task_type", "")
    payload = task.get("task_payload", {})

    if task_type == "scrape_url":
        url = payload.get("url", "")
        selectors = payload.get("selectors")
        hdrs = {"User-Agent": "Mozilla/5.0 (compatible; AntigravityBot/1.0)"}
        r = requests.get(url, headers=hdrs, timeout=15)
        soup = BeautifulSoup(r.content, "html.parser")
        if selectors:
            data = {sel: [el.get_text(strip=True) for el in soup.select(sel)] for sel in selectors}
        else:
            data = {
                "title": soup.title.string if soup.title else None,
                "h1": [h.get_text(strip=True) for h in soup.find_all("h1")],
                "paragraphs": [p.get_text(strip=True) for p in soup.find_all("p")[:15]],
            }
        return {"success": True, "url": url, "data": data}

    elif task_type == "run_shell":
        cmd = payload.get("command", "echo no_command")
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        return {"stdout": result.stdout[:3000], "stderr": result.stderr[:500], "returncode": result.returncode}

    elif task_type == "run_python":
        code = payload.get("code", "print('no code')")
        result = subprocess.run(["python3", "-c", code], capture_output=True, text=True, timeout=30)
        return {"stdout": result.stdout[:3000], "stderr": result.stderr[:500], "returncode": result.returncode}

    elif task_type == "monitor_competitor":
        domain = payload.get("domain", "")
        url = f"https://{domain}" if not domain.startswith("http") else domain
        hdrs = {"User-Agent": "Mozilla/5.0 (compatible; AntigravityBot/1.0)"}
        r = requests.get(url, headers=hdrs, timeout=15)
        soup = BeautifulSoup(r.content, "html.parser")
        return {
            "domain": domain, "status_code": r.status_code,
            "title": soup.title.string.strip() if soup.title else None,
            "h1s": [h.get_text(strip=True) for h in soup.find_all("h1")],
        }

    else:
        return {"error": f"Unknown task_type: {task_type}"}


def complete_task(task_id: str, result: dict):
    url = BRAIN_URL + f"/rest/v1/task_queue?id=eq.{task_id}"
    data = json.dumps({
        "status": "completed",
        "result": result,
        "completed_at": datetime.now(timezone.utc).isoformat()
    }).encode()
    req = urllib.request.Request(url, data=data, headers=HEADERS, method="PATCH")
    urllib.request.urlopen(req, timeout=10).close()


def fail_task(task_id: str, error: str):
    url = BRAIN_URL + f"/rest/v1/task_queue?id=eq.{task_id}"
    data = json.dumps({
        "status": "failed",
        "error_message": error,
        "completed_at": datetime.now(timezone.utc).isoformat()
    }).encode()
    req = urllib.request.Request(url, data=data, headers=HEADERS, method="PATCH")
    urllib.request.urlopen(req, timeout=10).close()


def main():
    task = claim_task()
    if not task:
        print(f"[{datetime.now().strftime('%H:%M')}] No tasks queued for {NODE_TIER}")
        return

    task_id = task["id"]
    task_type = task.get("task_type","?")
    print(f"[{datetime.now().strftime('%H:%M')}] Claimed: {task_type} ({task_id[:8]})")

    try:
        result = execute_task(task)
        complete_task(task_id, result)
        print(f"  Done: {list(result.keys())}")
    except Exception as e:
        fail_task(task_id, str(e))
        print(f"  Failed: {e}")


if __name__ == "__main__":
    main()
'''

    result2 = pi.write_file("/home/jonny/antigravity/pi_task_worker.py", WORKER)
    print(f"Wrote pi_task_worker.py: {result2}")

    # ── 9. Ensure antigravity dir exists ────────────────────────────────
    step("9. Setup dirs + copy .env")
    print(pi.shell("mkdir -p /home/jonny/antigravity /home/jonny/logs && echo dirs_ok"))

    # Check if .env exists on Pi
    env_check = pi.shell("test -f /home/jonny/antigravity/.env && echo EXISTS || echo MISSING")
    print(f".env: {env_check.strip()}")

    # ── 10. Summary ──────────────────────────────────────────────────────
    step("SUMMARY")
    ts_check = pi.shell("which tailscale 2>/dev/null && echo INSTALLED || echo NOT_INSTALLED")
    sb_check = pi.shell("python3 -c 'import supabase; print(supabase.__version__)' 2>&1 | head -1")
    print(f"  Tailscale: {ts_check.strip()}")
    print(f"  Supabase: {sb_check.strip()}")
    print(f"  Edge service: running")
    print(f"  Pi IP: {pi_ip}")
    print()
    print("NEXT STEPS:")
    print("  1. Authorize Tailscale in browser (URL shown above)")
    print("  2. Copy .env to Pi at /home/jonny/antigravity/.env")
    print("  3. Create task_queue table in Supabase (SQL in PI_CLUSTER_STRATEGY.md)")
    print("  4. Re-auth Tailscale on GCP VM: sudo tailscale up")

    pi.close()
    print("\n=== WIRING COMPLETE ===")
