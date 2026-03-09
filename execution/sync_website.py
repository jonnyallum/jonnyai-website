"""
sync_website.py — Sync live agent count + stats to jonnyai.website.

Counts agents from the live .agent/skills roster and patches the hardcoded
marketing numbers in the website source files so they never go stale.

Updates:
  - src/app/page.tsx      — hero metric ('X+', 'Specialists'), benefits list, workforce section
  - src/app/layout.tsx    — SEO metadata description

Usage:
    python execution/sync_website.py              # auto-detect website path
    python execution/sync_website.py --dry-run    # show what would change, no writes
    python execution/sync_website.py --path /path/to/jonnyai.website
"""

import sys
import re
import argparse
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).parent.parent
SKILLS_DIR = ROOT / ".agent" / "skills"

# Default website location (relative to this repo's parent)
DEFAULT_WEBSITE = ROOT.parent / "Jonny AI" / "Clients" / "jonnyai.website"

# Fallback: try one folder up from ROOT
WEBSITE_SEARCH_PATHS = [
    DEFAULT_WEBSITE,
    ROOT.parent / "jonnyai.website",
    Path("C:/Users/jonny/Desktop/Jonny AI/Clients/jonnyai.website"),
]


def count_agents() -> int:
    """Count valid agent directories (exclude methodology)."""
    count = 0
    for d in SKILLS_DIR.iterdir():
        if d.is_dir() and d.name not in {"methodology"} and (d / "SKILL.md").exists():
            count += 1
    return count


def find_website(path_override: str = None) -> Path | None:
    """Locate the jonnyai.website directory."""
    if path_override:
        p = Path(path_override)
        return p if p.exists() else None
    for p in WEBSITE_SEARCH_PATHS:
        if p.exists():
            return p
    return None


def patch_file(filepath: Path, replacements: list[tuple[str, str]], dry_run: bool) -> int:
    """Apply string replacements to a file. Returns count of changes made."""
    content = filepath.read_text(encoding="utf-8", errors="ignore")
    original = content
    changes = 0

    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            changes += 1
            print(f"    {'[DRY] ' if dry_run else ''}  {repr(old)} → {repr(new)}")
        else:
            print(f"    [SKIP] Pattern not found: {repr(old[:60])}")

    if changes and not dry_run:
        filepath.write_text(content, encoding="utf-8")

    return changes


def sync_page_tsx(website: Path, agent_count: int, dry_run: bool) -> int:
    """Update agent count references in page.tsx."""
    filepath = website / "app" / "page.tsx"
    if not filepath.exists():
        print(f"  [SKIP] page.tsx not found at {filepath}")
        return 0

    count_str = f"{agent_count}+"

    # Read current content to detect existing count (could be 40+, 63+, etc.)
    content = filepath.read_text(encoding="utf-8", errors="ignore")

    # Find the current count in the metrics array pattern ['XX+', 'Specialists']
    current_m = re.search(r"\['(\d+\+)', 'Specialists'\]", content)
    current_count = current_m.group(1) if current_m else "40+"

    if current_count == count_str:
        print(f"  [OK] page.tsx already shows {count_str} — no changes needed")
        return 0

    print(f"  Patching page.tsx: {current_count} → {count_str}")

    replacements = [
        # Hero metrics array
        (f"['{current_count}', 'Specialists']", f"['{count_str}', 'Specialists']"),
        # Benefits list
        (f"{current_count} specialist agents on your project now",
         f"{count_str} specialist agents on your project now"),
        # Workforce section description
        (f"{current_count} specialist agents. Hired, trained, and deployed by Jonny.",
         f"{count_str} specialist agents. Hired, trained, and deployed by Jonny."),
    ]

    return patch_file(filepath, replacements, dry_run)


def sync_layout_tsx(website: Path, agent_count: int, dry_run: bool) -> int:
    """Update agent count in layout.tsx SEO metadata."""
    filepath = website / "app" / "layout.tsx"
    if not filepath.exists():
        print(f"  [SKIP] layout.tsx not found at {filepath}")
        return 0

    content = filepath.read_text(encoding="utf-8", errors="ignore")
    count_str = f"{agent_count}+"

    # Find current count in metadata description
    meta_m = re.search(r"(\d+)\+ specialist agents", content)
    current_count = f"{meta_m.group(1)}+" if meta_m else "40+"

    if current_count == count_str:
        print(f"  [OK] layout.tsx already shows {count_str} — no changes needed")
        return 0

    print(f"  Patching layout.tsx: {current_count} → {count_str}")

    replacements = [
        (f"{current_count} specialist agents",
         f"{count_str} specialist agents"),
    ]

    return patch_file(filepath, replacements, dry_run)


def main():
    parser = argparse.ArgumentParser(description="Sync agent count to jonnyai.website")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing")
    parser.add_argument("--path", default=None, help="Override website directory path")
    args = parser.parse_args()

    dry_run = args.dry_run

    # Count agents
    agent_count = count_agents()
    print(f"  Live agent count: {agent_count}")

    # Find website
    website = find_website(args.path)
    if not website:
        print(f"  [SKIP] jonnyai.website not found. Tried:")
        for p in WEBSITE_SEARCH_PATHS:
            print(f"    {p}")
        print("  Run with --path /path/to/jonnyai.website to specify location.")
        return

    print(f"  Website path: {website}")
    print()

    total_changes = 0
    total_changes += sync_page_tsx(website, agent_count, dry_run)
    total_changes += sync_layout_tsx(website, agent_count, dry_run)

    print()
    if total_changes:
        status = "[DRY] Would update" if dry_run else "[OK] Updated"
        print(f"  {status} {total_changes} location(s) to {agent_count}+ agents")
        if not dry_run:
            print("  NOTE: Deploy jonnyai.website separately (Vercel auto-deploys on git push).")
    else:
        print("  [OK] Website already up to date — no changes needed")


if __name__ == "__main__":
    main()
