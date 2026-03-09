"""
feedback_engine.py — @watcher Skill Gap Detection Engine
=========================================================
Jai.OS 5.0 | Scans all agent SKILL.md files and reports structural gaps.

Usage:
    python execution/feedback_engine.py gaps       # Output JSON skill gap report
    python execution/feedback_engine.py validate   # Validate all agents
"""
import os
import sys
import json
import glob
from pathlib import Path

SKILLS_DIR = Path(__file__).parent.parent / ".agent" / "skills"

REQUIRED_SECTIONS = [
    "## Identity",
    "## Core Capabilities",
    "## SOP",
    "## Inner Circle",
    "## Governance",
]

def scan_gaps():
    gaps = []
    agents_scanned = 0
    agents_clean = 0

    skill_files = list(SKILLS_DIR.glob("*/SKILL.md"))
    if not skill_files:
        return {"error": "No SKILL.md files found", "agents_scanned": 0, "gaps": []}

    for skill_file in sorted(skill_files):
        agent_handle = skill_file.parent.name
        agents_scanned += 1
        try:
            content = skill_file.read_text(encoding="utf-8", errors="ignore")
        except Exception as e:
            gaps.append({"agent": agent_handle, "issue": f"Read error: {e}", "severity": "HIGH"})
            continue

        missing = []
        for section in REQUIRED_SECTIONS:
            if section not in content:
                missing.append(section)

        if "Pending initialization" in content:
            gaps.append({
                "agent": agent_handle,
                "issue": "Contains placeholder text (Pending initialization)",
                "severity": "MEDIUM",
                "missing_sections": missing
            })
        elif missing:
            gaps.append({
                "agent": agent_handle,
                "issue": f"Missing {len(missing)} required section(s)",
                "severity": "LOW",
                "missing_sections": missing
            })
        else:
            agents_clean += 1

    return {
        "agents_scanned": agents_scanned,
        "agents_clean": agents_clean,
        "agents_with_gaps": len(gaps),
        "gap_rate_pct": round(len(gaps) / agents_scanned * 100, 1) if agents_scanned else 0,
        "gaps": gaps
    }


if __name__ == "__main__":
    command = sys.argv[1] if len(sys.argv) > 1 else "gaps"

    if command in ("gaps", "validate"):
        report = scan_gaps()
        print(json.dumps(report, indent=2))
        if command == "validate" and report.get("agents_with_gaps", 0) > 0:
            sys.exit(1)
    else:
        print(json.dumps({"error": f"Unknown command: {command}"}))
        sys.exit(1)
