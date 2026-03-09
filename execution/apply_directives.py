"""
Apply the 4 new Jai.OS 5.0 directives to all agent SKILL.md files.
Injects: Permissions reference, Metrics reference, Artifact Standards reference, Emergency Protocol reference.
Idempotent — skips agents that already have the section.
"""
import os
from pathlib import Path

ROOT = Path(r"C:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0")
SKILLS_DIR = ROOT / ".agent" / "skills"
SKIP_DIRS = {"methodology"}

# The section to inject before the final footer line
DIRECTIVE_BLOCK = """
## 📜 Governing Directives

This agent operates under the following Jai.OS 5.0 directives:

| Directive | Path | Summary |
|:----------|:-----|:--------|
| **Permissions** | `directives/agent_permissions.md` | Read/Write/Execute/Forbidden boundaries per tier |
| **Performance Metrics** | `directives/agent_metrics.md` | Universal + tier-specific KPIs, review cadence |
| **Artifact Standards** | `directives/artifact_standards.md` | Typed outputs, verification checklist, anti-patterns |
| **Emergency Protocols** | `directives/emergency_protocols.md` | Severity levels, halt conditions, rollback procedures |
| **Inter-AI Communication** | `directives/inter_ai_communication.md` | Deterministic State Packets, NEXT_HOP routing |

All agents MUST read these directives before their first mission.
"""

MARKER = "## 📜 Governing Directives"

def inject_directives():
    print("=== Jai.OS 5.0 Directive Injection ===\n")
    updated = 0
    skipped = 0
    
    for agent_dir in sorted(SKILLS_DIR.iterdir()):
        if not agent_dir.is_dir() or agent_dir.name in SKIP_DIRS:
            continue
        
        skill_file = agent_dir / "SKILL.md"
        if not skill_file.exists():
            continue
        
        content = skill_file.read_text(encoding="utf-8")
        handle = agent_dir.name
        
        # Check if already injected
        if MARKER in content:
            print(f"  [SKIP] @{handle:18} already has directives section")
            skipped += 1
            continue
        
        # Find the footer line to inject before it
        footer_marker = "_Jai.OS 5.0"
        if footer_marker in content:
            # Insert before the footer
            parts = content.rsplit(footer_marker, 1)
            new_content = parts[0].rstrip() + "\n\n" + DIRECTIVE_BLOCK.strip() + "\n\n---\n\n" + footer_marker + parts[1]
        else:
            # Just append at the end
            new_content = content.rstrip() + "\n\n---\n\n" + DIRECTIVE_BLOCK.strip() + "\n"
        
        skill_file.write_text(new_content, encoding="utf-8")
        updated += 1
        print(f"  [OK]   @{handle:18} directives injected")
    
    print(f"\nDONE: {updated} agents updated, {skipped} already had directives.")

if __name__ == "__main__":
    inject_directives()
