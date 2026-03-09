"""
Agent Structure Validator - Ensures all SKILL.md files meet the Jai.OS 5.0 standard.
Part of the Jai.OS Auto-Sync System.

Usage:
    python validate_agents.py [--verbose]
"""

import os
import sys
import re
from pathlib import Path

# Required sections in Jai.OS 5.0 SKILL.md format (based on perfect_agent_template.md v2.0)
REQUIRED_SECTIONS = [
    "The Creed",
    "Identity",
    "Personality",
    "Capabilities",
    "Standard Operating Procedures",
    "Collaboration",
    "Feedback Loop",
    "Performance Metrics",
    "Restrictions",
    "Learning Log",
    "Tools & Resources",
    "Failure Modes & Recovery",
    "Self-Evolution Protocol",
]

SKILLS_DIR = Path(__file__).parent.parent / ".agent" / "skills"


def validate_skill_file(filepath: Path, verbose: bool = False) -> dict:
    """
    Validate a SKILL.md file against the Jai.OS 5.0 standard.

    Args:
        filepath: Path to the SKILL.md file
        verbose: Whether to print detailed output

    Returns:
        Dict with validation results
    """
    result = {
        "file": str(filepath),
        "valid": True,
        "issues": [],
        "warnings": []
    }

    if not filepath.exists():
        result["valid"] = False
        result["issues"].append(f"File not found: {filepath}")
        return result

    try:
        content = filepath.read_text(encoding='utf-8')
    except Exception as e:
        result["valid"] = False
        result["issues"].append(f"Could not read file: {e}")
        return result

    # Check for YAML Frontmatter (Claude Skills Standard)
    if content.startswith('---'):
        yaml_end = content.find('---', 3)
        if yaml_end == -1:
            result["issues"].append("Incomplete YAML frontmatter (missing closing ---)")
            result["valid"] = False
        else:
            yaml_content = content[3:yaml_end]
            if "name:" not in yaml_content:
                result["warnings"].append("YAML frontmatter missing 'name' field")
            if "description:" not in yaml_content:
                result["warnings"].append("YAML frontmatter missing 'description' field")
    else:
        result["warnings"].append("Missing YAML frontmatter (Claude Skills Standard)")

    # Check for Human Name Profile Header (H1)
    if not re.search(r'^#\s+.*-.*Agent Profile', content, re.MULTILINE | re.IGNORECASE):
        result["warnings"].append("Missing profile header: '# [Human Name] - Agent Profile'")

    # Check for Philosophy Quote (supports both > "Quote" and > _"Quote"_ italic format)
    if not re.search(r'>\s*_?".*"_?', content):
        result["warnings"].append("Missing Philosophy Quote block (e.g. > \"Quote\")")

    # Check for Required Sections
    for section in REQUIRED_SECTIONS:
        # Check for H2 headers
        pattern = f"## {section}"
        if not re.search(re.escape(pattern), content, re.IGNORECASE):
            result["issues"].append(f"Missing section: {section}")
            result["valid"] = False

    # Check for table structures in key sections (flexible — matches padded columns)
    if "## Identity" in content and not re.search(r'\|\s*Attribute\s*\|', content):
        result["warnings"].append("Identity section missing table structure")

    if "## Capabilities" in content:
        if "### Can Do ✅" not in content:
            result["warnings"].append("Capabilities missing 'Can Do' subsection")
        if "### Cannot Do ❌" not in content:
            result["warnings"].append("Capabilities missing 'Cannot Do' subsection")
        if "### Specializations 🎯" not in content:
             result["warnings"].append("Capabilities missing 'Specializations' subsection")

    if "## Performance Metrics" in content and not re.search(r'\|\s*Metric\s*\|', content):
        result["warnings"].append("Performance Metrics missing table structure")

    if "## Learning Log" in content and not re.search(r'\|\s*Date\s*\|', content):
        result["warnings"].append("Learning Log missing table structure")

    if verbose:
        print(f"\n{'=' * 60}")
        print(f"File: {filepath}")
        print(f"Valid: {result['valid']}")
        if result['issues']:
            print("Issues:")
            for issue in result['issues']:
                print(f"  - {issue}")
        if result['warnings']:
            print("Warnings:")
            for warning in result['warnings']:
                print(f"  - {warning}")

    return result


def validate_all_agents(verbose: bool = False) -> dict:
    """
    Validate all agent SKILL.md files.

    Args:
        verbose: Whether to print detailed output

    Returns:
        Dict with validation results for all agents
    """
    results = {
        "valid": [],
        "invalid": [],
        "warnings": [],
        "total": 0
    }

    if not SKILLS_DIR.exists():
        print(f"Skills directory not found: {SKILLS_DIR}")
        sys.exit(1)

    # Get all agent directories (exclude methodology + non-roster internal agents)
    for agent_dir in sorted(SKILLS_DIR.iterdir()):
        if agent_dir.is_dir() and agent_dir.name not in {"methodology"}:
            skill_file = agent_dir / "SKILL.md"
            if not skill_file.exists():
                 # Try lowercase skill.md or other variations if needed, but strict is checking SKILL.md
                 pass
            
            # If SKILL.md exists, validate it
            if skill_file.exists():
                result = validate_skill_file(skill_file, verbose)
                results["total"] += 1

                if result["valid"]:
                    results["valid"].append(agent_dir.name)
                else:
                    results["invalid"].append({
                        "agent": agent_dir.name,
                        "issues": result["issues"]
                    })

                if result["warnings"]:
                    results["warnings"].append({
                        "agent": agent_dir.name,
                        "warnings": result["warnings"]
                    })

    return results


def print_summary(results: dict):
    """Print a summary of validation results."""
    print("\n" + "=" * 60)
    print("Jai.OS 5.0 AGENT VALIDATION SUMMARY")
    print("=" * 60)
    print(f"Total agents checked: {results['total']}")
    print(f"Valid (Jai.OS 5.0 Complaint): {len(results['valid'])}")
    print(f"Invalid (Needs Upgrade): {len(results['invalid'])}")
    print(f"With warnings: {len(results['warnings'])}")

    if results['invalid']:
        print("\n--- INVALID AGENTS (Missing Sections) ---")
        for agent_result in results['invalid']:
            print(f"\n@{agent_result['agent']}:")
            for issue in agent_result['issues']:
                print(f"  [MISSING] {issue}")

    if results['warnings']:
        print("\n--- WARNINGS (Styling/Formatting) ---")
        for agent_result in results['warnings']:
            print(f"\n@{agent_result['agent']}:")
            for warning in agent_result['warnings']:
                print(f"  [WARN] {warning}")

    if not results['invalid']:
        print("\n" + "=" * 60)
        print("ALL AGENTS PASS Jai.OS 5.0 VALIDATION")
        print("=" * 60)


def main():
    """CLI entry point."""
    verbose = '--verbose' in sys.argv or '-v' in sys.argv

    print("Jai.OS 5.0 Agent Validator")
    print(f"Scanning: {SKILLS_DIR}")

    results = validate_all_agents(verbose)
    print_summary(results)

    # Exit with error code if any invalid
    if results['invalid']:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
