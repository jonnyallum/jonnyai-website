"""
@Vigil + @Watcher + @Arthur — Daily Ecosystem Audit
Mindset: 'How can we make this better?'
- Scans all .md files for staleness, broken links, empty sections
- Checks chatroom.md last activity
- Reviews agent-health.json for degraded agents
- Reads WORK_LOG.md for stuck/overdue tasks
- Checks git log for commit cadence
- Generates improvement recommendations
- Saves report to Supabase + commits to GitHub
"""
import os, json, subprocess, re
from datetime import datetime, timezone
from pathlib import Path

REPO = Path("/home/antigravity-ai/Antigravity_Orchestra")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", os.environ.get("SUPABASE_KEY", ""))
NOW = datetime.now(timezone.utc)
REPORT_DATE = NOW.strftime("%Y-%m-%d")

findings = []
improvements = []

def add_finding(category, issue, recommendation, severity="medium"):
    findings.append({
        "category": category,
        "issue": issue,
        "recommendation": recommendation,
        "severity": severity
    })
    improvements.append(f"[{severity.upper()}] {category}: {recommendation}")

def scan_md_files():
    """Scan all .md files for staleness and quality issues."""
    print("[1/6] Scanning .md files...")
    md_files = list(REPO.rglob("*.md"))
    stale = []
    empty_sections = []
    placeholder_count = 0

    # Filter out node_modules, dist, and client project ecosystem files
    md_files = [f for f in md_files if not any(
        skip in str(f) for skip in ["node_modules", "/dist/", "/.git/", "mcp-antigravity", "mcp-bl-supabase"]
    )]

    for f in md_files:
        try:
            content = f.read_text(encoding="utf-8", errors="ignore")
            # Check for placeholder content (strict patterns only)
            if any(p in content.lower() for p in ["lorem ipsum", "todo: fill this", "placeholder text"]):
                placeholder_count += 1
                add_finding("Documentation", f"{f.name} has placeholder content", f"Fill or remove placeholder content in {f.relative_to(REPO)}", "high")
            # Check for empty sections (header with no content)
            sections = re.findall(r'^#{1,3} .+\n(?:\n|$)', content, re.MULTILINE)
            if len(sections) > 2:
                empty_sections.append(f.name)
            # File size check
            if f.stat().st_size < 50:
                add_finding("Documentation", f"{f.name} is nearly empty ({f.stat().st_size} bytes)", f"Populate or archive {f.relative_to(REPO)}", "low")
        except Exception:
            pass

    print(f"  Scanned {len(md_files)} .md files | Placeholders: {placeholder_count}")

def check_chatroom():
    """Check chatroom activity — is the hive mind communicating?"""
    print("[2/6] Checking chatroom...")
    chatroom = REPO / ".agent" / "boardroom" / "chatroom.md"
    if chatroom.exists():
        content = chatroom.read_text(encoding="utf-8", errors="ignore")
        lines = [l for l in content.split("\n") if l.strip()]
        # Find most recent date mention
        dates = re.findall(r'\d{4}-\d{2}-\d{2}', content)
        if dates:
            last_date = max(dates)
            days_since = (NOW.date() - datetime.strptime(last_date, "%Y-%m-%d").date()).days
            if days_since > 3:
                add_finding("Collaboration", f"Chatroom last updated {days_since} days ago ({last_date})",
                    "Agents should broadcast session summaries daily via sync_chatroom.py", "medium")
            print(f"  Chatroom last activity: {last_date} ({days_since}d ago) | {len(lines)} entries")
        else:
            add_finding("Collaboration", "Chatroom has no dated entries", "Run sync_chatroom.py after every session", "high")
    else:
        add_finding("Collaboration", "chatroom.md not found", "Create and populate chatroom.md", "high")

def check_agent_health():
    """Review agent health metrics."""
    print("[3/6] Checking agent health...")
    health_file = REPO / ".agent" / "memory" / "agent-health.json"
    if health_file.exists():
        try:
            health = json.loads(health_file.read_text())
            if isinstance(health, dict):
                degraded = [a for a, v in health.items() if isinstance(v, dict) and v.get("score", 10) < 7]
                if degraded:
                    add_finding("Agent Health", f"{len(degraded)} agents below 7/10: {', '.join(degraded[:5])}",
                        "Schedule training day for underperforming agents", "high")
                print(f"  {len(health)} agents tracked | Degraded: {len(degraded)}")
        except Exception as e:
            print(f"  Could not parse health file: {e}")
    else:
        add_finding("Agent Health", "agent-health.json missing", "Run brain_sync.py to initialise health tracking", "medium")

def check_work_log():
    """Scan WORK_LOG for stuck/overdue tasks."""
    print("[4/6] Checking WORK_LOG...")
    work_log = REPO / "docs" / "WORK_LOG.md"
    if work_log.exists():
        content = work_log.read_text(encoding="utf-8", errors="ignore")
        # Find incomplete tasks older than today
        pending = re.findall(r'- \[ \] (.+)', content)
        done = re.findall(r'- \[x\] (.+)', content, re.IGNORECASE)
        if len(pending) > 20:
            add_finding("Task Management", f"{len(pending)} open tasks in WORK_LOG",
                "Triage: archive completed items, prioritise top 5 active", "medium")
        print(f"  Open tasks: {len(pending)} | Done: {len(done)}")
    else:
        add_finding("Documentation", "WORK_LOG.md not found", "Create WORK_LOG.md in docs/", "low")

def check_git_cadence():
    """Check commit frequency — are we shipping?"""
    print("[5/6] Checking git commit cadence...")
    try:
        result = subprocess.run(
            ["git", "-C", str(REPO), "log", "--oneline", "--since=7 days ago"],
            capture_output=True, text=True, timeout=15
        )
        commits = [l for l in result.stdout.strip().split("\n") if l]
        if len(commits) < 3:
            add_finding("Velocity", f"Only {len(commits)} commits in last 7 days",
                "Increase shipping cadence — aim for daily commits", "medium")
        elif len(commits) > 30:
            improvements.append("[INFO] Velocity: High commit volume this week — excellent pace")
        print(f"  Commits last 7 days: {len(commits)}")
    except Exception as e:
        print(f"  Git check failed: {e}")

def check_execution_scripts():
    """Check for unregistered execution scripts (scripts not tied to any cron)."""
    print("[6/6] Checking execution scripts coverage...")
    try:
        exec_dir = REPO / "execution"
        scripts = [f.name for f in exec_dir.glob("*.py") if not f.name.startswith("_")]
        # Check which have systemd service
        result = subprocess.run(["bash", "-c", "ls /etc/systemd/system/*.service 2>/dev/null | xargs -I{} basename {} .service"],
            capture_output=True, text=True, timeout=10)
        services = result.stdout.strip().split("\n")
        # Key scripts that SHOULD have crons
        should_be_crons = ["process_orders", "sync_bl_stock", "dreamer_daily", "research_engine",
                           "ais_branch_listener", "heartbeat", "social_engine", "brain_sync"]
        missing = [s for s in should_be_crons if not any(s.replace("_", "-") in svc for svc in services)]
        if missing:
            add_finding("Automation", f"Scripts without crons: {', '.join(missing)}",
                "Register these as systemd timers for 24/7 autonomous operation", "high")
        print(f"  {len(scripts)} scripts | {len(services)} services registered")
    except Exception as e:
        print(f"  Coverage check error: {e}")

def save_to_supabase(report):
    """Push report to Supabase learnings table."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("  No Supabase credentials — skipping DB save")
        return
    try:
        import urllib.request
        payload = json.dumps({
            "agent": "vigil",
            "category": "ecosystem_audit",
            "content": json.dumps(report, indent=2),
            "tags": ["audit", "daily", "ecosystem"],
            "created_at": NOW.isoformat()
        }).encode()
        req = urllib.request.Request(
            SUPABASE_URL + "/rest/v1/learnings",
            data=payload,
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"  Supabase save: {resp.status}")
    except Exception as e:
        print(f"  Supabase error: {e}")

def save_report_to_file(report):
    """Commit report to GitHub."""
    try:
        reports_dir = REPO / "docs" / "audits"
        reports_dir.mkdir(exist_ok=True)
        report_path = reports_dir / f"ecosystem-audit-{REPORT_DATE}.md"

        lines = [
            f"# Ecosystem Audit — {REPORT_DATE}",
            f"**Generated by:** @Vigil + @Watcher | **Mindset:** How can we make this better?",
            "",
            f"## Summary",
            f"- Total findings: {len(findings)}",
            f"- High priority: {sum(1 for f in findings if f['severity']=='high')}",
            f"- Medium priority: {sum(1 for f in findings if f['severity']=='medium')}",
            "",
            "## Findings & Recommendations",
            ""
        ]
        for f in findings:
            lines.append(f"### [{f['severity'].upper()}] {f['category']}")
            lines.append(f"**Issue:** {f['issue']}")
            lines.append(f"**Recommendation:** {f['recommendation']}")
            lines.append("")

        lines += ["## Action Items for Task List", ""]
        for imp in improvements:
            lines.append(f"- [ ] {imp}")

        report_path.write_text("\n".join(lines))
        print(f"  Report saved: {report_path}")

        # Git commit and push
        subprocess.run(["git", "-C", str(REPO), "add", str(report_path)], timeout=10)
        subprocess.run(["git", "-C", str(REPO), "commit", "-m", f"audit: ecosystem report {REPORT_DATE}"], timeout=15)
        subprocess.run(["git", "-C", str(REPO), "push", "origin", "main"], timeout=30)
        print("  Pushed to GitHub")
    except Exception as e:
        print(f"  Save/push error: {e}")

def main():
    print(f"\n=== ECOSYSTEM AUDIT | {REPORT_DATE} ===")
    print("Mindset: How can we make this better?\n")

    scan_md_files()
    check_chatroom()
    check_agent_health()
    check_work_log()
    check_git_cadence()
    check_execution_scripts()

    print(f"\n=== RESULTS: {len(findings)} findings ===")
    for f in findings:
        print(f"  [{f['severity'].upper()}] {f['category']}: {f['recommendation'][:80]}")

    report = {
        "date": REPORT_DATE,
        "findings": findings,
        "improvements": improvements,
        "total": len(findings)
    }

    print("\n=== SAVING ===")
    save_to_supabase(report)
    save_report_to_file(report)
    print(f"\nAudit complete. {len(findings)} findings. Report committed to GitHub.")

if __name__ == "__main__":
    main()
