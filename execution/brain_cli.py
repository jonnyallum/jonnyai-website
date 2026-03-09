#!/usr/bin/env python3
"""
Jai.OS 5.0 - Shared Brain CLI
============================
Command-line interface for the Antigravity Shared Brain.

Usage:
  python execution/brain_cli.py status          # Show brain status
  python execution/brain_cli.py route "task"    # Route a task to agents
  python execution/brain_cli.py digest          # Generate daily digest
  python execution/brain_cli.py alerts          # Show active alerts
  python execution/brain_cli.py stale           # Check for stale projects
  python execution/brain_cli.py health          # Update project health scores
  python execution/brain_cli.py chat "message"  # Post to chatroom
"""

import os
import sys
import json
import argparse
from datetime import datetime

# Ensure UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Load environment
from dotenv import load_dotenv
load_dotenv()

try:
    from supabase import create_client
except ImportError:
    print("Error: supabase not installed. Run: pip install supabase")
    sys.exit(1)


def get_brain():
    """Connect to the Shared Brain."""
    url = os.getenv('ANTIGRAVITY_BRAIN_URL')
    key = os.getenv('ANTIGRAVITY_BRAIN_ANON_KEY')

    if not url or not key:
        print("Error: ANTIGRAVITY_BRAIN_URL and ANTIGRAVITY_BRAIN_ANON_KEY must be set in .env")
        sys.exit(1)

    return create_client(url, key)


def cmd_status():
    """Show current brain status."""
    brain = get_brain()

    print("=" * 60)
    print("  JAI.OS 4.0 - SHARED BRAIN STATUS")
    print("=" * 60)
    print()

    # Count tables
    agents = brain.table('agents').select('id', count='exact').execute()
    projects = brain.table('projects').select('id', count='exact').execute()
    tasks = brain.table('tasks').select('id', count='exact').execute()
    chatroom = brain.table('chatroom').select('id', count='exact').execute()
    learnings = brain.table('learnings').select('id', count='exact').execute()

    print(f"  Agents:    {agents.count}")
    print(f"  Projects:  {projects.count}")
    print(f"  Tasks:     {tasks.count}")
    print(f"  Chatroom:  {chatroom.count}")
    print(f"  Learnings: {learnings.count}")
    print()

    # Show projects with health
    print("  PROJECT HEALTH:")
    projects_data = brain.table('projects').select('id, name, health_score, status').execute()
    for p in projects_data.data:
        health = p.get('health_score', 100)
        indicator = "OK" if health >= 80 else "WARN" if health >= 50 else "CRIT"
        print(f"    [{indicator}] {p['name']}: {health}%")
    print()

    # Check for active alerts
    try:
        alerts = brain.table('alerts').select('id', count='exact').eq('status', 'active').execute()
        if alerts.count > 0:
            print(f"  ACTIVE ALERTS: {alerts.count}")
        else:
            print("  ALERTS: None")
    except:
        print("  ALERTS: Table not found (run brain_functions.sql)")

    print()
    print("  STATUS: OPERATIONAL")
    print("=" * 60)


def cmd_route(task_description):
    """Route a task to the best agents."""
    brain = get_brain()

    print(f"\nRouting task: \"{task_description}\"")
    print("-" * 50)

    # Call the routing function via RPC
    try:
        result = brain.rpc('route_task', {
            'p_title': task_description,
            'p_description': None,
            'p_project_id': None
        }).execute()

        if result.data:
            print("\nRecommended agents:")
            for i, agent in enumerate(result.data, 1):
                caps = agent.get('matched_capabilities', [])
                caps_str = ', '.join(caps) if caps else 'general match'
                print(f"  {i}. @{agent['agent_id']} ({agent['human_name']}) - Score: {agent['match_score']}")
                print(f"     Matched: {caps_str}")
        else:
            print("No matching agents found.")

    except Exception as e:
        # Fallback to local matching if function doesn't exist
        print(f"RPC not available ({e}), using local matching...")

        search = task_description.lower()
        agents = brain.table('agents').select('id, human_name, capabilities').execute()

        matches = []
        for agent in agents.data:
            score = 0
            caps = agent.get('capabilities', [])
            matched = []
            for cap in caps:
                if cap.lower() in search:
                    score += 2
                    matched.append(cap)
            if score > 0:
                matches.append((agent, score, matched))

        matches.sort(key=lambda x: x[1], reverse=True)

        if matches:
            print("\nRecommended agents:")
            for i, (agent, score, matched) in enumerate(matches[:5], 1):
                print(f"  {i}. @{agent['id']} ({agent['human_name']}) - Score: {score}")
                print(f"     Matched: {', '.join(matched)}")
        else:
            print("No specific matches. Consider @marcus for coordination.")


def cmd_digest():
    """Generate daily digest."""
    brain = get_brain()

    print("\n" + "=" * 60)
    print("  JAI.OS 4.0 - DAILY DIGEST")
    print("  Generated:", datetime.now().strftime("%Y-%m-%d %H:%M UTC"))
    print("=" * 60)

    # Tasks in last 24h
    from datetime import timedelta
    yesterday = (datetime.utcnow() - timedelta(days=1)).isoformat()

    tasks = brain.table('tasks').select('*').gte('created_at', yesterday).execute()
    completed = [t for t in tasks.data if t.get('status') == 'completed']
    failed = [t for t in tasks.data if t.get('outcome') == 'failed']

    print(f"\n  TASKS (24h):")
    print(f"    Created:   {len(tasks.data)}")
    print(f"    Completed: {len(completed)}")
    print(f"    Failed:    {len(failed)}")

    # Chatroom activity
    messages = brain.table('chatroom').select('ai_source').gte('created_at', yesterday).execute()
    by_ai = {}
    for m in messages.data:
        ai = m.get('ai_source', 'unknown')
        by_ai[ai] = by_ai.get(ai, 0) + 1

    print(f"\n  CHATROOM (24h):")
    print(f"    Total messages: {len(messages.data)}")
    for ai, count in by_ai.items():
        print(f"    - {ai}: {count}")

    # Learnings
    learnings = brain.table('learnings').select('id').gte('created_at', yesterday).execute()
    print(f"\n  LEARNINGS (24h): {len(learnings.data)}")

    # Project health
    projects = brain.table('projects').select('id, name, health_score').eq('status', 'active').execute()
    print(f"\n  PROJECT HEALTH:")
    for p in sorted(projects.data, key=lambda x: x.get('health_score', 100)):
        health = p.get('health_score', 100)
        print(f"    {p['name']}: {health}%")

    print("\n" + "=" * 60)


def cmd_alerts():
    """Show active alerts."""
    brain = get_brain()

    try:
        alerts = brain.table('alerts').select('*').eq('status', 'active').order('created_at', desc=True).execute()

        print("\n" + "=" * 60)
        print("  ACTIVE ALERTS")
        print("=" * 60)

        if not alerts.data:
            print("\n  No active alerts.")
        else:
            for alert in alerts.data:
                severity = alert.get('severity', 'info').upper()
                icon = "!!" if severity == 'CRITICAL' else "!" if severity == 'WARNING' else "i"
                print(f"\n  [{icon}] {alert['title']}")
                print(f"      Type: {alert['alert_type']}")
                print(f"      {alert['message']}")

        print("\n" + "=" * 60)

    except Exception as e:
        print(f"Error: {e}")
        print("Run brain_functions.sql to create the alerts table.")


def cmd_stale():
    """Check for stale projects."""
    brain = get_brain()

    print("\n" + "=" * 60)
    print("  STALE PROJECT CHECK")
    print("=" * 60)

    projects = brain.table('projects').select('id, name, updated_at, created_at, assigned_agents').eq('status', 'active').execute()

    stale = []
    for p in projects.data:
        last_activity = p.get('updated_at') or p.get('created_at')
        if last_activity:
            from datetime import datetime
            last_dt = datetime.fromisoformat(last_activity.replace('Z', '+00:00'))
            days_ago = (datetime.now(last_dt.tzinfo) - last_dt).days
            if days_ago > 14:
                stale.append((p, days_ago))

    if stale:
        print(f"\n  Found {len(stale)} stale projects:\n")
        for p, days in sorted(stale, key=lambda x: x[1], reverse=True):
            agents = ', '.join(p.get('assigned_agents', []))
            print(f"  - {p['name']}: {days} days inactive")
            print(f"    Assigned: {agents or 'none'}")
    else:
        print("\n  All projects active!")

    print("\n" + "=" * 60)


def cmd_health():
    """Update all project health scores."""
    brain = get_brain()

    print("\nUpdating project health scores...")

    projects = brain.table('projects').select('id, name, health_score').eq('status', 'active').execute()

    for p in projects.data:
        # Simple health calculation (RPC function would be better)
        health = 100

        # Check days inactive
        last = brain.table('tasks').select('created_at').eq('project_id', p['id']).order('created_at', desc=True).limit(1).execute()
        if last.data:
            from datetime import datetime, timedelta
            last_dt = datetime.fromisoformat(last.data[0]['created_at'].replace('Z', '+00:00'))
            days_inactive = (datetime.now(last_dt.tzinfo) - last_dt).days
            health -= min((days_inactive // 7) * 5, 30)

        # Update if changed
        old_health = p.get('health_score', 100)
        if health != old_health:
            brain.table('projects').update({'health_score': health}).eq('id', p['id']).execute()
            print(f"  {p['name']}: {old_health}% -> {health}%")
        else:
            print(f"  {p['name']}: {health}% (unchanged)")

    print("\nDone.")


def cmd_chat(message, agent='marcus'):
    """Post a message to the chatroom."""
    brain = get_brain()

    ai_identity = os.getenv('AI_IDENTITY', 'claude')
    machine_id = os.getenv('MACHINE_ID', 'unknown')

    result = brain.table('chatroom').insert({
        'ai_source': ai_identity,
        'machine_id': machine_id,
        'agent_id': agent,
        'message': message,
        'message_type': 'chat',
        'project_context': 'jonnyai'  # Default project
    }).execute()

    if result.data:
        print(f"\n[{ai_identity}/@{agent}] {message}")
        print("Message posted to chatroom.")
    else:
        print("Failed to post message.")


def main():
    parser = argparse.ArgumentParser(
        description='Jai.OS 5.0 - Shared Brain CLI',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )

    subparsers = parser.add_subparsers(dest='command', help='Commands')

    # Status
    subparsers.add_parser('status', help='Show brain status')

    # Route
    route_parser = subparsers.add_parser('route', help='Route a task to agents')
    route_parser.add_argument('task', help='Task description')

    # Digest
    subparsers.add_parser('digest', help='Generate daily digest')

    # Alerts
    subparsers.add_parser('alerts', help='Show active alerts')

    # Stale
    subparsers.add_parser('stale', help='Check for stale projects')

    # Health
    subparsers.add_parser('health', help='Update project health scores')

    # Chat
    chat_parser = subparsers.add_parser('chat', help='Post to chatroom')
    chat_parser.add_argument('message', help='Message to post')
    chat_parser.add_argument('--agent', '-a', default='marcus', help='Agent to post as')

    args = parser.parse_args()

    if args.command == 'status':
        cmd_status()
    elif args.command == 'route':
        cmd_route(args.task)
    elif args.command == 'digest':
        cmd_digest()
    elif args.command == 'alerts':
        cmd_alerts()
    elif args.command == 'stale':
        cmd_stale()
    elif args.command == 'health':
        cmd_health()
    elif args.command == 'chat':
        cmd_chat(args.message, args.agent)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
