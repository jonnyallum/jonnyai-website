"""
Agent Structure Validator - Ensures all SKILL.md files meet the AgOS 2.0 standard.
Part of the AgOS Auto-Sync System.

Usage:
    python validate_agents.py [--fix] [--verbose]
"""

import os
import sys
import re
from pathlib import Path

# Required sections in AgOS 2.0 SKILL.md format
REQUIRED_SECTIONS = [
    "Profile Card",
    "Personality & Collaboration Style",
    "Core Competencies",
    "Key Workflows",
    "Team Interaction",
    "Performance Metrics",
    "Restrictions",
    "Training Day Skills",
    "Learning Log"
]

# Required profile elements
REQUIRED_PROFILE_ELEMENTS = [
    "Human Name",
    "Nickname",
    "Role",
    "Reports To",
    "Personality",
    "Philosophy"
]

SKILLS_DIR = Path(__file__).parent.parent / ".agent" / "skills"


def validate_skill_file(filepath: Path, verbose: bool = False) -> dict:
    """
    Validate a SKILL.md file against the AgOS 2.0 standard.

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

    # Check for Alias line (new format identifier)
    if '**Alias:**' not in content and 'Alias:' not in content:
        result["issues"].append("Missing Alias line (AgOS 2.0 format)")
        result["valid"] = False

    # Check for required sections
    for section in REQUIRED_SECTIONS:
        # Check for variations of section headers
        patterns = [
            f"## {section}",
            f"## \\d+\\. {section}",  # Numbered sections
            f"### {section}"
        ]
        found = any(re.search(p, content, re.IGNORECASE) for p in patterns)
        if not found:
            result["issues"].append(f"Missing section: {section}")
            result["valid"] = False

    # Check for profile elements in Profile Card
    profile_section = re.search(r'Profile Card.*?(?=##|\Z)', content, re.DOTALL | re.IGNORECASE)
    if profile_section:
        profile_content = profile_section.group(0)
        for element in REQUIRED_PROFILE_ELEMENTS:
            if element not in profile_content:
                result["warnings"].append(f"Profile Card missing: {element}")
    else:
        result["issues"].append("Profile Card section not found or malformed")
        result["valid"] = False

    # Check for Inner Circle
    if "Inner Circle" not in content:
        result["warnings"].append("Missing 'Inner Circle' in Team Interaction")

    # Check for Performance Metrics table
    if "| Metric |" not in content and "| Target |" not in content:
        result["warnings"].append("Performance Metrics may not have proper table format")

    # Check for Learning Log table
    if "| Date |" not in content or "| Learning |" not in content:
        result["warnings"].append("Learning Log may not have proper table format")

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

    # Get all agent directories (exclude methodology)
    for agent_dir in sorted(SKILLS_DIR.iterdir()):
        if agent_dir.is_dir() and agent_dir.name != "methodology":
            skill_file = agent_dir / "SKILL.md"
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
    print("AGENT VALIDATION SUMMARY")
    print("=" * 60)
    print(f"Total agents: {results['total']}")
    print(f"Valid: {len(results['valid'])}")
    print(f"Invalid: {len(results['invalid'])}")
    print(f"With warnings: {len(results['warnings'])}")

    if results['invalid']:
        print("\n--- INVALID AGENTS ---")
        for agent_result in results['invalid']:
            print(f"\n{agent_result['agent']}:")
            for issue in agent_result['issues']:
                print(f"  [ERROR] {issue}")

    if results['warnings']:
        print("\n--- WARNINGS ---")
        for agent_result in results['warnings']:
            print(f"\n{agent_result['agent']}:")
            for warning in agent_result['warnings']:
                print(f"  [WARN] {warning}")

    if not results['invalid']:
        print("\n" + "=" * 60)
        print("ALL AGENTS PASS VALIDATION")
        print("=" * 60)


def main():
    """CLI entry point."""
    verbose = '--verbose' in sys.argv or '-v' in sys.argv

    print("AgOS 2.0 Agent Validator")
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
