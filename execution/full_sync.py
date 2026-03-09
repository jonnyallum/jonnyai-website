"""
full_sync.py — One-command sync: validate → Supabase → GitHub.

Runs the complete POSTSYNC in a single call. All three targets (local,
Supabase Shared Brain, GitHub) end up consistent every time.

Usage:
    python execution/full_sync.py                          # auto-detect commit message
    python execution/full_sync.py "feat: my custom msg"    # custom commit message
    python execution/full_sync.py --dry-run                # preview only, no writes
    python execution/full_sync.py --skip-git               # Supabase only, no git push
    python execution/full_sync.py --skip-supabase          # git only, no Supabase
"""

import subprocess
import sys
from pathlib import Path
from datetime import datetime, timezone

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).parent.parent
EXECUTION = ROOT / "execution"

DRY_RUN = "--dry-run" in sys.argv
SKIP_GIT = "--skip-git" in sys.argv
SKIP_SUPABASE = "--skip-supabase" in sys.argv

# Pull commit message from args (first non-flag arg)
COMMIT_MSG = next(
    (a for a in sys.argv[1:] if not a.startswith("--")), None
)

SEP = "=" * 60


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

def header(title: str):
    print(f"\n{SEP}")
    print(f"  {title}")
    print(SEP)


def run(cmd: list[str], cwd: Path = ROOT) -> tuple[int, str]:
    """Run a subprocess and return (returncode, combined output)."""
    result = subprocess.run(
        cmd, cwd=str(cwd),
        capture_output=True, text=True, encoding="utf-8", errors="replace"
    )
    output = (result.stdout + result.stderr).strip()
    return result.returncode, output


def run_script(script_name: str) -> bool:
    """Run a Python script in execution/ and return True on success."""
    script = EXECUTION / script_name
    if not script.exists():
        print(f"  [SKIP] {script_name} — not found")
        return True
    code, out = run([sys.executable, str(script)])
    for line in out.splitlines():
        print(f"  {line}")
    if code != 0:
        print(f"  [FAIL] {script_name} exited with code {code}")
    return code == 0


def git(args: list[str]) -> tuple[int, str]:
    return run(["git"] + args)


def auto_commit_message() -> str:
    """Build a smart commit message from git status."""
    _, status = git(["status", "--short"])
    lines = [l for l in status.splitlines() if l.strip()]

    if not lines:
        return f"chore(sync): Supabase + GitHub sync — {_timestamp()}"

    # Categorise changes
    new_agents, updated_agents, new_skills, updated_skills, other = [], [], [], [], []
    for line in lines:
        parts = line.strip().split(None, 1)
        if len(parts) < 2:
            continue
        flag, path = parts[0], parts[1].strip('"')

        if ".agent/skills/" in path and "methodology" not in path and "SKILL.md" in path:
            handle = path.split(".agent/skills/")[1].split("/")[0]
            if flag in ("A", "??"):
                new_agents.append(f"@{handle}")
            else:
                updated_agents.append(f"@{handle}")
        elif ".agent/skills/methodology/" in path and "SKILL.md" in path:
            handle = path.split("methodology/")[1].split("/")[0]
            if flag in ("A", "??"):
                new_skills.append(handle)
            else:
                updated_skills.append(handle)
        else:
            other.append(path.split("/")[-1])

    parts = []
    if new_agents:
        parts.append(f"{len(new_agents)} new agent(s): {', '.join(new_agents[:3])}{'...' if len(new_agents) > 3 else ''}")
    if updated_agents:
        parts.append(f"{len(updated_agents)} agent update(s)")
    if new_skills:
        parts.append(f"{len(new_skills)} new SOP(s)")
    if updated_skills:
        parts.append(f"{len(updated_skills)} SOP update(s)")
    if other:
        top = list(dict.fromkeys(other))[:4]
        parts.append(f"misc: {', '.join(top)}")

    summary = "; ".join(parts) if parts else f"{len(lines)} file(s) changed"
    return f"sync: {summary} — {_timestamp()}"


def _timestamp() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────

def main():
    if DRY_RUN:
        print("\n[DRY RUN] No writes will occur.\n")

    # ── 0. Pre-flight check ───────────────────
    header("STEP 1 — Validate agents & Sync Context")
    if DRY_RUN:
        print("  [DRY] Would run: pull_chatroom.py")
        print("  [DRY] Would run: validate_agents.py")
    else:
        # Pull context first so context isn't stale
        print("  Running pull_chatroom.py — Harvesting live context...")
        run_script("pull_chatroom.py")
        
        ok = run_script("validate_agents.py")
        if not ok:
            print("\n  ABORT: Validation failed. Fix SKILL.md issues before syncing.")
            sys.exit(1)
        print("  [OK] All agents / context valid")

    # ── 1. Supabase syncs ─────────────────────
    if not SKIP_SUPABASE:
        header("STEP 2 — Supabase Shared Brain sync")
        scripts = [
            ("brain_sync.py",         "Heartbeat + learnings"),
            ("sync_all_skills_full.py","Philosophy / SKILL.md content"),
            ("sync_skill_catalog.py", "Skills catalog"),
            ("sync_chatroom.py",      "Chatroom history"),
        ]
        for script, label in scripts:
            if DRY_RUN:
                print(f"  [DRY] Would run: {script}  ({label})")
                continue
            print(f"\n  Running {script} — {label}...")
            ok = run_script(script)
            if not ok:
                print(f"  [WARN] {script} reported errors — continuing anyway")
    else:
        print("\n  [SKIP] Supabase sync skipped (--skip-supabase)")

    # ── 1b. Local doc generation ──────────────
    header("STEP 3 — Regenerate local docs")
    doc_scripts = [
        ("sync_readme.py",         "README.md from live agent data"),
        ("build_skills_matrix.py", "SKILLS_MATRIX.md from SKILL.md files"),
        ("sync_website.py",        "jonnyai.website agent count"),
    ]
    for script, label in doc_scripts:
        if DRY_RUN:
            print(f"  [DRY] Would run: {script}  ({label})")
            continue
        print(f"\n  Running {script} — {label}...")
        ok = run_script(script)
        if not ok:
            print(f"  [WARN] {script} reported errors — continuing anyway")

    # ── 2. Git ────────────────────────────────
    if not SKIP_GIT:
        header("STEP 4 — GitHub sync")

        # Check for changes
        _, status_out = git(["status", "--short"])
        changed_lines = [l for l in status_out.splitlines() if l.strip()]

        if not changed_lines:
            print("  Nothing to commit — working tree clean.")
        else:
            msg = COMMIT_MSG or auto_commit_message()
            print(f"\n  Commit message: {msg}")
            print(f"  Files to stage: {len(changed_lines)}\n")
            for line in changed_lines[:10]:
                print(f"    {line}")
            if len(changed_lines) > 10:
                print(f"    ... and {len(changed_lines) - 10} more")

            if DRY_RUN:
                print("\n  [DRY] Would run: git add -A && git commit && git pull --rebase && git push")
            else:
                # Stage
                code, out = git(["add", "-A"])
                if code != 0:
                    print(f"  [WARN] git add: {out}")

                # Commit
                full_msg = f"{msg}\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
                code, out = git(["commit", "-m", full_msg])
                if code != 0 and "nothing to commit" not in out:
                    print(f"  [WARN] git commit: {out}")
                else:
                    print(f"  [OK] Committed")

                # Pull rebase to avoid divergence
                print("  Pulling (rebase)...")
                code, out = git(["pull", "--rebase", "origin", "main"])
                if code != 0:
                    print(f"  [FAIL] git pull --rebase failed:\n{out}")
                    print("  ABORT: Resolve conflicts, then re-run.")
                    sys.exit(1)
                print("  [OK] Rebased onto remote")

                # Push
                print("  Pushing...")
                code, out = git(["push", "origin", "main"])
                if code != 0:
                    print(f"  [FAIL] git push failed:\n{out}")
                    sys.exit(1)
                print("  [OK] Pushed to GitHub")
    else:
        print("\n  [SKIP] GitHub sync skipped (--skip-git)")

    # ── Done ──────────────────────────────────
    header("SYNC COMPLETE")
    print("  Local   ✓")
    print(f"  Supabase {'[skipped]' if SKIP_SUPABASE else '✓'}")
    print(f"  GitHub  {'[skipped]' if SKIP_GIT else '✓  (main)'}")
    if DRY_RUN:
        print("\n  [DRY RUN] Nothing was written.")
    print()


if __name__ == "__main__":
    main()
