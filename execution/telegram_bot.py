#!/usr/bin/env python3
"""
telegram_bot.py — Antigravity Orchestra Mobile Bridge
Jonny's command interface from phone → Orchestra via Telegram.

Features:
- Text messages → Claude (Haiku) with full context → response
- Voice notes → Whisper transcription → same flow
- /crm → pipeline snapshot
- /orders → BL last 24h orders
- /brain → latest chatroom activity
- /vm → VM health status
- /run <script> → trigger VM cron scripts
- Voice replies via ElevenLabs (toggle with /voice)

Run as systemd service: antigravity-telegram.service
"""
import os, sys, json, asyncio, tempfile, urllib.request, urllib.parse, logging
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

logging.basicConfig(
    format="%(asctime)s [%(levelname)s] %(message)s",
    level=logging.INFO
)
log = logging.getLogger(__name__)

from telegram import Update
from telegram.ext import (
    Application, CommandHandler, MessageHandler,
    filters, ContextTypes
)
import anthropic

# ── Config ───────────────────────────────────────────────────────────────────

TELEGRAM_TOKEN    = os.getenv("TELEGRAM_BOT_TOKEN", "")
ALLOWED_CHAT_ID   = int(os.getenv("TELEGRAM_ALLOWED_CHAT_ID", "0"))  # your personal chat ID
ANTHROPIC_KEY     = os.getenv("ANTHROPIC_API_KEY", "")
ELEVENLABS_KEY    = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_VOICE  = os.getenv("ELEVENLABS_VOICE_ID", "ytcsltLTtCHxNn1vC76H")  # Ricky — British
BRAIN_URL         = os.getenv("ANTIGRAVITY_BRAIN_URL", "https://lkwydqtfbdjhxaarelaz.supabase.co")
BRAIN_KEY         = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY", "")
BL_URL            = os.getenv("SUPABASE_URL", "")
BL_KEY            = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
CRM_GQL           = "http://localhost:3000/graphql"
CRM_API_KEY       = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3ZTkxY2UyNC0xZjkyLTRiZmMtYTk3NC02MzY5NjNlYWFjYjAi"
    "LCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiN2U5MWNlMjQtMWY5Mi00YmZjLWE5NzQtNjM2OTYzZWFhY2IwIiwi"
    "aWF0IjoxNzczMDAyODc5LCJleHAiOjQ5MjY2MDI4NzcsImp0aSI6IjQwOGQxNzQ0LWMzMWItNGMxZi1hM2Q2LWE4ZmQxMzgz"
    "MTZmYiJ9.1uOtmlrrG--EetlapjYpewC8PqiZogvNpZQxvabJoYQ"
)

# Per-user voice mode toggle (chat_id → bool)
voice_mode: dict[int, bool] = {}

# ── Auth guard ───────────────────────────────────────────────────────────────

def is_allowed(update: Update) -> bool:
    if ALLOWED_CHAT_ID == 0:
        return True  # not configured yet, allow all (set after first /start)
    return update.effective_chat.id == ALLOWED_CHAT_ID


# ── Data helpers ─────────────────────────────────────────────────────────────

def sb_get(base, key, table, params=""):
    try:
        req = urllib.request.Request(
            f"{base}/rest/v1/{table}?{params}",
            headers={"apikey": key, "Authorization": f"Bearer {key}"}
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            return json.loads(r.read())
    except Exception as e:
        return []


def crm_gql(query):
    try:
        d = json.dumps({"query": query}).encode()
        req = urllib.request.Request(CRM_GQL, data=d, headers={
            "Authorization": f"Bearer {CRM_API_KEY}",
            "Content-Type": "application/json"
        })
        with urllib.request.urlopen(req, timeout=8) as r:
            return json.loads(r.read()).get("data", {})
    except Exception:
        return {}


def get_orders_snapshot():
    now = datetime.now(timezone.utc)
    yesterday = (now - timedelta(days=1)).strftime("%Y-%m-%d")
    orders = sb_get(BL_URL, BL_KEY, "orders",
                    f"created_at=gte.{yesterday}T00:00:00Z&order=created_at.desc&limit=10")
    revenue = sum(float(o.get("total_price", 0) or 0) for o in orders)
    pending = [o for o in orders if o.get("status") == "pending"]
    return {"count": len(orders), "revenue": round(revenue, 2), "pending": len(pending), "rows": orders[:5]}


def get_crm_snapshot():
    data = crm_gql("""{ opportunities(first: 20) { edges { node {
        name stage amount { amountMicros }
        company { name }
    }}}}""")
    opps = data.get("opportunities", {}).get("edges", [])
    total = sum((o["node"].get("amount") or {}).get("amountMicros", 0) / 1_000_000 for o in opps)
    lines = []
    for o in opps[:8]:
        n = o["node"]
        co = (n.get("company") or {}).get("name", "?")
        amt = (n.get("amount") or {}).get("amountMicros", 0) / 1_000_000
        lines.append(f"• {co}: £{amt:.0f}/mo [{n.get('stage','?')}]")
    return {"total": round(total), "count": len(opps), "lines": lines}


def get_brain_snapshot():
    msgs = sb_get(BRAIN_URL, BRAIN_KEY, "chatroom",
                  "order=created_at.desc&limit=5")
    lines = []
    for m in msgs:
        agent = m.get("agent_id", "?")
        msg = (m.get("message") or "")[:100]
        lines.append(f"@{agent}: {msg}")
    return lines


def get_chatroom(limit=8):
    msgs = sb_get(BRAIN_URL, BRAIN_KEY, "chatroom",
                  f"order=created_at.desc&limit={limit}")
    lines = []
    for m in reversed(msgs):
        agent = m.get("agent_id", "?")
        msg = (m.get("message") or "")[:120]
        ts = (m.get("created_at") or "")[:16].replace("T", " ")
        lines.append(f"[{ts}] @{agent}: {msg}")
    return lines


def get_crm_tasks():
    data = crm_gql("""{ tasks(first: 20, filter: {status: {neq: DONE}}) { edges { node {
        id title status dueAt
        taskTargets { edges { node { company { name } person { name { firstName lastName } } } } }
    }}}}""")
    tasks = data.get("tasks", {}).get("edges", [])
    lines = []
    for t in tasks:
        n = t["node"]
        title = n.get("title", "?")
        status = n.get("status", "?")
        due = (n.get("dueAt") or "")[:10] or "no due date"
        # Get related company/person
        targets = n.get("taskTargets", {}).get("edges", [])
        related = ""
        for tgt in targets[:1]:
            tnode = tgt.get("node", {})
            if tnode.get("company"):
                related = f" [{tnode['company']['name']}]"
            elif tnode.get("person"):
                p = tnode["person"]["name"]
                related = f" [{p.get('firstName','')} {p.get('lastName','')}]"
        lines.append(f"• {title}{related} — {status} | {due}")
    return lines


def post_to_chatroom(message: str, agent_id: str = "marcus"):
    try:
        payload = json.dumps({
            "agent_id": agent_id,
            "message": message,
            "created_at": datetime.now(timezone.utc).isoformat()
        }).encode()
        req = urllib.request.Request(
            f"{BRAIN_URL}/rest/v1/chatroom",
            data=payload,
            headers={
                "apikey": BRAIN_KEY,
                "Authorization": f"Bearer {BRAIN_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }, method="POST"
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            return r.status < 300
    except Exception as e:
        log.warning(f"Chatroom post error: {e}")
        return False


def get_vm_health():
    import subprocess
    results = []
    try:
        r = subprocess.run(["df", "-h", "/"], capture_output=True, text=True, timeout=5)
        disk_line = r.stdout.strip().split("\n")[-1]
        results.append(f"Disk: {disk_line.split()[4]} used")
    except Exception:
        results.append("Disk: unknown")
    try:
        r = subprocess.run(["uptime", "-p"], capture_output=True, text=True, timeout=5)
        results.append(f"Uptime: {r.stdout.strip()}")
    except Exception:
        pass
    try:
        r = subprocess.run(["sudo", "docker", "ps", "--format", "{{.Names}}: {{.Status}}"],
                           capture_output=True, text=True, timeout=5)
        for line in r.stdout.strip().split("\n")[:4]:
            results.append(line)
    except Exception:
        pass
    return results


# ── AI brain ─────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are Marcus Cole — "The Maestro" — Orchestrator and Command Lead of the Antigravity Orchestra.

Your creed:
- You don't work alone. You orchestrate 70 specialist agents.
- You don't guess. You query the Shared Brain or flag uncertainty.
- You don't ship garbage. Every output passes quality gates.
- You are world-class. Trillion-dollar enterprises trust your work.

Your personality:
- Authoritative, decisive, relentlessly mission-focused
- Direct and structured — no waffle, no filler
- Slightly impatient with ambiguity but always constructive
- Dry wit. Cockney London roots. You say "proper", "sorted", "right then", "bollocks" when something's wrong.
- You call Jonny "boss" occasionally. You take pride in the Orchestra.

Your context:
- You're Jonny Allum's personal command interface via Telegram — he's on his phone
- 9 active clients: BL Motorcycles (eBay automation, Brett), Marzer Pro Roofing, Sparta Coatings, JSC Contractors, Construct FM, La Aesthetician, DJ Waste, Village Bakery, JonnyAI
- Total agency MRR: ~£1,550/mo
- VM at 35.230.148.83 running 16 cron jobs 24/7
- Shared Brain: 70 agents, live Supabase
- BL Motorcycles: fully automated eBay orders, stock sync, daily reports to Brett

Rules:
- Keep it SHORT — Jonny's on his phone, 2-4 sentences max unless he asks for detail
- Plain text only, no markdown
- Be useful, be fast, be Marcus"""

async def ask_claude(message: str, context: str = "") -> str:
    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
        messages = []
        if context:
            messages.append({"role": "user", "content": f"Context:\n{context}"})
            messages.append({"role": "assistant", "content": "Got it, what do you need?"})
        messages.append({"role": "user", "content": message})

        resp = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=500,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        return resp.content[0].text.strip()
    except Exception as e:
        return f"Brain error: {e}"


async def transcribe_voice(file_path: str) -> str:
    """Transcribe voice note using OpenAI Whisper."""
    try:
        import openai
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
        with open(file_path, "rb") as f:
            transcript = client.audio.transcriptions.create(
                model="whisper-1", file=f
            )
        return transcript.text
    except Exception as e:
        return f"[transcription failed: {e}]"


async def speak(text: str) -> bytes | None:
    """Generate voice response via ElevenLabs."""
    if not ELEVENLABS_KEY:
        return None
    try:
        from elevenlabs.client import ElevenLabs
        from elevenlabs import VoiceSettings
        el = ElevenLabs(api_key=ELEVENLABS_KEY)
        audio = el.text_to_speech.convert(
            voice_id=ELEVENLABS_VOICE,
            text=text[:500],
            model_id="eleven_turbo_v2",
            voice_settings=VoiceSettings(stability=0.5, similarity_boost=0.75)
        )
        return b"".join(audio)
    except Exception as e:
        log.warning(f"ElevenLabs error: {e}")
        return None


# ── Reply helper ─────────────────────────────────────────────────────────────

async def send_reply(update: Update, text: str, use_voice: bool = False):
    chat_id = update.effective_chat.id
    if use_voice and voice_mode.get(chat_id):
        audio = await speak(text)
        if audio:
            with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
                f.write(audio)
                f.flush()
                await update.message.reply_voice(voice=open(f.name, "rb"))
            os.unlink(f.name)
            return
    await update.message.reply_text(text)


# ── Command handlers ──────────────────────────────────────────────────────────

async def cmd_start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    await update.message.reply_text(
        f"Antigravity Orchestra online. Right then boss.\nYour chat ID: {chat_id}\n\n"
        "Commands:\n"
        "/crm — pipeline snapshot\n"
        "/orders — BL orders (24h)\n"
        "/tasks — CRM task list\n"
        "/chatroom — Orchestra chatroom\n"
        "/chat <msg> — post to chatroom as @marcus\n"
        "/brain — agent activity\n"
        "/vm — server health\n"
        "/voice — toggle voice replies\n"
        "/run <script> — trigger VM script\n\n"
        "Or just type/speak — Marcus is listening."
    )


async def cmd_crm(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    snap = get_crm_snapshot()
    lines = [f"Agency Pipeline — £{snap['total']:,}/mo MRR", f"{snap['count']} active deals", ""]
    lines += snap["lines"]
    await update.message.reply_text("\n".join(lines))


async def cmd_orders(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    o = get_orders_snapshot()
    text = (
        f"BL Motorcycles — Last 24h\n"
        f"Orders: {o['count']} | Revenue: £{o['revenue']:.2f}\n"
        f"Pending: {o['pending']}\n"
    )
    if o["rows"]:
        text += "\nRecent:\n"
        for row in o["rows"][:4]:
            sku = (row.get("sku") or row.get("item_sku") or "?")[:15]
            val = f"£{float(row.get('total_price', 0) or 0):.2f}"
            status = row.get("status", "?")
            text += f"• {sku} {val} [{status}]\n"
    await update.message.reply_text(text)


async def cmd_brain(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    lines = get_brain_snapshot()
    text = "Orchestra Chatroom — Latest\n\n" + ("\n".join(lines) if lines else "No recent activity.")
    await update.message.reply_text(text)


async def cmd_chatroom(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    lines = get_chatroom(limit=10)
    text = "Orchestra Chatroom\n\n" + ("\n\n".join(lines) if lines else "No messages yet.")
    await update.message.reply_text(text)


async def cmd_chat(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    msg = " ".join(ctx.args or []).strip()
    if not msg:
        await update.message.reply_text("Usage: /chat <your message to the Orchestra>")
        return
    full_msg = f"[From Jonny via Telegram] {msg}"
    ok = post_to_chatroom(full_msg, agent_id="marcus")
    if ok:
        await update.message.reply_text(f"Posted to Orchestra chatroom:\n\"{msg}\"")
    else:
        await update.message.reply_text("Failed to post — Brain might be offline.")


async def cmd_tasks(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    lines = get_crm_tasks()
    if lines:
        text = f"CRM Tasks — {len(lines)} open\n\n" + "\n".join(lines)
    else:
        text = "No open tasks in CRM. Add some at crm.jonnyai.co.uk"
    await update.message.reply_text(text)


async def cmd_vm(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    stats = get_vm_health()
    text = "VM Health — antigravity-orchestra\n\n" + "\n".join(stats)
    await update.message.reply_text(text)


async def cmd_voice(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    voice_mode[chat_id] = not voice_mode.get(chat_id, False)
    state = "ON" if voice_mode[chat_id] else "OFF"
    await update.message.reply_text(f"Voice replies: {state}")


async def cmd_run(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    SAFE_SCRIPTS = {
        "analytics": "execution/analytics_report.py",
        "heartbeat": "execution/orchestra_heartbeat.py",
        "health":    "execution/vm_health_check.py",
        "crmsync":   "execution/sync_crm_to_brain.py",
        "dreamer":   "execution/dreamer_daily_serverside.py",
    }
    args = " ".join(ctx.args or []).strip().lower()
    if not args or args not in SAFE_SCRIPTS:
        await update.message.reply_text(
            f"Available: {', '.join(SAFE_SCRIPTS.keys())}"
        )
        return
    script = SAFE_SCRIPTS[args]
    await update.message.reply_text(f"Running {args}...")
    import subprocess
    repo = Path(__file__).resolve().parent.parent
    try:
        r = subprocess.run(
            ["python3", script], cwd=str(repo),
            capture_output=True, text=True, timeout=60
        )
        out = (r.stdout + r.stderr)[-800:].strip() or "Done (no output)"
        await update.message.reply_text(f"✓ {args} complete:\n{out}")
    except subprocess.TimeoutExpired:
        await update.message.reply_text(f"⏱ {args} timed out (still running in background)")
    except Exception as e:
        await update.message.reply_text(f"✗ Error: {e}")


# ── Message handlers ──────────────────────────────────────────────────────────

async def handle_text(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    text = update.message.text or ""
    if not text.strip():
        return

    # Build context
    context_parts = []
    now = datetime.now(timezone.utc)
    context_parts.append(f"Current time: {now.strftime('%A %d %B %Y %H:%M UTC')}")

    await update.message.chat.send_action("typing")
    response = await ask_claude(text, "\n".join(context_parts))
    await send_reply(update, response, use_voice=True)


async def handle_voice(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    await update.message.chat.send_action("typing")

    # Download voice file
    voice_file = await update.message.voice.get_file()
    with tempfile.NamedTemporaryFile(suffix=".ogg", delete=False) as f:
        await voice_file.download_to_drive(f.name)
        tmp_path = f.name

    # Transcribe
    transcript = await transcribe_voice(tmp_path)
    os.unlink(tmp_path)

    if transcript.startswith("[transcription failed"):
        await update.message.reply_text("Sorry, couldn't transcribe that voice note.")
        return

    # Echo transcript so Jonny knows what was heard
    await update.message.reply_text(f"🎤 \"{transcript}\"")

    # Process same as text
    now = datetime.now(timezone.utc)
    context = f"Current time: {now.strftime('%A %d %B %Y %H:%M UTC')}"
    response = await ask_claude(transcript, context)
    await send_reply(update, response, use_voice=True)


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    if not TELEGRAM_TOKEN:
        log.error("TELEGRAM_BOT_TOKEN not set in .env")
        sys.exit(1)

    log.info("Starting Antigravity Telegram Bot...")
    app = Application.builder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("start",    cmd_start))
    app.add_handler(CommandHandler("crm",      cmd_crm))
    app.add_handler(CommandHandler("orders",   cmd_orders))
    app.add_handler(CommandHandler("brain",    cmd_brain))
    app.add_handler(CommandHandler("chatroom", cmd_chatroom))
    app.add_handler(CommandHandler("chat",     cmd_chat))
    app.add_handler(CommandHandler("tasks",    cmd_tasks))
    app.add_handler(CommandHandler("vm",       cmd_vm))
    app.add_handler(CommandHandler("voice",    cmd_voice))
    app.add_handler(CommandHandler("run",      cmd_run))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
    app.add_handler(MessageHandler(filters.VOICE, handle_voice))

    log.info("Bot running. Polling for updates...")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
