"""
@Nathan // @Contentforge — Real-Time Social Broadcast Webhook
Antigravity Phase 3: Broadcast Loop

Receives Supabase webhook POSTs when chatroom rows are inserted.
Detects trigger tags → generates Pillar-matched copy → posts FB + IG.

SETUP:
  1. pip install flask anthropic
  2. python execution/webhook_receiver.py           (starts on :5001)
  3. execution\\tools\\ngrok.exe http 5001           (get public URL)
  4. Add Supabase DB Webhook:
       Table: chatroom | Event: INSERT
       URL: https://<ngrok-id>.ngrok-free.app/webhook/chatroom

Marketing Bible: social_mastery_blueprint.md.resolved
"""

import os
import sys
import json
import hashlib
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Force UTF-8 on Windows
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

load_dotenv()

# Lazy imports so server starts fast
def _get_flask():
    from flask import Flask, request, jsonify
    return Flask, request, jsonify

def _get_anthropic():
    import anthropic
    return anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def _get_openai():
    from openai import OpenAI
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ─── Config ──────────────────────────────────────────────────────────────────
ROOT = Path(r"C:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0")
PROCESSED_LOG = ROOT / ".tmp" / "social-sync" / "webhook_processed.json"
PROCESSED_LOG.parent.mkdir(parents=True, exist_ok=True)

# Trigger tags → Pillar type
TRIGGER_MAP = {
    "[MISSION]":        "MISSION_COMPLETE",
    "[MILESTONE]":      "MISSION_COMPLETE",
    "[WIN]":            "MISSION_COMPLETE",
    "[LAUNCH]":         "MISSION_COMPLETE",
    "[INFRASTRUCTURE]": "INFRASTRUCTURE_UPGRADE",
    "[UPGRADE]":        "INFRASTRUCTURE_UPGRADE",
    "[INSIGHT]":        "TRILLION_DOLLAR_INSIGHT",
    "[RESEARCH]":       "TRILLION_DOLLAR_INSIGHT",
    "[ACADEMY]":        "MISSION_COMPLETE",
    "[AGENT]":          "AGENT_SPOTLIGHT",
}

# ─── Copy Generation (Pillar-matched via Claude Haiku) ───────────────────────

PILLAR_PROMPTS = {
    "INFRASTRUCTURE_UPGRADE": """You are @Contentforge, Antigravity's social copy specialist.
Write a SHORT social media post about this system/infrastructure update.
Style: Raw, quasi-technical. Show the engine evolving. Industrial tone.
Format: 2-3 short paragraphs. End with 1 line of hashtags (#JaiOS5 #AntigravityOrchestra).
Max 200 words Facebook. Max 100 words Instagram.
NO emojis except max 1 technical icon. NO filler. Outcome-first.""",

    "MISSION_COMPLETE": """You are @Contentforge, Antigravity's social copy specialist.
Write a social post about this milestone/launch/win.
Style: Authoritative. Before/After or pure outcome. CTA at end.
Facebook: 150-250 words. Insight-led. End with jonnyai.co.uk
Instagram: 80-120 words. Hook first. 15 relevant hashtags.
NO placeholder text. Real specifics from the message only.""",

    "TRILLION_DOLLAR_INSIGHT": """You are @Contentforge, Antigravity's social copy specialist.
Write a contrarian insight post based on this research/data.
Style: Provocative assertion. Data-backed. Makes people stop scrolling.
Facebook: 150-200 words. Contrarian hook, supporting data, CTA.
Instagram: 80-100 words. Bold opener. 12-15 hashtags.
Sound like a founder, not a marketer.""",

    "AGENT_SPOTLIGHT": """You are @Contentforge, Antigravity's social copy specialist.
Write an agent spotlight post introducing this Antigravity specialist.
Style: Persona-driven. Specific capability. Human but technical.
Facebook: 100-150 words. Who they are + what they uniquely do.
Instagram: 60-80 words. One clear capability. 10 hashtags.
Make them sound like a weapon, not a chatbot.""",
}

UTM = "?utm_source={platform}&utm_medium=social&utm_campaign=orchestra_broadcast"

HASHTAG_ALWAYS = "#JaiOS #Antigravity #AgenticAI #AIorchestra #AIautomation #buildinpublic"


def generate_copy(raw_message: str, pillar: str) -> dict:
    """Call Claude Haiku to generate platform-specific copy."""
    try:
        client = _get_anthropic()
        system_prompt = PILLAR_PROMPTS.get(pillar, PILLAR_PROMPTS["MISSION_COMPLETE"])

        user_msg = f"""Raw chatroom message to transform:
---
{raw_message}
---
Return a JSON object with exactly two keys:
  "facebook": "full FB post text including CTA and link"
  "instagram": "IG post text including hashtags"
Only JSON, no markdown, no explanation."""

        resp = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=800,
            system=system_prompt,
            messages=[{"role": "user", "content": user_msg}]
        )

        text = resp.content[0].text.strip()
        # Strip markdown fences if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]

        copy = json.loads(text)
        return copy

    except Exception as e:
        print(f"  ⚠️  Haiku copy gen failed: {e} — using fallback template")
        return _fallback_copy(raw_message, pillar)


def _fallback_copy(raw_message: str, pillar: str) -> dict:
    """Simple template fallback if Claude is unavailable."""
    short = raw_message[:120].strip()
    fb = (f"{short}\n\nThe Antigravity Orchestra is live.\n"
          f"68 specialists. Zero waiting.\n\n"
          f"jonnyai.co.uk{UTM.format(platform='facebook')}\n\n"
          f"{HASHTAG_ALWAYS}")
    ig = (f"{short}\n\n"
          f"jonnyai.co.uk\n\n"
          f"{HASHTAG_ALWAYS} #AItools #techstartup #UKtech #founders")
    return {"facebook": fb, "instagram": ig}

def generate_dynamic_image(message: str, pillar: str) -> str:
    """Generate contextual God-Tier images with DALL-E 3."""
    try:
        client = _get_openai()
        
        # Style guide based on our industrial neural theme
        style_prompt = "A high-end, 8k resolution, cinematic 3D render. Dark industrial aesthetic with deep charcoal backgrounds, glowing safety orange accents, and frosted glassmorphism elements. Technical, futuristic, and premium."
        
        content_prompts = {
            "INFRASTRUCTURE_UPGRADE": f"Abstract visual of a powerful server engine or data pipeline processing high-speed information. {style_prompt}",
            "TRILLION_DOLLAR_INSIGHT": f"Abstract visual representing analytical intelligence, data streams, and profound technical insight. {style_prompt}",
            "MISSION_COMPLETE": f"Visual representing a launched digital product or successful technological deployment. {style_prompt}"
        }
        
        prompt = content_prompts.get(pillar, f"Abstract technological concept for an AI agency. {style_prompt}")
        
        print(f"  🎨 Generating image via DALL-E 3 for {pillar}...")
        
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        url = response.data[0].url
        print("  🖼️ Image generated successfully!")
        return url
    except Exception as e:
        print(f"  ⚠️  DALL-E generation failed: {e}")
        return None

# ─── Social Publishing ────────────────────────────────────────────────────────

def publish(copy: dict, image_url: str = None) -> dict:
    """Post to Facebook + Instagram. Returns result dict."""
    sys.path.insert(0, str(ROOT / "execution"))
    import facebook_publisher as fp

    results = {}

    # Facebook (photo and text post)
    fb_ok = fp.post_to_facebook(copy["facebook"], image_url)
    results["facebook"] = "LIVE" if fb_ok else "FAILED"

    # Instagram (requires image URL)
    if image_url and copy.get("instagram"):
        ig_ok = fp.post_to_instagram(image_url, copy["instagram"])
        results["instagram"] = "LIVE" if ig_ok else "FAILED"
    else:
        results["instagram"] = "SKIPPED_NO_IMAGE"

    return results


# ─── Deduplication ────────────────────────────────────────────────────────────

def _load_processed() -> set:
    if PROCESSED_LOG.exists():
        return set(json.loads(PROCESSED_LOG.read_text(encoding="utf-8")))
    return set()


def _mark_processed(msg_id: str):
    processed = _load_processed()
    processed.add(msg_id)
    PROCESSED_LOG.write_text(json.dumps(list(processed), indent=2), encoding="utf-8")


# ─── Core Handler ─────────────────────────────────────────────────────────────

def handle_chatroom_event(payload: dict) -> dict:
    """Main logic: receive Supabase INSERT payload → detect → generate → post."""
    record = payload.get("record", {})
    msg_id = str(record.get("id", ""))
    message = record.get("message", "")
    agent = record.get("agent_id", "unknown")

    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] @{agent}: {message[:80]}...")

    # Dedup check
    processed = _load_processed()
    if msg_id in processed:
        print("  ⏩ Already processed — skip")
        return {"status": "SKIPPED_DUPLICATE"}

    # Detect trigger tag
    pillar = None
    for tag, p in TRIGGER_MAP.items():
        if tag in message:
            pillar = p
            break

    if not pillar:
        print("  ○ No trigger tag — ignore")
        return {"status": "NO_TAG"}

    print(f"  🎯 Pillar: {pillar}")

    # Generate copy
    copy = generate_copy(message, pillar)
    print(f"  ✍️  FB: {copy.get('facebook','')[:60]}...")

    import random

    brand_images = [
        "https://jonnyai.co.uk/brand/hero_background.png",
        "https://jonnyai.co.uk/brand/orchestra_visual.png"
    ]
    
    portraits = {
        "marcus": "marcus_cole.png", "sebastian": "sebastian_cross.png", "priya": "priya_sharma.png",
        "hannah": "hannah_park.png", "diana": "diana_chen.png", "owen": "owen_stinger.png",
        "sam": "sam_blackwood.png", "derek": "derek_obrien.png", "milo": "milo_chen.png",
        "arthur": "arthur_webb.png", "alex": "alex_torres.png", "mason": "mason_drake.png",
        "julian": "julian_west.png", "luna": "luna_sterling.png", "victor": "victor_reyes.png",
        "vigil": "vigil_chen.png", "rowan": "rowan.png", "grace": "grace_liu.png",
        "carlos": "carlos_mendez.png", "maya": "maya_singh.png", "felix": "felix_morgan.png",
        "elena": "elena_vasquez.png", "sophie": "sophie_reid.png", "scholar": "elias_thorne.png",
        "hugo": "hugo_reeves.png", "patrick": "patrick_nguyen.png", "winston": "winston_hayes.png",
        "trotter": "derek_trotter.png", "genesis": "genesis_nova.png", "gareth": "gareth_williams.png",
        "monty": "monty_carlo.png", "redeye": "redeye.png", "pietro": "pietro_rossi.png",
        "terry": "terry_taylor.png", "harry": "harry_holt.png", "daniel": "daniel_rossi.png",
        "sterling": "sterling_brooks.png", "quinn": "quinn_harper.png", "jasper": "jasper_cole.png",
        "nina": "nina_patel.png", "theo": "theo_martinez.png",
    }

    # Dynamically select image based on pillar and agent
    if pillar == "AGENT_SPOTLIGHT" and agent.lower() in portraits:
        image_url = f"https://jonnyai.co.uk/agents/portraits/{portraits[agent.lower()]}"
    else:
        # Generate a contextual image via DALL-E 3
        dalle_url = generate_dynamic_image(message, pillar)
        image_url = dalle_url if dalle_url else random.choice(brand_images)

    # Publish
    results = publish(copy, image_url)
    print(f"  📡 Results: {results}")

    # Log processed
    _mark_processed(msg_id)

    # Save copy to .tmp for audit trail
    out = ROOT / ".tmp" / "social-sync" / f"webhook_{msg_id}.json"
    out.write_text(json.dumps({
        "id": msg_id, "agent": agent, "pillar": pillar,
        "message": message, "copy": copy, "results": results,
        "timestamp": datetime.now().isoformat()
    }, indent=2, ensure_ascii=False), encoding="utf-8")

    return {"status": "PUBLISHED", "results": results}


# ─── Flask Server ─────────────────────────────────────────────────────────────

def create_app():
    Flask, request, jsonify = _get_flask()
    app = Flask(__name__)

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "LIVE", "agent": "@Nathan", "version": "phase3"}), 200

    @app.route("/webhook/chatroom", methods=["POST"])
    def chatroom_webhook():
        """Supabase Database Webhook endpoint."""
        payload = request.get_json(force=True, silent=True) or {}

        # Supabase wraps in {"type": "INSERT", "table": "chatroom", "record": {...}}
        if payload.get("type") not in ("INSERT", None):
            return jsonify({"status": "IGNORED_EVENT_TYPE"}), 200

        result = handle_chatroom_event(payload)
        return jsonify(result), 200

    @app.route("/webhook/test", methods=["POST"])
    def test_webhook():
        """Manual test: POST {"message": "[MILESTONE] Test post", "agent": "marcus"}"""
        body = request.get_json(force=True, silent=True) or {}
        fake_payload = {
            "type": "INSERT",
            "record": {
                "id": f"test_{datetime.now().strftime('%H%M%S')}",
                "message": body.get("message", "[MILESTONE] Test broadcast from webhook."),
                "agent_id": body.get("agent", "marcus"),
            }
        }
        result = handle_chatroom_event(fake_payload)
        return jsonify(result), 200

    @app.route("/webhook/meta", methods=["GET", "POST"])
    def meta_webhook():
        """Handles Meta Webhooks for Incoming Comments (Phase 5)."""
        VERIFY_TOKEN = os.getenv("META_VERIFY_TOKEN", "antigravity_verification_token")
        
        # 1. Verification Request from Meta (GET)
        if request.method == "GET":
            mode = request.args.get("hub.mode")
            token = request.args.get("hub.verify_token")
            challenge = request.args.get("hub.challenge")

            if mode and token:
                if mode == "subscribe" and token == VERIFY_TOKEN:
                    print("✅ META WEBHOOK VERIFIED")
                    return challenge, 200
                else:
                    return "Forbidden", 403
            return "OK", 200
            
        # 2. Incoming Payload from Meta (POST)
        if request.method == "POST":
            payload = request.get_json(force=True, silent=True) or {}
            
            # Fire the interaction engine
            sys.path.insert(0, str(ROOT / "execution"))
            try:
                import interaction_engine as ie
                ie.handle_incoming_comment(payload)
            except Exception as e:
                print(f"❌ Interaction Engine Error: {e}")
                
            # Meta requires a 200 OK within 20 seconds, or it disables the webhook
            return "EVENT_RECEIVED", 200

    return app


if __name__ == "__main__":
    PORT = int(os.getenv("WEBHOOK_PORT", 5001))
    print(f"""
╔══════════════════════════════════════════════════════════╗
║  @Nathan // Antigravity Real-Time Broadcast Receiver     ║
║  Phase 3: Chatroom → FB + IG (< 5 seconds)              ║
╠══════════════════════════════════════════════════════════╣
║  Server:  http://localhost:{PORT}                          ║
║  Health:  GET  /health                                   ║
║  Live:    POST /webhook/chatroom  (Supabase fires this)  ║
║  Test:    POST /webhook/test                             ║
╠══════════════════════════════════════════════════════════╣
║  NEXT STEP:                                              ║
║  execution\\tools\\ngrok.exe http {PORT}                    ║
║  Copy the https URL → Supabase DB Webhook                ║
╚══════════════════════════════════════════════════════════╝
""")
    app = create_app()
    app.run(host="0.0.0.0", port=PORT, debug=False)
