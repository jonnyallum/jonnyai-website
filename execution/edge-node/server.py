"""
Antigravity Edge Node — Raspberry Pi 5 MCP Server
Serves the Antigravity agent orchestra with local compute capacity.
No AI HAT required for this version — pure research/scraping/automation cluster.
"""
import os
import subprocess
import json
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from fastmcp import FastMCP
import psutil
import requests
from bs4 import BeautifulSoup

NODE_ID   = os.getenv("NODE_ID", "pi-research-01")
NODE_TIER = os.getenv("NODE_TIER", "research")

mcp = FastMCP(
    "antigravity-edge-node",
    instructions=f"""
    You are the Antigravity Edge Node ({NODE_ID}) running on a Raspberry Pi 5.
    You provide tools for the Antigravity Orchestra's local compute tasks:
    - Web scraping and research (saving API costs)
    - Competitor monitoring 24/7
    - Shell command execution on edge hardware
    - Docker container management (rhasspy voice assistant is running)
    - Cron job scheduling for automation
    - File read/write on the Pi filesystem
    Always prefer running tasks here over cloud APIs when possible.
    """
)


# ── HEALTH & STATUS ────────────────────────────────────────────────────────

@mcp.tool()
def get_node_status() -> dict:
    """Return current Raspberry Pi 5 health metrics — CPU, memory, temp, disk, uptime."""
    temps = psutil.sensors_temperatures()
    temp_c = 0.0
    for key in ("cpu_thermal", "coretemp", "k10temp", "cpu-thermal"):
        if key in temps and temps[key]:
            temp_c = temps[key][0].current
            break

    mem    = psutil.virtual_memory()
    disk   = psutil.disk_usage("/")
    net    = psutil.net_io_counters()
    boot   = datetime.fromtimestamp(psutil.boot_time())
    uptime = (datetime.now() - boot).total_seconds() / 3600

    return {
        "node_id":    NODE_ID,
        "tier":       NODE_TIER,
        "timestamp":  datetime.now().isoformat(),
        "cpu_temp_c": round(temp_c, 1),
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory": {
            "total_gb": round(mem.total / 1e9, 2),
            "used_gb":  round(mem.used / 1e9, 2),
            "percent":  mem.percent,
        },
        "disk": {
            "total_gb": round(disk.total / 1e9, 1),
            "free_gb":  round(disk.free / 1e9, 1),
            "percent":  disk.percent,
        },
        "network": {
            "sent_mb": round(net.bytes_sent / 1e6, 1),
            "recv_mb": round(net.bytes_recv / 1e6, 1),
        },
        "uptime_hours": round(uptime, 1),
        "status": "healthy" if temp_c < 70 and mem.percent < 85 else "warning",
    }


# ── WEB SCRAPING & RESEARCH ────────────────────────────────────────────────

@mcp.tool()
def scrape_url(url: str, selectors: list[str] | None = None) -> dict:
    """
    Scrape any public URL and return structured content.
    Optionally filter by CSS selectors (e.g. ['h1', '.price', '#main']).
    Replaces cloud scraping APIs — runs for free locally.
    Used by: @sophie, @scholar, @hugo, @intelhub
    """
    try:
        headers = {"User-Agent": "Mozilla/5.0 (compatible; AntigravityBot/1.0)"}
        r = requests.get(url, headers=headers, timeout=15)
        r.raise_for_status()
        soup = BeautifulSoup(r.content, "html.parser")

        if selectors:
            data = {}
            for sel in selectors:
                data[sel] = [el.get_text(strip=True) for el in soup.select(sel)]
        else:
            data = {
                "title":      soup.title.string if soup.title else None,
                "h1":         [h.get_text(strip=True) for h in soup.find_all("h1")],
                "h2":         [h.get_text(strip=True) for h in soup.find_all("h2")[:10]],
                "paragraphs": [p.get_text(strip=True) for p in soup.find_all("p")[:20]],
                "links":      list({a.get("href") for a in soup.find_all("a", href=True)}),
                "meta_desc":  (soup.find("meta", {"name": "description"}) or {}).get("content"),
            }

        return {"success": True, "url": url, "data": data, "node": NODE_ID}
    except Exception as e:
        return {"success": False, "url": url, "error": str(e)}


@mcp.tool()
def monitor_competitor(domain: str) -> dict:
    """
    Full competitive intelligence snapshot of a competitor domain.
    Extracts: title, meta, CTAs, pricing hints, tech stack detection.
    Used by: @grace (SEO), @sophie (research), @intelhub (24/7 monitoring).
    """
    try:
        url = f"https://{domain}" if not domain.startswith("http") else domain
        headers = {"User-Agent": "Mozilla/5.0 (compatible; AntigravityBot/1.0)"}
        r = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(r.content, "html.parser")

        price_hints = []
        for el in soup.find_all(string=True):
            text = el.strip()
            if any(kw in text.lower() for kw in ["£", "$", "€", "/mo", "/month", "pricing"]) and len(text) < 120:
                price_hints.append(text)

        return {
            "domain":      domain,
            "status_code": r.status_code,
            "title":       soup.title.string.strip() if soup.title else None,
            "meta_desc":   (soup.find("meta", {"name": "description"}) or {}).get("content"),
            "h1s":         [h.get_text(strip=True) for h in soup.find_all("h1")],
            "ctas":        [
                b.get_text(strip=True) for b in
                soup.find_all(["button", "a"], class_=lambda c: c and any(
                    x in str(c).lower() for x in ["btn", "cta", "signup", "start", "trial"]
                ))
            ][:8],
            "pricing_hints": price_hints[:10],
            "tech_stack": {
                "next_js":    bool(soup.find("div", {"id": "__next"})),
                "react":      bool(soup.find("div", {"id": "root"})),
                "wordpress":  bool(soup.find("link", href=lambda h: h and "wp-content" in str(h))),
                "ga4":        bool(soup.find("script", src=lambda s: s and "googletagmanager" in str(s))),
                "intercom":   bool(soup.find("script", src=lambda s: s and "intercom" in str(s))),
            },
            "checked_at": datetime.now().isoformat(),
            "node":       NODE_ID,
        }
    except Exception as e:
        return {"success": False, "domain": domain, "error": str(e)}


@mcp.tool()
def fetch_hacker_news(limit: int = 20) -> dict:
    """
    Fetch Hacker News front page stories.
    Used by @dreamer daily intelligence cron — replaces cloud API calls.
    """
    try:
        top_ids = requests.get(
            "https://hacker-news.firebaseio.com/v0/topstories.json", timeout=10
        ).json()[:limit]

        stories = []
        for sid in top_ids:
            try:
                s = requests.get(
                    f"https://hacker-news.firebaseio.com/v0/item/{sid}.json", timeout=5
                ).json()
                stories.append({
                    "title": s.get("title"),
                    "url":   s.get("url"),
                    "score": s.get("score"),
                    "by":    s.get("by"),
                    "type":  s.get("type"),
                })
            except Exception:
                continue

        return {"success": True, "count": len(stories), "stories": stories, "fetched_at": datetime.now().isoformat()}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ── SHELL & SYSTEM MANAGEMENT ──────────────────────────────────────────────

@mcp.tool()
def run_shell(command: str, timeout_sec: int = 30) -> dict:
    """
    Run a shell command on the Raspberry Pi.
    Use for system management, package installs, file ops, cron checks, etc.
    """
    try:
        result = subprocess.run(
            command, shell=True, capture_output=True,
            text=True, timeout=timeout_sec
        )
        return {
            "command":    command,
            "stdout":     result.stdout[:5000],
            "stderr":     result.stderr[:1000],
            "returncode": result.returncode,
            "node":       NODE_ID,
        }
    except subprocess.TimeoutExpired:
        return {"error": f"Command timed out after {timeout_sec}s"}
    except Exception as e:
        return {"error": str(e)}


@mcp.tool()
def run_python(code: str) -> dict:
    """
    Execute Python code on the Pi.
    Useful for data processing, calculations, and lightweight agent logic.
    """
    try:
        result = subprocess.run(
            ["python3", "-c", code],
            capture_output=True, text=True, timeout=30
        )
        return {
            "stdout":     result.stdout[:5000],
            "stderr":     result.stderr[:1000],
            "returncode": result.returncode,
            "node":       NODE_ID,
        }
    except subprocess.TimeoutExpired:
        return {"error": "Timed out after 30s"}
    except Exception as e:
        return {"error": str(e)}


@mcp.tool()
def list_docker_containers() -> dict:
    """List all Docker containers on the Pi — running and stopped."""
    try:
        result = subprocess.run(
            ["docker", "ps", "-a", "--format",
             '{"id":"{{.ID}}","name":"{{.Names}}","image":"{{.Image}}","status":"{{.Status}}","ports":"{{.Ports}}"}'],
            capture_output=True, text=True, timeout=10
        )
        containers = []
        for line in result.stdout.strip().split("\n"):
            if line:
                try:
                    containers.append(json.loads(line))
                except Exception:
                    containers.append({"raw": line})
        return {"containers": containers, "count": len(containers), "node": NODE_ID}
    except Exception as e:
        return {"error": str(e)}


@mcp.tool()
def manage_docker(container_name: str, action: str) -> dict:
    """
    Manage a Docker container on the Pi.
    action: start | stop | restart | logs
    The 'rhasspy' voice assistant container is already running.
    """
    if action not in ("start", "stop", "restart", "logs"):
        return {"error": "action must be: start, stop, restart, or logs"}
    try:
        if action == "logs":
            cmd = ["docker", "logs", "--tail", "50", container_name]
        else:
            cmd = ["docker", action, container_name]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
        return {
            "container": container_name,
            "action":    action,
            "stdout":    result.stdout[:3000],
            "stderr":    result.stderr[:500],
            "success":   result.returncode == 0,
        }
    except Exception as e:
        return {"error": str(e)}


@mcp.tool()
def write_file(path: str, content: str) -> dict:
    """Write content to a file on the Pi filesystem."""
    try:
        p = Path(path).expanduser()
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content)
        return {"success": True, "path": str(p), "bytes_written": len(content)}
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
def read_file(path: str) -> dict:
    """Read a file from the Pi filesystem."""
    try:
        p = Path(path).expanduser()
        return {"success": True, "path": str(p), "content": p.read_text()}
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
def setup_cron(schedule: str, command: str, job_name: str) -> dict:
    """
    Add a cron job to the Pi for scheduled automation.
    schedule: cron expression e.g. '0 8 * * *' = 8am daily, '*/15 * * * *' = every 15 min
    command:  full shell command to execute
    job_name: identifier (no spaces)
    """
    try:
        existing = subprocess.run(["crontab", "-l"], capture_output=True, text=True)
        current = existing.stdout if existing.returncode == 0 else ""

        tag = f"# antigravity:{job_name}"
        if tag in current:
            return {"success": False, "error": f"Job '{job_name}' already exists. Remove first."}

        new_crontab = current + f"\n{tag}\n{schedule} {command}\n"
        proc = subprocess.run(["crontab", "-"], input=new_crontab, capture_output=True, text=True)

        return {
            "success":  proc.returncode == 0,
            "job_name": job_name,
            "schedule": schedule,
            "command":  command,
            "message":  "Cron job added successfully" if proc.returncode == 0 else proc.stderr,
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@mcp.tool()
def list_cron_jobs() -> dict:
    """List all cron jobs currently scheduled on the Pi."""
    try:
        result = subprocess.run(["crontab", "-l"], capture_output=True, text=True)
        return {
            "crontab":  result.stdout or "(empty)",
            "has_jobs": bool(result.stdout.strip()),
            "node":     NODE_ID,
        }
    except Exception as e:
        return {"error": str(e)}


# ── ENTRY POINT ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8747"))
    print(f"🎯 Antigravity Edge Node: {NODE_ID} ({NODE_TIER})")
    print(f"🌐 MCP SSE endpoint: http://0.0.0.0:{port}/sse")
    print(f"📡 Local access: http://192.168.1.64:{port}/sse")
    mcp.run(transport="sse", host="0.0.0.0", port=port)
