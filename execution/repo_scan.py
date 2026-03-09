"""
@Hugo + @Sam — Weekly Deep Repository Scan
- GitHub commit patterns & contributor cadence
- Stale branches, orphaned files, large files
- Python dependency audit (requirements.txt)
- Secrets/credential leak scan
- Security surface scan (hardcoded keys, exposed tokens)
- Generates findings report → Supabase + GitHub
"""
import os, json, subprocess, re, urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

REPO = Path("/home/antigravity-ai/Antigravity_Orchestra")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", os.environ.get("SUPABASE_KEY", ""))
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
GITHUB_REPO = "jonnyallum/Antigravity_Orchestra"
NOW = datetime.now(timezone.utc)
TODAY = NOW.strftime("%Y-%m-%d")

findings = []

def add(category, issue, recommendation, severity="medium"):
    findings.append({"category": category, "issue": issue, "recommendation": recommendation, "severity": severity})
    print(f"  [{severity.upper()}] {recommendation[:80]}")

def git(cmd):
    r = subprocess.run(["git", "-C", str(REPO)] + cmd, capture_output=True, text=True, timeout=20)
    return r.stdout.strip()

def check_branches():
    print("[1/7] Checking branches...")
    branches = [b.strip().lstrip("* ") for b in git(["branch", "-a"]).split("\n") if b.strip()]
    # Stale remote branches (no commits in 30 days)
    stale = []
    for b in branches:
        if "remotes/" in b:
            last = git(["log", "-1", "--format=%ci", b])
            if last:
                try:
                    last_dt = datetime.fromisoformat(last[:19])
                    if (NOW.replace(tzinfo=None) - last_dt).days > 30:
                        stale.append(b.replace("remotes/origin/", ""))
                except: pass
    if stale:
        add("Version Control", f"{len(stale)} stale branches: {', '.join(stale[:5])}",
            "Delete stale branches with: git push origin --delete <branch>", "low")
    # Unmerged branches
    unmerged = git(["branch", "-r", "--no-merged", "main"]).split("\n")
    unmerged = [b.strip() for b in unmerged if b.strip() and "HEAD" not in b]
    if unmerged:
        add("Version Control", f"{len(unmerged)} unmerged remote branches",
            f"Review and merge or close: {', '.join(unmerged[:3])}", "medium")
    print(f"  Branches: {len(branches)} total | Stale: {len(stale)} | Unmerged: {len(unmerged)}")

def check_commit_cadence():
    print("[2/7] Commit cadence...")
    last_7 = git(["log", "--oneline", "--since=7 days ago"]).split("\n")
    last_30 = git(["log", "--oneline", "--since=30 days ago"]).split("\n")
    last_7 = [l for l in last_7 if l]
    last_30 = [l for l in last_30 if l]
    if len(last_7) < 5:
        add("Velocity", f"Only {len(last_7)} commits in 7 days",
            "Aim for at least 1 commit per day — run full_sync.py after each session", "medium")
    # Check for large commits (too much at once)
    for line in last_7[:10]:
        if line:
            parts = line.split()
            if parts:
                stat = git(["show", "--stat", "--format=", parts[0]])
                changed = re.search(r'(\d+) files? changed', stat)
                if changed and int(changed.group(1)) > 50:
                    add("Version Control", f"Large commit {parts[0][:8]}: {changed.group(1)} files changed",
                        "Break large commits into smaller, focused changes", "low")
    print(f"  Commits: 7d={len(last_7)}, 30d={len(last_30)}")

def check_large_files():
    print("[3/7] Scanning for large files...")
    large = []
    for f in REPO.rglob("*"):
        if f.is_file() and not any(p in str(f) for p in [".git", "__pycache__", "node_modules"]):
            size = f.stat().st_size
            if size > 5 * 1024 * 1024:  # >5MB
                large.append((f.relative_to(REPO), size // 1024 // 1024))
    if large:
        add("Repository", f"{len(large)} files >5MB in repo",
            f"Move to cloud storage (Supabase Storage/GCS): {', '.join(str(l[0]) for l in large[:3])}", "medium")
    # Check for common binary files that shouldn't be in git
    bad_exts = [".pyc", ".zip", ".tar", ".pdf", ".mp4", ".mp3", ".db", ".sqlite"]
    bad_files = [f for ext in bad_exts for f in REPO.rglob(f"*{ext}")
                 if ".git" not in str(f) and "node_modules" not in str(f)]
    if bad_files:
        add("Repository", f"{len(bad_files)} binary/large files tracked in git",
            "Add to .gitignore and remove from tracking: " + ", ".join(set(f.suffix for f in bad_files[:5])), "medium")
    print(f"  Large files (>5MB): {len(large)} | Binary files in git: {len(bad_files)}")

def check_secrets():
    print("[4/7] Scanning for exposed secrets...")
    secret_patterns = [
        (r'sk-[a-zA-Z0-9]{20,}', "OpenAI key pattern"),
        (r'AKIA[0-9A-Z]{16}', "AWS Access Key"),
        (r'eyJ[a-zA-Z0-9_-]{20,}\.eyJ', "JWT token"),
        (r'ghp_[a-zA-Z0-9]{36}', "GitHub PAT"),
        (r'xoxb-[0-9]+-', "Slack bot token"),
        (r'(?<![A-Z_])(?:password|passwd|secret)\s*=\s*["\'][^"\']{8,}["\']', "Hardcoded password"),
    ]
    exposed = []
    skip_dirs = {".git", "__pycache__", "node_modules", ".env", "venv"}
    for f in REPO.rglob("*.py"):
        if any(s in str(f) for s in skip_dirs): continue
        try:
            content = f.read_text(encoding="utf-8", errors="ignore")
            for pattern, desc in secret_patterns:
                if re.search(pattern, content):
                    exposed.append(f"{f.name}: {desc}")
        except: pass
    if exposed:
        add("Security", f"Potential secrets in {len(exposed)} files",
            f"Audit immediately: {'; '.join(exposed[:3])}", "high")
    else:
        print("  No obvious secret patterns found in .py files")
    print(f"  Secret scan: {len(exposed)} potential issues")

def check_dependencies():
    print("[5/7] Dependency audit...")
    req_file = REPO / "requirements.txt"
    if req_file.exists():
        try:
            r = subprocess.run(
                ["pip3", "list", "--outdated", "--format=json"],
                capture_output=True, text=True, timeout=30
            )
            outdated = json.loads(r.stdout) if r.stdout else []
            critical = [p for p in outdated if p.get("name", "").lower() in
                       ["paramiko", "cryptography", "supabase", "requests", "flask", "django"]]
            if critical:
                add("Dependencies", f"{len(critical)} critical packages outdated",
                    f"Update: {', '.join(p['name'] + ' ' + p['latest_version'] for p in critical[:5])}", "high")
            if len(outdated) > 10:
                add("Dependencies", f"{len(outdated)} packages have updates available",
                    "Run: pip3 install --upgrade <package> for key dependencies", "low")
            print(f"  Outdated packages: {len(outdated)} | Critical: {len(critical)}")
        except Exception as e:
            print(f"  Dependency check error: {e}")
    else:
        add("Dependencies", "No requirements.txt found",
            "Create requirements.txt with: pip3 freeze > requirements.txt", "medium")

def check_orphaned_scripts():
    print("[6/7] Finding orphaned scripts...")
    exec_scripts = set(f.name for f in (REPO / "execution").glob("*.py")
                      if not f.name.startswith("_"))
    # Check which are imported or referenced anywhere
    all_content = ""
    for f in REPO.rglob("*.py"):
        if ".git" not in str(f):
            try: all_content += f.read_text(errors="ignore") + "\n"
            except: pass
    for md in REPO.rglob("*.md"):
        try: all_content += md.read_text(errors="ignore") + "\n"
        except: pass

    possibly_orphaned = []
    for script in exec_scripts:
        name = script.replace(".py", "")
        if name not in all_content and script not in all_content:
            possibly_orphaned.append(script)

    if len(possibly_orphaned) > 5:
        add("Code Quality", f"{len(possibly_orphaned)} potentially orphaned execution scripts",
            f"Review and archive unused: {', '.join(possibly_orphaned[:5])}", "low")
    print(f"  Execution scripts: {len(exec_scripts)} | Possibly orphaned: {len(possibly_orphaned)}")

def check_gitignore():
    print("[7/7] .gitignore coverage...")
    gitignore = REPO / ".gitignore"
    must_ignore = [".env", "__pycache__", "*.pyc", "node_modules", "*.key",
                   "vps_key", "*.pem", "gcp_tokens.json", "*.log"]
    if gitignore.exists():
        content = gitignore.read_text()
        missing = [p for p in must_ignore if p not in content]
        if missing:
            add("Security", f".gitignore missing patterns: {', '.join(missing)}",
                f"Add to .gitignore: {chr(10).join(missing)}", "high")
    else:
        add("Security", ".gitignore not found", "Create .gitignore immediately — risk of committing secrets", "high")
    print(f"  .gitignore check done")

def save_report():
    report_lines = [
        f"# Weekly Repo Scan — {TODAY}",
        f"**Agents:** @Hugo + @Sam | **Run:** {NOW.strftime('%H:%M UTC')}",
        "",
        f"## Summary: {len(findings)} findings",
        f"High: {sum(1 for f in findings if f['severity']=='high')} | "
        f"Medium: {sum(1 for f in findings if f['severity']=='medium')} | "
        f"Low: {sum(1 for f in findings if f['severity']=='low')}",
        ""
    ]
    for f in findings:
        report_lines += [
            f"### [{f['severity'].upper()}] {f['category']}",
            f"**Issue:** {f['issue']}",
            f"**Fix:** {f['recommendation']}",
            ""
        ]
    report_lines += ["## Action Items", ""]
    for f in [x for x in findings if x['severity'] == 'high']:
        report_lines.append(f"- [ ] [HIGH] {f['recommendation'][:100]}")
    for f in [x for x in findings if x['severity'] == 'medium']:
        report_lines.append(f"- [ ] [MEDIUM] {f['recommendation'][:100]}")

    reports_dir = REPO / "docs" / "audits"
    reports_dir.mkdir(exist_ok=True)
    path = reports_dir / f"repo-scan-{TODAY}.md"
    path.write_text("\n".join(report_lines))

    try:
        subprocess.run(["git", "-C", str(REPO), "add", str(path)], timeout=10)
        subprocess.run(["git", "-C", str(REPO), "commit", "-m", f"audit: weekly repo scan {TODAY}"], timeout=15)
        subprocess.run(["git", "-C", str(REPO), "push", "origin", "main"], timeout=30)
        print(f"Report pushed: {path}")
    except Exception as e:
        print(f"Push error: {e}")

    if SUPABASE_URL and SUPABASE_KEY:
        try:
            data = json.dumps({
                "agent": "hugo",
                "category": "repo_scan",
                "content": json.dumps({"date": TODAY, "findings": findings}, indent=2),
                "tags": ["security", "weekly", "repo-scan"],
            }).encode()
            req = urllib.request.Request(
                SUPABASE_URL + "/rest/v1/learnings",
                data=data,
                headers={"apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY,
                         "Content-Type": "application/json", "Prefer": "return=minimal"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=10) as r:
                print(f"Supabase: {r.status}")
        except Exception as e:
            print(f"Supabase error: {e}")

def main():
    print(f"\n=== WEEKLY REPO SCAN | {TODAY} ===\n")
    check_branches()
    check_commit_cadence()
    check_large_files()
    check_secrets()
    check_dependencies()
    check_orphaned_scripts()
    check_gitignore()
    print(f"\n=== {len(findings)} FINDINGS ===")
    for f in findings:
        print(f"  [{f['severity'].upper()}] {f['category']}: {f['issue'][:60]}")
    print("\nSaving...")
    save_report()
    print("Repo scan complete.")

if __name__ == "__main__":
    main()
