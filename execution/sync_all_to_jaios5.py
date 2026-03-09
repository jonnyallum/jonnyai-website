# sync_all_to_jaios5.py
# Overwrites EVERY AGENTS.md / CLAUDE.md / GEMINI.md in this workspace
# with the canonical Jai.OS 5.0 content from JonnyAI_JaiOS_5.0.
# Then commits and pushes everything to GitHub.

import os
import subprocess

WORKSPACE = r"C:\Users\jonny\Desktop\AgOS 3.0 template"
SOURCE    = r"C:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0\AGENTS.md"
TARGETS   = ["AGENTS.md", "CLAUDE.md", "GEMINI.md"]

# ── 1. Read canonical Jai.OS 5.0 content ──────────────────────────────────────
with open(SOURCE, encoding="utf-8") as f:
    CANONICAL = f.read()

headline = [l for l in CANONICAL.splitlines() if l.startswith("> **")][0]
print("=" * 60)
print("JAI.OS 4.0 FULL WORKSPACE SYNC")
print(f"Source: {SOURCE}")
print(f"Version tag: {headline}")
print("=" * 60)

# ── 2. Walk workspace and overwrite all target files ──────────────────────────
updated = []

for root, dirs, files in os.walk(WORKSPACE):
    # Skip .git, node_modules, hidden dirs
    dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']

    for filename in files:
        if filename in TARGETS:
            full_path = os.path.join(root, filename)
            # Read current content to check if already up to date
            with open(full_path, encoding="utf-8", errors="replace") as f:
                current = f.read()

            if "> **Jai.OS 5.0**" in current:
                print(f"  [SKIP] Already Jai.OS 5.0: {full_path.replace(WORKSPACE, '.')}")
                continue

            with open(full_path, "w", encoding="utf-8") as f:
                f.write(CANONICAL)

            rel = full_path.replace(WORKSPACE + "\\", "")
            print(f"  [OK] Updated: {rel}")
            updated.append(rel)

print()
print(f"Updated {len(updated)} files, skipped already-current files.")

if not updated:
    print("Nothing to commit — all files already at Jai.OS 5.0.")
else:
    # ── 3. Git add + commit + push ────────────────────────────────────────────
    print()
    print("Committing to git...")
    os.chdir(WORKSPACE)

    # Add all updated files
    for rel_path in updated:
        subprocess.run(["git", "add", rel_path], check=False)

    commit_msg = f"[Jai.OS 5.0] Purge AgOS 2.0 — sync all AGENTS/CLAUDE/GEMINI across workspace | 2026-02-19"
    r = subprocess.run(["git", "commit", "-m", commit_msg], capture_output=True, text=True)
    if r.returncode == 0:
        print(f"  [OK] Committed: {r.stdout.strip().splitlines()[0]}")
    else:
        print(f"  [WARN] Commit: {r.stdout.strip()} {r.stderr.strip()}")

    print("Pushing to origin main...")
    r = subprocess.run(["git", "push", "origin", "main"], capture_output=True, text=True)
    if r.returncode == 0:
        print("  [OK] Pushed to GitHub main")
    else:
        print(f"  [FAIL] Push: {r.stderr.strip()[:200]}")

print()
print("=" * 60)
print("SYNC COMPLETE")
print("All AGENTS.md / CLAUDE.md / GEMINI.md = Jai.OS 5.0")
print("https://github.com/jonnyallum/Antigravity_Orchestra")
print("=" * 60)
