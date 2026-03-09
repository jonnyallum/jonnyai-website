#!/usr/bin/env python3
"""pi_finalise.py — Push updated heartbeat to Pi using node_status table."""
import sys, json, uuid, threading, queue as Q, urllib.request
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PI_BASE = "http://192.168.1.64:8747"

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
        self._send_wait({"jsonrpc":"2.0","id":"init","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"pi-finalise","version":"1.0"}}}, 10)
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
    def write_file(self, path, content):
        cid = f"w-{uuid.uuid4().hex[:6]}"
        resp = self._send_wait({"jsonrpc":"2.0","id":cid,"method":"tools/call","params":{"name":"write_file","arguments":{"path":path,"content":content}}}, 15)
        content_list = resp.get("result",{}).get("content",[])
        if content_list:
            try: return json.loads(content_list[0].get("text","{}")).get("success","?")
            except: return content_list[0].get("text","")
        return "?"
    def shell(self, cmd, timeout=30):
        cid = f"s-{uuid.uuid4().hex[:6]}"
        resp = self._send_wait({"jsonrpc":"2.0","id":cid,"method":"tools/call","params":{"name":"run_shell","arguments":{"command":cmd,"timeout_sec":timeout}}}, timeout+5)
        content = resp.get("result",{}).get("content",[])
        if content:
            try: d = json.loads(content[0].get("text","{}"))
            except: return content[0].get("text","")
            return d.get("stdout","") + d.get("stderr","")
        return str(resp)
    def close(self):
        try: self.conn.close()
        except: pass


HEARTBEAT = '''#!/usr/bin/env python3
"""Pi heartbeat — upserts node status to Shared Brain node_status table every 5 min."""
import os, json, urllib.request
from datetime import datetime, timezone
from dotenv import load_dotenv
import psutil

load_dotenv("/home/jonny/antigravity/.env")
BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
NODE_ID   = os.getenv("NODE_ID", "pi-research-01")
NODE_TIER = os.getenv("NODE_TIER", "research")


def main():
    mem  = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    temps = psutil.sensors_temperatures()
    temp_c = 0.0
    for key in ("cpu_thermal", "cpu-thermal", "coretemp"):
        if key in temps and temps[key]:
            temp_c = temps[key][0].current
            break

    cpu_pct  = psutil.cpu_percent(interval=1)
    status   = "healthy" if temp_c < 70 and mem.percent < 85 else "warning"

    payload = json.dumps({
        "node_id":      NODE_ID,
        "node_tier":    NODE_TIER,
        "last_seen":    datetime.now(timezone.utc).isoformat(),
        "cpu_temp_c":   round(temp_c, 1),
        "cpu_percent":  round(cpu_pct, 1),
        "mem_percent":  round(mem.percent, 1),
        "disk_percent": round(disk.percent, 1),
        "status":       status,
        "metadata":     {"uptime_hrs": round((datetime.now() - datetime.fromtimestamp(psutil.boot_time())).total_seconds() / 3600, 1)}
    }).encode()

    req = urllib.request.Request(
        BRAIN_URL + "/rest/v1/node_status?on_conflict=node_id",
        data=payload,
        headers={
            "apikey": BRAIN_KEY,
            "Authorization": "Bearer " + BRAIN_KEY,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal"
        }, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            ts = datetime.now().strftime("%H:%M")
            print(f"[{ts}] {NODE_ID} | {status} | CPU:{cpu_pct}% Temp:{temp_c}C RAM:{mem.percent}% | HTTP {r.status}")
    except Exception as e:
        print(f"Heartbeat error: {e}")


if __name__ == "__main__":
    main()
'''

if __name__ == "__main__":
    print("=== PI FINALISE ===")
    pi = PiMCP()
    pi.connect()
    print("Connected\n")

    # Update heartbeat script
    result = pi.write_file("/home/jonny/antigravity/pi_heartbeat.py", HEARTBEAT)
    print(f"[1] Updated pi_heartbeat.py: {result}")

    # Test heartbeat (will fail until task_queue SQL is run, but node_status should work)
    print("\n[2] Testing heartbeat (needs node_status table first)...")
    out = pi.shell("cd /home/jonny/antigravity && python3 pi_heartbeat.py 2>&1", timeout=20)
    print(out)

    # Check Tailscale status
    print("\n[3] Tailscale status:")
    ts = pi.shell("tailscale status 2>&1 | head -10")
    print(ts)

    pi.close()
    print("\n=== DONE ===")
