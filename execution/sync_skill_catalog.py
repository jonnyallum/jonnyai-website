"""
sync_skill_catalog.py — Parse SKILL_CATALOG.md and upsert all skills to Supabase.

Reads .agent/library/SKILL_CATALOG.md, parses the skill registry tables,
and upserts every skill entry into the Supabase `skills` table. Also flags
which skills have a corresponding methodology SOP SKILL.md on disk.

Usage:
    python execution/sync_skill_catalog.py
"""

import os
import re
import sys
from pathlib import Path
from datetime import datetime, timezone

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import psycopg2
from dotenv import load_dotenv

load_dotenv()

ROOT_DIR = Path(__file__).parent.parent
CATALOG_FILE = ROOT_DIR / ".agent" / "library" / "SKILL_CATALOG.md"
METHODOLOGY_DIR = ROOT_DIR / ".agent" / "skills" / "methodology"
CONNECTION_STRING = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")

# Section header -> catalog_section value
SECTION_MAP = {
    "Development Skills": "Development",
    "Intelligence & Research Skills": "Intelligence",
    "Operations & Automation Skills": "Operations",
    "Marketing & Growth Skills": "Marketing",
    "Design Skills": "Design",
    "Betting & Sports Skills": "Betting",
    "BI & Dashboard Skills": "BI",
    "Education & Course Design Skills": "Education",
    "Client Success Skills": "Client Success",
}

# Regex: parse table rows  | `skill-handle` | Domain | Description | @owner1, @owner2 |
ROW_RE = re.compile(r"^\|\s*`([\w\-]+)`\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|")


def parse_owners(raw: str) -> list[str]:
    """Extract agent handles from a cell like '@priya, @sebastian'."""
    return [h.strip().lstrip("@") for h in re.findall(r"@([\w\-]+)", raw)]


def parse_catalog(filepath: Path) -> list[dict]:
    """Parse the SKILL_CATALOG.md skill registry tables into a list of dicts."""
    lines = filepath.read_text(encoding="utf-8", errors="ignore").splitlines()

    skills = []
    current_section = "General"

    for line in lines:
        # Detect section headers like "### Development Skills"
        sec_match = re.match(r"^###\s+(.+)", line.strip())
        if sec_match:
            title = sec_match.group(1).strip()
            current_section = SECTION_MAP.get(title, current_section)
            continue

        row = ROW_RE.match(line)
        if row:
            handle, domain, description, owners_raw = (
                row.group(1).strip(),
                row.group(2).strip(),
                row.group(3).strip(),
                row.group(4).strip(),
            )
            if handle in ("Skill Handle", "skill-handle"):
                continue  # skip header rows
            owners = parse_owners(owners_raw)
            sop_path = METHODOLOGY_DIR / handle / "SKILL.md"
            skills.append({
                "id": handle,
                "domain": domain,
                "catalog_section": current_section,
                "description": description,
                "owned_by": owners,
                "has_sop": sop_path.exists(),
                "sop_path": f".agent/skills/methodology/{handle}/SKILL.md" if sop_path.exists() else None,
            })

    return skills


def upsert_skills(skills: list[dict]) -> tuple[int, int]:
    """Upsert skills to Supabase. Returns (upserted, unchanged)."""
    conn = psycopg2.connect(CONNECTION_STRING)
    cur = conn.cursor()
    now = datetime.now(timezone.utc).isoformat()

    upserted = 0
    for skill in skills:
        cur.execute(
            """
            INSERT INTO skills (id, domain, catalog_section, description, owned_by,
                                has_sop, sop_path, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                domain         = EXCLUDED.domain,
                catalog_section = EXCLUDED.catalog_section,
                description    = EXCLUDED.description,
                owned_by       = EXCLUDED.owned_by,
                has_sop        = EXCLUDED.has_sop,
                sop_path       = EXCLUDED.sop_path,
                updated_at     = EXCLUDED.updated_at;
            """,
            (
                skill["id"],
                skill["domain"],
                skill["catalog_section"],
                skill["description"],
                skill["owned_by"],
                skill["has_sop"],
                skill["sop_path"],
                now,
            ),
        )
        upserted += 1

    conn.commit()
    cur.close()
    conn.close()
    return upserted


def main():
    print("=" * 60)
    print("SKILL CATALOG SYNC — Supabase Shared Brain")
    print("=" * 60)

    if not CATALOG_FILE.exists():
        print(f"ERROR: {CATALOG_FILE} not found.")
        sys.exit(1)

    if not CONNECTION_STRING:
        print("ERROR: ANTIGRAVITY_BRAIN_CONNECTION_STRING not set in .env")
        sys.exit(1)

    print(f"\nParsing {CATALOG_FILE.name}...")
    skills = parse_catalog(CATALOG_FILE)
    with_sop = sum(1 for s in skills if s["has_sop"])
    print(f"  Found {len(skills)} skills ({with_sop} have methodology SOP on disk)")

    # Purge orphaned rows not in the current catalog
    current_ids = {s["id"] for s in skills}
    conn = psycopg2.connect(CONNECTION_STRING)
    cur = conn.cursor()
    cur.execute("SELECT id FROM skills;")
    db_ids = {row[0] for row in cur.fetchall()}
    orphans = db_ids - current_ids
    if orphans:
        print(f"\nPurging {len(orphans)} orphaned skills from Supabase...")
        for oid in sorted(orphans):
            cur.execute("DELETE FROM skills WHERE id = %s;", (oid,))
            print(f"  [DEL] {oid}")
        conn.commit()
    else:
        print("\nNo orphaned skills found.")
    cur.close()
    conn.close()

    print("\nUpserting to Supabase skills table...")
    count = upsert_skills(skills)
    print(f"  OK Upserted: {count} skills")

    print("\nSkill catalog is now in the Shared Brain.")
    print("Query with: SELECT * FROM skills WHERE domain = 'AI Engineering';")


if __name__ == "__main__":
    main()
