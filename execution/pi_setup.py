#!/usr/bin/env python3
"""
pi_setup.py — Raspberry Pi diagnostic + wiring via MCP SSE
"""
import sys, json, uuid, time, threading, queue as Q
import urllib.request
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PI_BASE = "http://192.168.1.64:8747"


class PiMCP:
    """Simple MCP SSE client with proper initialize handshake."""

    def __init__(self):
        self.conn = None
        self.session_url = None
        self.results = {}
        self._lock = threading.Lock()
        self._reader_thread = None

    def connect(self):
        self.conn = urllib.request.urlopen(f"{PI_BASE}/sse", timeout=15)
        # Read session endpoint from SSE
        for _ in range(30):
            line = self.conn.readline().decode().strip()
            if line.startswith("data:"):
                path = line[5:].strip()
                self.session_url = f"{PI_BASE}{path}"
                break
        if not self.session_url:
            raise RuntimeError("No session URL from SSE")

        # Start background SSE reader
        self._reader_thread = threading.Thread(target=self._read_sse, daemon=True)
        self._reader_thread.start()

        # MCP initialize handshake
        init_resp = self._send_wait({
            "jsonrpc": "2.0", "id": "init",
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "pi-setup", "version": "1.0"}
            }
        }, timeout=10)

        # Send initialized notification (no response expected)
        self._post({
            "jsonrpc": "2.0",
            "method": "notifications/initialized"
        })
        return init_resp

    def _read_sse(self):
        while True:
            try:
                line = self.conn.readline()
                if not line:
                    break
                line = line.decode().strip()
                if line.startswith("data:"):
                    data = line[5:].strip()
                    try:
                        msg = json.loads(data)
                        msg_id = msg.get("id")
                        if msg_id:
                            with self._lock:
                                if msg_id in self.results:
                                    self.results[msg_id].put(msg)
                    except Exception:
                        pass
            except Exception:
                break

    def _post(self, payload: dict):
        data = json.dumps(payload).encode()
        req = urllib.request.Request(
            self.session_url, data=data,
            headers={"Content-Type": "application/json"}, method="POST"
        )
        urllib.request.urlopen(req, timeout=10).close()

    def _send_wait(self, payload: dict, timeout: int = 30) -> dict:
        msg_id = payload.get("id")
        q = Q.Queue()
        with self._lock:
            self.results[msg_id] = q
        self._post(payload)
        try:
            msg = q.get(timeout=timeout)
            return msg
        except Q.Empty:
            return {"error": f"Timeout for {msg_id}"}
        finally:
            with self._lock:
                self.results.pop(msg_id, None)

    def call_tool(self, name: str, arguments: dict = {}, timeout: int = 30) -> dict:
        call_id = f"tool-{uuid.uuid4().hex[:6]}"
        resp = self._send_wait({
            "jsonrpc": "2.0", "id": call_id,
            "method": "tools/call",
            "params": {"name": name, "arguments": arguments}
        }, timeout=timeout)
        result = resp.get("result", {})
        content = result.get("content", [])
        if content:
            text = content[0].get("text", "")
            try:
                return json.loads(text)
            except Exception:
                return {"output": text}
        if "error" in resp:
            return {"error": resp["error"]}
        return result

    def close(self):
        try:
            self.conn.close()
        except Exception:
            pass


def run(pi: PiMCP, tool: str, args: dict = {}, label: str = None):
    label = label or tool
    print(f"\n[{label}]")
    result = pi.call_tool(tool, args)
    if isinstance(result, dict) and "error" in result:
        print(f"  ERROR: {result['error']}")
    else:
        text = result.get("output") or json.dumps(result, indent=2)
        print(text[:800])
    return result


if __name__ == "__main__":
    print("=== PI DIAGNOSTIC ===")

    pi = PiMCP()
    try:
        pi.connect()
        print("Connected to Pi MCP server\n")
    except Exception as e:
        print(f"Connection failed: {e}")
        sys.exit(1)

    run(pi, "get_node_status")
    run(pi, "run_shell", {"command": "tailscale status 2>&1 | head -8"}, "Tailscale Status")
    run(pi, "run_shell", {"command": "which tailscale && echo INSTALLED || echo NOT_INSTALLED"}, "Tailscale Binary")
    run(pi, "run_shell", {"command": "systemctl list-units --type=service --state=running 2>/dev/null | grep -Ei 'antigravity|edge|mcp|rhasspy|tailscale' | head -15"}, "Services")
    run(pi, "list_cron_jobs")
    run(pi, "list_docker_containers")
    run(pi, "run_shell", {"command": "pip3 list 2>/dev/null | grep -iE 'supabase|fastmcp|psutil|requests|beautifulsoup'"}, "Python Packages")
    run(pi, "run_shell", {"command": "cat /etc/hostname && uname -r && python3 --version && ip addr show eth0 2>/dev/null | grep 'inet '"}, "System Info")

    pi.close()
    print("\n=== DONE ===")
