"""
push_docs_to_github.py
Pushes all key doc files to GitHub main branch via gh CLI.
Replaces AgOS 2.0 content with Jai.OS 5.0.
"""
import subprocess
import base64
import json
import os

REPO = "jonnyallum/Antigravity_Orchestra"

FILES = [
    "AGENTS.md",
    "CLAUDE.md",
    "GEMINI.md",
    "WORKSPACE_OVERVIEW.md",
    "README.md",
]

def get_sha(path):
    r = subprocess.run(
        ["gh", "api", f"repos/{REPO}/contents/{path}", "--jq", ".sha"],
        capture_output=True, text=True
    )
    sha = r.stdout.strip()
    return sha if sha and r.returncode == 0 else None

def push_file(local_path, remote_path):
    if not os.path.exists(local_path):
        print(f"  [SKIP] {local_path} — not found locally")
        return

    with open(local_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    sha = get_sha(remote_path)
    if not sha:
        print(f"  [WARN] No SHA for {remote_path} — will try to create")

    encoded = base64.b64encode(content.encode("utf-8")).decode("ascii")

    payload = {
        "message": f"[Jai.OS 5.0] Sync {remote_path} — purge AgOS 2.0 refs | 2026-02-19",
        "content": encoded,
    }
    if sha:
        payload["sha"] = sha

    payload_json = json.dumps(payload)

    r = subprocess.run(
        ["gh", "api", f"repos/{REPO}/contents/{remote_path}",
         "--method", "PUT",
         "--input", "-"],
        input=payload_json,
        capture_output=True,
        text=True
    )

    if r.returncode == 0:
        size_kb = len(content.encode()) / 1024
        print(f"  [OK] {remote_path} ({size_kb:.1f}KB pushed)")
    else:
        print(f"  [FAIL] {remote_path}: {r.stderr[:150]}")

print("=" * 55)
print("PUSHING DOC FILES TO GITHUB MAIN")
print(f"Repo: {REPO}")
print("=" * 55)

for filename in FILES:
    push_file(filename, filename)

print()
print("Done. Check: https://github.com/jonnyallum/Antigravity_Orchestra")
