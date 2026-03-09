# -*- coding: utf-8 -*-
"""
vm_health_check.py — Daily VM health check.
Scans cron logs for failures, checks disk usage, sends alert if issues found.
Cron: 0 6 * * * (runs before daily reports)
"""
import os, sys, re, subprocess, requests
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
LOGS_DIR       = Path("/home/info/logs")
NOW            = datetime.now(timezone.utc)
DATE_DISPLAY   = NOW.strftime("%A %d %B %Y")

ERROR_PATTERNS = re.compile(
    r"(error|exception|traceback|failed|failure|killed|oom|no such file|permission denied|connection refused)",
    re.IGNORECASE
)


def check_disk():
    try:
        r = subprocess.run(["df", "-h", "/"], capture_output=True, text=True, timeout=5)
        for line in r.stdout.splitlines()[1:]:
            parts = line.split()
            if len(parts) >= 5:
                used_pct = int(parts[4].replace("%", ""))
                return {"used_pct": used_pct, "line": line.strip()}
    except Exception as e:
        return {"used_pct": 0, "line": str(e)}
    return {"used_pct": 0, "line": "unknown"}


def scan_logs():
    issues = {}
    cutoff = NOW - timedelta(hours=24)

    if not LOGS_DIR.exists():
        return {}

    for log_file in sorted(LOGS_DIR.glob("*.log")):
        errors = []
        try:
            lines = log_file.read_text(errors="replace").splitlines()
            # Only check recent lines (last 200)
            for line in lines[-200:]:
                if ERROR_PATTERNS.search(line):
                    errors.append(line.strip()[:120])
        except Exception:
            pass
        if errors:
            issues[log_file.name] = errors[:5]  # max 5 per log

    return issues


def check_services():
    failed = []
    try:
        r = subprocess.run(
            ["systemctl", "is-active", "the-spine.service", "nginx.service", "docker.service"],
            capture_output=True, text=True, timeout=5
        )
        services = ["the-spine", "nginx", "docker"]
        statuses = r.stdout.strip().splitlines()
        for svc, status in zip(services, statuses):
            if status.strip() != "active":
                failed.append(f"{svc}: {status.strip()}")
    except Exception as e:
        failed.append(str(e))
    return failed


def build_html(disk, issues, failed_services):
    disk_color = "#ef4444" if disk["used_pct"] > 80 else ("#f59e0b" if disk["used_pct"] > 60 else "#4ade80")
    all_clear   = not issues and not failed_services and disk["used_pct"] < 80

    status_banner = (
        '<div style="background:#052e16;border:1px solid #16a34a;border-radius:4px;padding:14px 20px;'
        'margin-bottom:24px;color:#4ade80;font-weight:600">All systems nominal — no issues detected.</div>'
        if all_clear else
        '<div style="background:#2d0000;border:1px solid #ef4444;border-radius:4px;padding:14px 20px;'
        'margin-bottom:24px;color:#ef4444;font-weight:600">Issues detected — review below.</div>'
    )

    issues_html = ""
    if issues:
        for log_name, errors in issues.items():
            error_lines = "".join(
                f'<div style="padding:4px 0;border-bottom:1px solid #1a1a2e;color:#f87171;font-size:12px;'
                f'font-family:monospace">{e}</div>' for e in errors
            )
            issues_html += (
                f'<div style="margin-bottom:16px">'
                f'<div style="font-size:12px;font-weight:700;color:#f59e0b;margin-bottom:6px">{log_name}</div>'
                f'{error_lines}</div>'
            )
    else:
        issues_html = '<p style="color:#555;font-size:13px">No errors found in logs.</p>'

    service_html = ""
    if failed_services:
        service_html = "".join(
            f'<div style="color:#ef4444;font-size:13px;padding:4px 0">{s}</div>' for s in failed_services
        )
    else:
        service_html = '<div style="color:#4ade80;font-size:13px">The Spine, nginx, Docker — all active</div>'

    return f"""
<div style="font-family:'Inter',Arial,sans-serif;background:#0a0a0f;color:#fff;
            max-width:680px;margin:auto;border:1px solid #1a1a2e;">
  <div style="background:linear-gradient(135deg,#0a0a1a,#1a0a2e);padding:28px 36px;
              border-bottom:2px solid {'#ef4444' if not all_clear else '#4ade80'}">
    <h1 style="margin:0;font-size:20px;color:{'#ef4444' if not all_clear else '#4ade80'};
               letter-spacing:2px;text-transform:uppercase;font-weight:800;">
      VM Health Check {'— ACTION REQUIRED' if not all_clear else '— All Clear'}
    </h1>
    <p style="margin:6px 0 0;font-size:12px;color:#444">{DATE_DISPLAY} &bull; 06:00 UTC</p>
  </div>
  <div style="padding:28px 36px">
    {status_banner}
    <div style="display:flex;gap:12px;margin-bottom:24px">
      <div style="background:#0d0d18;border:1px solid #1a1a2e;border-left:3px solid {disk_color};
                  padding:16px 20px;flex:1;border-radius:4px">
        <div style="font-size:22px;font-weight:800;color:{disk_color}">{disk['used_pct']}%</div>
        <div style="font-size:11px;color:#555;text-transform:uppercase;letter-spacing:1px;margin-top:4px">Disk Used</div>
        <div style="font-size:11px;color:#333;margin-top:3px">{disk['line']}</div>
      </div>
      <div style="background:#0d0d18;border:1px solid #1a1a2e;border-left:3px solid #60a5fa;
                  padding:16px 20px;flex:1;border-radius:4px">
        <div style="font-size:13px;font-weight:700;color:#60a5fa;margin-bottom:8px">Core Services</div>
        {service_html}
      </div>
    </div>
    <h2 style="font-size:12px;color:#fff;letter-spacing:2px;text-transform:uppercase;
               border-left:3px solid #f59e0b;padding-left:10px;margin:0 0 12px">
      Log Errors (Last 24h)
    </h2>
    {issues_html}
  </div>
  <div style="padding:16px 36px;border-top:1px solid #111;font-size:11px;color:#333;text-align:center">
    Antigravity VM &bull; {NOW.strftime("%Y-%m-%d %H:%M")} UTC
  </div>
</div>"""


def main():
    print(f"[{NOW.strftime('%H:%M')}] VM health check running...")

    disk            = check_disk()
    issues          = scan_logs()
    failed_services = check_services()

    print(f"  Disk: {disk['used_pct']}% | Log issues: {len(issues)} files | Failed services: {len(failed_services)}")

    # Only send email if there are issues OR disk > 70%
    has_issues = issues or failed_services or disk["used_pct"] > 70

    if not has_issues:
        print("  All clear — no email needed.")
        return True

    if not RESEND_API_KEY:
        print("  ERROR: RESEND_API_KEY not set")
        return False

    html = build_html(disk, issues, failed_services)
    resp = requests.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
        json={
            "from": "Antigravity VM <reports@jonnyai.co.uk>",
            "to": "jonnyallum@gmail.com",
            "subject": (
                f"VM ALERT: {len(issues)} log issues, disk {disk['used_pct']}% — {DATE_DISPLAY}"
                if has_issues else f"VM Health: All Clear — {DATE_DISPLAY}"
            ),
            "html": html
        },
        timeout=15
    )

    if resp.status_code in (200, 201):
        print(f"  Alert sent. Issues={len(issues)} Disk={disk['used_pct']}%")
    else:
        print(f"  Send error {resp.status_code}: {resp.text[:100]}")
    return True


if __name__ == "__main__":
    main()
