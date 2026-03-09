"""
Inter-AI Message Validator - Ensures message format compliance.
Part of the AgOS 2.0 Feedback Loop System.

Validates messages in .tmp/message4*.md files to ensure they follow
the standardized handoff protocol for cross-platform AI communication.

Usage:
    python inter_ai_validator.py validate <file_path>
    python inter_ai_validator.py validate-all
    python inter_ai_validator.py create <target_ai> [--from=SOURCE] [--status=STATUS]
    python inter_ai_validator.py list-pending
"""

import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

# Directory structure
ROOT_DIR = Path(__file__).parent.parent
TMP_DIR = ROOT_DIR / ".tmp"
MEMORY_DIR = ROOT_DIR / ".agent" / "memory"
VALIDATION_LOG = MEMORY_DIR / "message-validation.json"

# Valid AI targets
VALID_AIS = ["claude", "antigravity", "gemini", "copilot", "cursor"]

# Required sections for a valid handoff message
REQUIRED_SECTIONS = {
    "header": r"^#\s+.*(?:Handover|Handoff|Message|Brief|Update)",
    "from": r"\*\*From:\*\*\s+\w+",
    "to": r"\*\*To:\*\*\s+\w+",
    "status": r"\*\*Status:\*\*\s+\w+",
    "timestamp": r"\*\*Timestamp:\*\*\s+\d{4}-\d{2}-\d{2}",
}

# Optional but recommended sections
RECOMMENDED_SECTIONS = {
    "summary": r"##\s+.*(?:Summary|Executive Summary|Overview)",
    "action_items": r"##\s+.*(?:Action|Tasks|Next Steps|TODO)",
    "context": r"##\s+.*(?:Context|Background|Details)",
}

# Status levels
VALID_STATUSES = [
    "MISSION URGENT",
    "PRIORITY",
    "NORMAL",
    "INFO",
    "COMPLETE",
    "BLOCKED",
    "WAITING",
]


def ensure_directories():
    """Create necessary directories if they don't exist."""
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)


def validate_message(file_path: Path) -> dict:
    """
    Validate a single inter-AI message file.

    Args:
        file_path: Path to the message file

    Returns:
        Validation result dict with status, errors, and warnings
    """
    result = {
        "file": str(file_path),
        "valid": True,
        "errors": [],
        "warnings": [],
        "metadata": {},
        "validated_at": datetime.now().isoformat(),
    }

    if not file_path.exists():
        result["valid"] = False
        result["errors"].append(f"File not found: {file_path}")
        return result

    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        result["valid"] = False
        result["errors"].append(f"Failed to read file: {e}")
        return result

    # Check required sections
    for section_name, pattern in REQUIRED_SECTIONS.items():
        if not re.search(pattern, content, re.MULTILINE | re.IGNORECASE):
            result["valid"] = False
            result["errors"].append(f"Missing required section: {section_name}")

    # Check recommended sections
    for section_name, pattern in RECOMMENDED_SECTIONS.items():
        if not re.search(pattern, content, re.MULTILINE | re.IGNORECASE):
            result["warnings"].append(f"Missing recommended section: {section_name}")

    # Extract metadata
    from_match = re.search(r"\*\*From:\*\*\s+(\w+)", content)
    to_match = re.search(r"\*\*To:\*\*\s+(\w+)", content)
    status_match = re.search(r"\*\*Status:\*\*\s+(.+?)(?:\n|\*\*)", content)
    timestamp_match = re.search(
        r"\*\*Timestamp:\*\*\s+(\d{4}-\d{2}-\d{2}T[\d:]+Z?)", content
    )

    if from_match:
        result["metadata"]["from"] = from_match.group(1)
    if to_match:
        result["metadata"]["to"] = to_match.group(1)
    if status_match:
        result["metadata"]["status"] = status_match.group(1).strip()
    if timestamp_match:
        result["metadata"]["timestamp"] = timestamp_match.group(1)

    # Validate target AI name
    file_target = file_path.stem.replace("message4", "").lower()
    if file_target not in VALID_AIS:
        result["warnings"].append(
            f"Unknown target AI in filename: {file_target}. "
            f"Valid targets: {', '.join(VALID_AIS)}"
        )

    # Check for stale messages (older than 24 hours)
    if timestamp_match:
        try:
            msg_time = datetime.fromisoformat(
                timestamp_match.group(1).replace("Z", "+00:00")
            )
            age_hours = (
                datetime.now(msg_time.tzinfo) - msg_time
            ).total_seconds() / 3600
            if age_hours > 24:
                result["warnings"].append(
                    f"Message is {int(age_hours)} hours old - may be stale"
                )
        except:
            pass

    # Check message length
    if len(content) < 100:
        result["warnings"].append("Message seems too short for a proper handoff")
    elif len(content) > 10000:
        result["warnings"].append(
            "Message is very long - consider splitting into sections"
        )

    return result


def validate_all_messages() -> list:
    """
    Validate all inter-AI message files in .tmp directory.

    Returns:
        List of validation results
    """
    ensure_directories()
    results = []

    for msg_file in TMP_DIR.glob("message4*.md"):
        result = validate_message(msg_file)
        results.append(result)

    # Save validation log
    log_data = {
        "validated_at": datetime.now().isoformat(),
        "total_files": len(results),
        "valid_count": sum(1 for r in results if r["valid"]),
        "results": results,
    }

    with open(VALIDATION_LOG, "w", encoding="utf-8") as f:
        json.dump(log_data, f, indent=2)

    return results


def create_message_template(
    target_ai: str,
    from_ai: str = "claude",
    status: str = "NORMAL",
    title: str = "Handover",
) -> str:
    """
    Create a properly formatted inter-AI message template.

    Args:
        target_ai: Target AI (claude, antigravity, gemini)
        from_ai: Source AI
        status: Message status/priority
        title: Message title

    Returns:
        Formatted message template
    """
    timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")

    template = f"""# 🤖 AgOS 2.0 {title} | {target_ai.upper()}
**From:** {from_ai.capitalize()} (Claude Code Instance)
**To:** {target_ai.capitalize()} (Target Instance)
**Status:** {status}
**Timestamp:** {timestamp}

---

## 📋 Executive Summary
[Brief summary of the handover purpose]

---

## 🎯 Action Items
1. [ ] First action item
2. [ ] Second action item
3. [ ] Third action item

---

## 📝 Context
[Relevant background information]

### Current State
- Item 1
- Item 2

### Blockers/Issues
- None currently

---

## 📎 References
- [Reference 1](path/to/file)
- [Reference 2](path/to/file)

---

**\"Collaboration is the key to success.\"**
— The AgOS Team
"""
    return template


def list_pending_messages() -> list:
    """
    List all pending inter-AI messages that haven't been acknowledged.

    Returns:
        List of pending message info
    """
    ensure_directories()
    pending = []

    for msg_file in TMP_DIR.glob("message4*.md"):
        try:
            content = msg_file.read_text(encoding="utf-8")

            # Check if message has been marked as read/acknowledged
            if "**Acknowledged:**" in content or "**Read:**" in content:
                continue

            # Extract metadata
            target = msg_file.stem.replace("message4", "")
            status_match = re.search(r"\*\*Status:\*\*\s+(.+?)(?:\n|\*\*)", content)
            timestamp_match = re.search(
                r"\*\*Timestamp:\*\*\s+(\d{4}-\d{2}-\d{2}T[\d:]+Z?)", content
            )

            pending.append(
                {
                    "file": str(msg_file),
                    "target": target,
                    "status": status_match.group(1).strip() if status_match else "UNKNOWN",
                    "timestamp": timestamp_match.group(1) if timestamp_match else "UNKNOWN",
                }
            )
        except Exception as e:
            print(f"Error reading {msg_file}: {e}")

    return pending


def log_message_event(
    file_path: str,
    event_type: str,
    details: dict = None
):
    """
    Log a message-related event for tracking.

    Args:
        file_path: Path to the message file
        event_type: Type of event (created, validated, read, acknowledged)
        details: Additional event details
    """
    ensure_directories()

    # Load existing log
    log_file = MEMORY_DIR / "message-events.json"
    if log_file.exists():
        with open(log_file, "r", encoding="utf-8") as f:
            log = json.load(f)
    else:
        log = {"events": []}

    # Add event
    event = {
        "timestamp": datetime.now().isoformat(),
        "file": file_path,
        "type": event_type,
        "details": details or {},
    }
    log["events"].append(event)

    # Keep only last 500 events
    if len(log["events"]) > 500:
        log["events"] = log["events"][-500:]

    # Save
    with open(log_file, "w", encoding="utf-8") as f:
        json.dump(log, f, indent=2)


def main():
    """CLI entry point."""
    if len(sys.argv) < 2:
        print("""
Inter-AI Message Validator - AgOS 2.0

Usage:
    python inter_ai_validator.py validate <file_path>
    python inter_ai_validator.py validate-all
    python inter_ai_validator.py create <target_ai> [--from=SOURCE] [--status=STATUS]
    python inter_ai_validator.py list-pending

Commands:
    validate      Validate a single message file
    validate-all  Validate all message files in .tmp/
    create        Create a new message template
    list-pending  List unacknowledged messages

Examples:
    python inter_ai_validator.py validate .tmp/message4antigravity.md
    python inter_ai_validator.py create antigravity --status="MISSION URGENT"
    python inter_ai_validator.py list-pending
        """)
        sys.exit(1)

    command = sys.argv[1]

    if command == "validate":
        if len(sys.argv) < 3:
            print("Usage: python inter_ai_validator.py validate <file_path>")
            sys.exit(1)

        file_path = Path(sys.argv[2])
        result = validate_message(file_path)

        print(f"\nValidation Result: {file_path}")
        print("=" * 50)
        print(f"Valid: {'✅ Yes' if result['valid'] else '❌ No'}")

        if result["errors"]:
            print("\nErrors:")
            for error in result["errors"]:
                print(f"  ❌ {error}")

        if result["warnings"]:
            print("\nWarnings:")
            for warning in result["warnings"]:
                print(f"  ⚠️ {warning}")

        if result["metadata"]:
            print("\nMetadata:")
            for key, value in result["metadata"].items():
                print(f"  {key}: {value}")

        log_message_event(str(file_path), "validated", {"result": result["valid"]})

    elif command == "validate-all":
        results = validate_all_messages()

        print("\nInter-AI Message Validation Report")
        print("=" * 50)
        print(f"Total files: {len(results)}")
        print(f"Valid: {sum(1 for r in results if r['valid'])}")
        print(f"Invalid: {sum(1 for r in results if not r['valid'])}")

        for result in results:
            status = "✅" if result["valid"] else "❌"
            print(f"\n{status} {result['file']}")
            for error in result["errors"]:
                print(f"    ❌ {error}")
            for warning in result["warnings"][:3]:  # Limit warnings shown
                print(f"    ⚠️ {warning}")

    elif command == "create":
        if len(sys.argv) < 3:
            print("Usage: python inter_ai_validator.py create <target_ai>")
            sys.exit(1)

        target = sys.argv[2].lower()
        from_ai = "claude"
        status = "NORMAL"

        for arg in sys.argv[3:]:
            if arg.startswith("--from="):
                from_ai = arg.split("=")[1]
            elif arg.startswith("--status="):
                status = arg.split("=")[1]

        template = create_message_template(target, from_ai, status)
        output_file = TMP_DIR / f"message4{target}.md"

        ensure_directories()
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(template)

        print(f"Created message template: {output_file}")
        log_message_event(str(output_file), "created", {"target": target})

    elif command == "list-pending":
        pending = list_pending_messages()

        print("\nPending Inter-AI Messages")
        print("=" * 50)

        if not pending:
            print("No pending messages found.")
        else:
            for msg in pending:
                print(f"\n📬 {msg['target'].upper()}")
                print(f"   Status: {msg['status']}")
                print(f"   Time: {msg['timestamp']}")
                print(f"   File: {msg['file']}")

    else:
        print(f"Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
