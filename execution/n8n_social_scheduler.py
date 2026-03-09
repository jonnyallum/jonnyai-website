"""
n8n_social_scheduler.py — Daily Social Auto-Scheduler
======================================================
Called by n8n cron (10:00, 14:00, 18:00 UK) to publish staggered content.

Flow:
  1. Pull due items from content_calendar (status=scheduled, scheduled_for <= now)
  2. Process each via SocialEngine.process_trigger()
  3. Mark as published in content_calendar
  4. If no scheduled content, optionally generate a proactive post

Usage:
  python execution/n8n_social_scheduler.py              # Process due calendar items
  python execution/n8n_social_scheduler.py --generate    # Also generate if calendar empty
  python execution/n8n_social_scheduler.py --dry-run     # Preview only

Designed to be called from n8n HTTP Request node or cron.
"""

import os
import sys
import json
from datetime import datetime, timezone
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Add execution/ to path
sys.path.insert(0, str(Path(__file__).parent))

from social_engine import SocialEngine

def run_scheduler(dry_run=False, auto_generate=False):
    """Main scheduler entry point."""
    engine = SocialEngine()
    now = datetime.now(timezone.utc)
    
    print(f"\n{'='*60}")
    print(f"📅 SOCIAL AUTO-SCHEDULER | {now.strftime('%d/%m/%Y %H:%M')} UTC")
    print(f"{'='*60}")

    # 1. Process due calendar items
    results = engine.process_calendar(dry_run=dry_run)
    
    if results:
        live = sum(1 for r in results if r.get('status') == 'PUBLISHED')
        queued = sum(1 for r in results if r.get('status') == 'QUEUED')
        blocked = sum(1 for r in results if r.get('status') == 'BLOCKED')
        print(f"\n📊 Scheduler Results: {live} published, {queued} queued, {blocked} blocked")
    else:
        print(f"  📭 No scheduled content due.")
        
        if auto_generate:
            print(f"  🤖 Auto-generating proactive content...")
            # Pick from a rotation of evergreen pillars
            evergreen_pillars = [
                "[TIP] Share a quick SEO tip for small businesses in the UK",
                "[CULTURE] Show how the Antigravity Orchestra works together",
                "[INSIGHT] Share a contrarian take on AI automation for SMEs",
            ]
            # Pick based on day of week (simple rotation)
            day_idx = now.weekday() % len(evergreen_pillars)
            trigger = evergreen_pillars[day_idx]
            
            result = engine.process_trigger(trigger, "contentforge", dry_run=dry_run)
            print(f"  Auto-generate result: {result.get('status')}")
            results = [result]

    # 2. Return summary for n8n
    summary = {
        "timestamp": now.isoformat(),
        "items_processed": len(results) if results else 0,
        "dry_run": dry_run,
        "next_run": "In 4 hours (next cron slot)"
    }
    
    print(f"\n✅ Scheduler complete.")
    return summary


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Antigravity Social Auto-Scheduler")
    parser.add_argument("--dry-run", action="store_true", help="Preview without publishing")
    parser.add_argument("--generate", action="store_true", help="Auto-generate if calendar empty")
    args = parser.parse_args()
    
    result = run_scheduler(dry_run=args.dry_run, auto_generate=args.generate)
    print(json.dumps(result, indent=2))
