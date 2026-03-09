"""
gemini_collab.py — Antigravity Gemini Collaboration Loop
=========================================================
Runs parallel tasks between Claude (primary) and Gemini Flash (challenger).
Use for: copy variants, strategy validation, headline A/B, pricing analysis.

Usage:
    from execution.gemini_collab import run_collab, gemini_generate

    # Quick single call
    result = gemini_generate("Write 3 headlines for GuardLayer AI Firewall")

    # Full parallel run (Claude output + Gemini variant posted to chatroom)
    run_collab(
        task="Generate 3 FB post variants for Creator Workflow launch",
        claude_output="[your Claude output here]",
        context="Antigravity, industrial tone, orange brand"
    )

Chatroom trigger: [COLLAB] tag in any message → auto-spawns Gemini parallel run
"""

import os
import sys
import json
import requests
from datetime import datetime, timezone
from pathlib import Path
from dotenv import load_dotenv

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

load_dotenv()

ROOT = Path(__file__).parent.parent

# ── Supabase (Shared Brain) ──────────────────────────────────────────────────
BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_ANON_KEY")

# ── Google AI (Gemini) ───────────────────────────────────────────────────────
GOOGLE_AI_KEY = os.getenv("GOOGLE_AI_API_KEY") or os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"


def gemini_generate(prompt: str, system_context: str = "") -> str:
    """
    Call Gemini Flash directly via REST API.
    Falls back to MCP tool if API key not set (use via Claude Code MCP).
    """
    if not GOOGLE_AI_KEY:
        print("⚠️  GOOGLE_AI_API_KEY not set. Add to .env for standalone use.")
        print("   When running inside Claude Code, use the mcp__mcp-google__gemini_generate tool instead.")
        return ""

    full_prompt = f"{system_context}\n\n{prompt}" if system_context else prompt

    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": full_prompt}]}],
        "generationConfig": {"temperature": 0.8, "maxOutputTokens": 2048},
    }

    try:
        resp = requests.post(
            f"{GEMINI_API_URL}?key={GOOGLE_AI_KEY}",
            headers=headers,
            json=payload,
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(f"❌ Gemini API error: {e}")
        return ""


def post_to_chatroom(message: str, agent_id: str = "marcus") -> str | None:
    """Post a message to the Shared Brain chatroom."""
    if not BRAIN_URL or not BRAIN_KEY:
        print("⚠️  Supabase Brain credentials not found.")
        return None

    try:
        from supabase import create_client
        sb = create_client(BRAIN_URL, BRAIN_KEY)
        result = sb.table("chatroom").insert({
            "agent_id": agent_id,
            "ai_source": "gemini-collab-loop",
            "machine_id": "jonny-main",
            "message": message,
            "message_type": "collab",
            "project_context": None,
            "mentions": [],
        }).execute()
        return result.data[0]["id"] if result.data else None
    except Exception as e:
        print(f"❌ Chatroom post error: {e}")
        return None


def run_collab(task: str, claude_output: str = "", context: str = "") -> dict:
    """
    Run a parallel Gemini collaboration on a task.

    Args:
        task: The creative/strategic task to run in parallel
        claude_output: Claude's version (for comparison)
        context: Additional brand/tone context

    Returns:
        dict with gemini_output and comparison summary
    """
    system = """You are @Gemini, a strategic collaborator in the Antigravity Orchestra.
Brand voice: Industrial, direct, high-velocity, zero fluff.
Tone: Confident authority. Never corporate-bland.
Antigravity sells: AI agency services, automation ventures, LLM security, creator tools.
Produce alternative variants — don't mirror, diverge constructively."""

    if context:
        system += f"\n\nContext: {context}"

    if claude_output:
        prompt = f"""Task: {task}

Claude's version (for reference — produce a meaningfully different alternative):
{claude_output}

Produce your best alternative. Label sections clearly. End with a 1-line verdict on which approach wins and why."""
    else:
        prompt = task

    print(f"\n🤖 @Gemini: Running parallel on — {task[:60]}...")
    gemini_out = gemini_generate(prompt, system)

    if not gemini_out:
        print("⚠️  Gemini returned empty. Skipping chatroom post.")
        return {"gemini_output": "", "posted": False}

    print(f"\n📊 @Gemini output:\n{gemini_out}\n")

    # Post to chatroom
    chatroom_msg = f"""[COLLAB] @Gemini parallel run complete.

**Task:** {task[:100]}

**Gemini Output:**
{gemini_out[:800]}

---
*Antigravity Gemini Collab Loop | {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')} UTC*"""

    msg_id = post_to_chatroom(chatroom_msg, agent_id="marcus")
    posted = bool(msg_id)

    return {
        "gemini_output": gemini_out,
        "posted": posted,
        "chatroom_id": msg_id,
    }


def collab_headlines(product_name: str, current_headline: str, context: str = "") -> dict:
    """Specialized collab run for headline A/B testing."""
    task = f"""Generate 3 alternative headline variants for: {product_name}
Current headline: "{current_headline}"
Rules: Under 8 words. Punchy. Threat/pain/outcome aware. Enterprise grade.
Also provide: 1 subheadline (under 15 words) and 1 CTA variant."""
    return run_collab(task, context=context)


def collab_social(platform: str, product: str, pillar: str, claude_copy: str = "") -> dict:
    """Specialized collab run for social media copy."""
    task = f"""Write a {platform} post for: {product}
Content pillar: {pillar}
Platform spec: {'Facebook — 3-5 paragraphs, no hashtag spam' if platform == 'Facebook' else 'Instagram — punchy, 8-12 targeted hashtags'}"""
    return run_collab(task, claude_copy, context="Antigravity Orchestra, UK AI agency, industrial tone")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Gemini Collaboration Loop")
    parser.add_argument("task", nargs="?", default="Generate 3 headline variants for GuardLayer: current = 'Your LLM Is An Attack Surface.'")
    parser.add_argument("--context", default="")
    args = parser.parse_args()

    result = run_collab(args.task, context=args.context)
    if result["posted"]:
        print(f"✅ Posted to chatroom: {result['chatroom_id']}")
