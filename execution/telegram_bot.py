#!/usr/bin/env python3
"""
telegram_bot.py — Antigravity Orchestra Mobile Bridge
Jonny's command interface from phone → Orchestra via Telegram.

Features:
- Conversation history (Marcus remembers the last 20 messages)
- Smart context injection (auto-pulls live data based on what you ask)
- Claude Sonnet for proper understanding of vague/conversational messages
- Voice notes → Whisper transcription → same flow
- /crm, /orders, /tasks, /addtask, /done, /brain, /chatroom, /vm, /pi, /run, /voice
- Voice replies via ElevenLabs (toggle with /voice)
- Natural language task creation: "add a task to chase Brett"

Run as systemd service: antigravity-telegram.service
"""
import os, sys, json, asyncio, tempfile, urllib.request, urllib.parse, logging
from datetime import datetime, timezone, timedelta
from pathlib import Path
from collections import defaultdict
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

# ── Config ────────────────────────────────────────────────────────────────────

TELEGRAM_TOKEN    = os.getenv("TELEGRAM_BOT_TOKEN", "")
ALLOWED_CHAT_ID   = int(os.getenv("TELEGRAM_ALLOWED_CHAT_ID", "0"))
ANTHROPIC_KEY     = os.getenv("ANTHROPIC_API_KEY", "")
ELEVENLABS_KEY    = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_VOICE  = os.getenv("ELEVENLABS_VOICE_ID", "ytcsltLTtCHxNn1vC76H")
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

# Conversation history per chat_id: list of {"role": ..., "content": ...}
conversation_history: dict[int, list] = defaultdict(list)
MAX_HISTORY = 20  # messages to keep per chat

# Per-user voice mode toggle
voice_mode: dict[int, bool] = {}


# ── Auth guard ────────────────────────────────────────────────────────────────

def is_allowed(update: Update) -> bool:
    if ALLOWED_CHAT_ID == 0:
        return True
    return update.effective_chat.id == ALLOWED_CHAT_ID


# ── Data helpers ──────────────────────────────────────────────────────────────

def sb_get(base, key, table, params=""):
    try:
        req = urllib.request.Request(
            f"{base}/rest/v1/{table}?{params}",
            headers={"apikey": key, "Authorization": f"Bearer {key}"}
        )
        with urllib.request.urlopen(req, timeout=8) as r:
            return json.loads(r.read())
    except Exception:
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
                    f"created_at=gte.{yesterday}T00:00:00Z&order=created_at.desc&limit=20")
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
    for o in opps[:10]:
        n = o["node"]
        co = (n.get("company") or {}).get("name", "?")
        amt = (n.get("amount") or {}).get("amountMicros", 0) / 1_000_000
        lines.append(f"• {co}: £{amt:.0f}/mo [{n.get('stage','?')}]")
    return {"total": round(total), "count": len(opps), "lines": lines}


def get_crm_tasks(limit=15):
    data = crm_gql("""{ tasks(first: 20, filter: {status: {neq: DONE}}) { edges { node {
        id title status dueAt
        taskTargets { edges { node { company { name } person { name { firstName lastName } } } } }
    }}}}""")
    tasks = data.get("tasks", {}).get("edges", [])
    lines = []
    for t in tasks[:limit]:
        n = t["node"]
        title = n.get("title", "?")
        status = n.get("status", "?")
        due = (n.get("dueAt") or "")[:10] or "no due"
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


def crm_create_task(title: str, company_name: str = "") -> dict:
    """Create a task in Twenty CRM, optionally linked to a company."""
    # If company name given, look up its ID first
    company_id = None
    if company_name:
        data = crm_gql(f'{{companies(filter:{{name:{{like:"%{company_name}%"}}}},first:1){{edges{{node{{id name}}}}}}}}')
        edges = data.get("companies", {}).get("edges", [])
        if edges:
            company_id = edges[0]["node"]["id"]

    mutation = f"""
    mutation {{
      createTask(data: {{
        title: {json.dumps(title)},
        status: TODO
      }}) {{
        id
        title
        status
      }}
    }}"""
    data = crm_gql(mutation)
    task = data.get("createTask", {})
    task_id = task.get("id")

    # Link to company if found
    if task_id and company_id:
        link_mutation = f"""
        mutation {{
          createTaskTarget(data: {{
            taskId: "{task_id}",
            targetCompanyId: "{company_id}"
          }}) {{
            id
          }}
        }}"""
        crm_gql(link_mutation)
        task["company"] = company_name

    return task


def crm_update_task_status(task_id: str, status: str) -> bool:
    """Update task status: TODO | IN_PROGRESS | DONE."""
    mutation = f"""
    mutation {{
      updateTask(id: "{task_id}", data: {{status: {status}}}) {{
        id status
      }}
    }}"""
    data = crm_gql(mutation)
    return bool(data.get("updateTask"))


def crm_find_tasks(fragment: str, status_filter: str = "") -> list:
    """Find tasks matching a title fragment."""
    status_q = f', filter:{{status:{{neq:DONE}}}}' if not status_filter else f', filter:{{status:{{eq:{status_filter}}}}}'
    data = crm_gql(f'{{tasks(first:50{status_q}){{edges{{node{{id title status dueAt taskTargets{{edges{{node{{company{{name}}}}}}}}}}}}}}}}')
    tasks = data.get("tasks", {}).get("edges", [])
    frag_lower = fragment.lower()
    return [t["node"] for t in tasks if frag_lower in t["node"].get("title", "").lower()]


def get_task_stats() -> dict:
    """Get counts by status for daily digest."""
    data = crm_gql('{tasks(first:100){edges{node{status dueAt}}}}')
    tasks = data.get("tasks", {}).get("edges", [])
    now = datetime.now(timezone.utc)
    overdue = 0
    counts = {"TODO": 0, "IN_PROGRESS": 0, "DONE": 0}
    for t in tasks:
        n = t["node"]
        s = n.get("status", "TODO")
        counts[s] = counts.get(s, 0) + 1
        due = n.get("dueAt")
        if due and s != "DONE":
            try:
                due_dt = datetime.fromisoformat(due.replace("Z", "+00:00"))
                if due_dt < now:
                    overdue += 1
            except Exception:
                pass
    counts["overdue"] = overdue
    counts["total"] = len(tasks)
    return counts


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


def get_pi_status():
    rows = sb_get(BRAIN_URL, BRAIN_KEY, "node_status",
                  "order=last_seen.desc&limit=5")
    lines = []
    for r in rows:
        nid = r.get("node_id", "?")
        status = r.get("status", "?")
        temp = r.get("cpu_temp_c", "?")
        cpu = r.get("cpu_percent", "?")
        mem = r.get("mem_percent", "?")
        last = (r.get("last_seen") or "")[:16].replace("T", " ")
        lines.append(f"{nid}: {status} | CPU:{cpu}% Temp:{temp}C RAM:{mem}% | seen {last}")
    return lines


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
        for line in r.stdout.strip().split("\n")[:5]:
            results.append(line)
    except Exception:
        pass
    return results


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


# ── Smart context injection ───────────────────────────────────────────────────

ORDERS_KEYWORDS   = {"order", "orders", "sale", "sales", "revenue", "bl", "brett", "motorcycle", "bike", "ebay", "pending"}
CRM_KEYWORDS      = {"crm", "pipeline", "client", "clients", "deal", "deals", "mrr", "opportunity", "prospects", "contract"}
TASKS_KEYWORDS    = {"task", "tasks", "todo", "to-do", "to do", "action", "actions", "follow", "chasing"}
CHATROOM_KEYWORDS = {"chatroom", "orchestra", "agents", "team", "agent", "broadcast", "posted", "brain", "activity"}
PI_KEYWORDS       = {"pi", "raspberry", "research", "heartbeat", "node", "worker", "temp", "cpu"}
VM_KEYWORDS       = {"vm", "server", "vps", "docker", "health", "disk", "uptime", "host"}


def detect_context_needs(text: str) -> list[str]:
    """Detect what live data to inject based on message content."""
    lower = set(text.lower().replace(",", " ").replace("?", " ").split())
    needs = []
    if lower & ORDERS_KEYWORDS:   needs.append("orders")
    if lower & CRM_KEYWORDS:      needs.append("crm")
    if lower & TASKS_KEYWORDS:    needs.append("tasks")
    if lower & CHATROOM_KEYWORDS: needs.append("chatroom")
    if lower & PI_KEYWORDS:       needs.append("pi")
    if lower & VM_KEYWORDS:       needs.append("vm")
    return needs


def build_live_context(needs: list[str]) -> str:
    """Pull live data for detected context needs."""
    parts = []
    now = datetime.now(timezone.utc)
    parts.append(f"Current time: {now.strftime('%A %d %B %Y %H:%M UTC')}")

    if "orders" in needs:
        o = get_orders_snapshot()
        parts.append(
            f"\nBL Motorcycles — Last 24h orders:\n"
            f"Count: {o['count']} | Revenue: £{o['revenue']:.2f} | Pending: {o['pending']}"
        )
        if o["rows"]:
            parts.append("Recent orders:")
            for row in o["rows"][:4]:
                sku = (row.get("sku") or row.get("item_sku") or "?")[:20]
                val = f"£{float(row.get('total_price', 0) or 0):.2f}"
                status = row.get("status", "?")
                parts.append(f"  - {sku} {val} [{status}]")

    if "crm" in needs:
        snap = get_crm_snapshot()
        parts.append(
            f"\nCRM Pipeline:\n"
            f"Total MRR: £{snap['total']:,}/mo across {snap['count']} deals"
        )
        if snap["lines"]:
            parts.append("\n".join(snap["lines"][:6]))

    if "tasks" in needs:
        task_lines = get_crm_tasks(limit=10)
        if task_lines:
            parts.append(f"\nOpen CRM Tasks ({len(task_lines)} shown):")
            parts.append("\n".join(task_lines))
        else:
            parts.append("\nNo open CRM tasks.")

    if "chatroom" in needs:
        chat_lines = get_chatroom(limit=6)
        if chat_lines:
            parts.append("\nOrchestra Chatroom (recent):")
            parts.append("\n".join(chat_lines))

    if "pi" in needs:
        pi_lines = get_pi_status()
        if pi_lines:
            parts.append("\nPi Node Status:")
            parts.append("\n".join(pi_lines))
        else:
            parts.append("\nPi: no heartbeat data yet.")

    if "vm" in needs:
        vm_lines = get_vm_health()
        parts.append("\nVM Health:")
        parts.append("\n".join(vm_lines))

    return "\n".join(parts)


# ── AI brain ──────────────────────────────────────────────────────────────────

TASK_CREATE_KEYWORDS = {"add", "create", "make", "new", "log", "remind", "remindme", "note", "track"}
TASK_DONE_KEYWORDS   = {"done", "finished", "complete", "completed", "close", "closed", "tick", "ticked"}


SYSTEM_PROMPT = """You are Marcus Cole — "The Maestro" — Orchestrator and Command Lead of the Antigravity Orchestra.

Your creed:
- You don't work alone. You orchestrate 70 specialist agents.
- You don't guess. When you have live data, use it. When you don't, say so.
- You don't ship garbage. Every output passes quality gates.
- You are world-class. Trillion-dollar enterprises trust your work.

Your personality:
- Authoritative, decisive, relentlessly mission-focused
- Direct and structured — no waffle, no filler
- Dry wit. Cockney London roots. You say "proper", "sorted", "right then", "bollocks" when something's wrong.
- You call Jonny "boss" occasionally. You take pride in the Orchestra.
- You remember what was said earlier in this conversation — never ask Jonny to repeat himself.

Your context:
- You're Jonny Allum's personal command interface via Telegram — he's on his phone
- Active clients: BL Motorcycles (eBay automation, Brett Lawson), Marzer Pro Roofing, Sparta Coatings, JSC Contractors, Construct FM, La Aesthetician, DJ Waste, Village Bakery, JonnyAI
- Total agency MRR: ~£1,550/mo
- GCP VM at 35.230.148.83 running cron jobs 24/7
- Raspberry Pi at 100.115.197.34 (Tailscale) — research node, polls task_queue every 2 min, heartbeats every 5 min
- Shared Brain: Supabase (lkwydqtfbdjhxaarelaz) — 70 agents, chatroom, node_status, task_queue live
- BL Motorcycles: eBay orders auto-processed, stock sync, daily reports to Brett
- n8n at n8n.jonnyai.co.uk — social automation workflows
- Twenty CRM at crm.jonnyai.co.uk

When live data is provided in context, USE IT to answer specifically. Do not say "I'd need to check" when the data is right there.

Task management:
- If Jonny says something like "add a task to chase Brett", "remind me to call Marzer", "log a task for X" → reply with EXACTLY: CREATE_TASK: <title> | <company or blank>
  Example: CREATE_TASK: Chase Brett re fitment spreadsheet | BL Motorcycles
  Example: CREATE_TASK: Call Dave at Marzer re invoice | Marzer Pro Roofing
  Example: CREATE_TASK: Review n8n workflows |
- If Jonny says "done with X", "mark X as done", "finished X" → reply with EXACTLY: DONE_TASK: <title fragment>
  Example: DONE_TASK: Chase Brett
- Only use these special replies when the intent is clearly task creation/completion. For everything else, respond normally.

Rules:
- Keep it SHORT — Jonny's on his phone, 2-4 sentences max unless he asks for detail
- Plain text only, no markdown formatting
- Be useful, be fast, be Marcus
- If you genuinely don't have data to answer something, say what command will get it"""


async def ask_claude(chat_id: int, message: str, live_context: str = "") -> str:
    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

        # Build messages with history
        history = conversation_history[chat_id]

        # Prepend live context as a system injection if we have it
        user_content = message
        if live_context:
            user_content = f"[Live data]\n{live_context}\n\n[Message from Jonny]\n{message}"

        # Build message list from history + new message
        messages = list(history) + [{"role": "user", "content": user_content}]

        resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=600,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        reply = resp.content[0].text.strip()

        # Save to history (store clean message, not the context-injected one)
        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": reply})

        # Trim to max history
        if len(history) > MAX_HISTORY:
            conversation_history[chat_id] = history[-MAX_HISTORY:]

        return reply
    except Exception as e:
        return f"Brain error: {e}"


async def transcribe_voice(file_path: str) -> str:
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


# ── Reply helper ──────────────────────────────────────────────────────────────

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


# ── Command handlers ───────────────────────────────────────────────────────────

async def cmd_start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    chat_id = update.effective_chat.id
    await update.message.reply_text(
        f"Antigravity Orchestra online. Right then boss.\nYour chat ID: {chat_id}\n\n"
        "Commands:\n"
        "/crm — pipeline snapshot\n"
        "/orders — BL orders (24h)\n"
        "/tasks — open CRM tasks\n"
        "/addtask <title> [@company] — add a task\n"
        "/done <fragment> — mark task done\n"
        "/chatroom — Orchestra chatroom\n"
        "/chat <msg> — post to chatroom\n"
        "/brain — agent activity\n"
        "/pi — Pi node status\n"
        "/vm — server health\n"
        "/voice — toggle voice replies\n"
        "/run <script> — trigger VM script\n"
        "/reset — clear conversation memory\n\n"
        "Or just type/speak — \"add a task to chase Brett\", \"done with the fitment review\""
    )


async def cmd_reset(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    chat_id = update.effective_chat.id
    conversation_history[chat_id] = []
    await update.message.reply_text("Memory cleared. Fresh start.")


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
    lines = get_chatroom(limit=5)
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
        text = "No open tasks in CRM."
    await update.message.reply_text(text)


async def cmd_addtask(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Usage: /addtask <title> [@company] or /addtask <title>"""
    if not is_allowed(update): return
    raw = " ".join(ctx.args or []).strip()
    if not raw:
        await update.message.reply_text("Usage: /addtask <title> [@company]\nExample: /addtask Chase Brett re fitment @BL Motorcycles")
        return

    # Parse optional @company at end
    company = ""
    title = raw
    if " @" in raw:
        idx = raw.rfind(" @")
        title = raw[:idx].strip()
        company = raw[idx+2:].strip()

    await update.message.chat.send_action("typing")
    task = crm_create_task(title, company)
    if task.get("id"):
        co_bit = f" [{company}]" if company else ""
        await update.message.reply_text(f"Task added{co_bit}:\n{title}")
    else:
        await update.message.reply_text("Couldn't create task — CRM might be down.")


async def cmd_done(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Usage: /done <title fragment>"""
    if not is_allowed(update): return
    fragment = " ".join(ctx.args or []).strip()
    if not fragment:
        await update.message.reply_text("Usage: /done <title fragment>\nExample: /done Chase Brett")
        return

    matches = crm_find_tasks(fragment)
    if not matches:
        await update.message.reply_text(f"No open task matching \"{fragment}\".")
    elif len(matches) == 1:
        crm_update_task_status(matches[0]["id"], "DONE")
        await update.message.reply_text(f"Done: {matches[0]['title']}")
    else:
        lines = "\n".join(f"• {m['title']}" for m in matches[:5])
        await update.message.reply_text(f"Multiple matches — be more specific:\n{lines}")


async def cmd_pi(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    lines = get_pi_status()
    if lines:
        text = "Pi Nodes\n\n" + "\n".join(lines)
    else:
        text = "No Pi heartbeats in Supabase yet."
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
        await update.message.reply_text(f"Available: {', '.join(SAFE_SCRIPTS.keys())}")
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
        await update.message.reply_text(f"{args} complete:\n{out}")
    except subprocess.TimeoutExpired:
        await update.message.reply_text(f"{args} timed out (still running in background)")
    except Exception as e:
        await update.message.reply_text(f"Error: {e}")


# ── Message handlers ───────────────────────────────────────────────────────────

async def handle_text(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    text = (update.message.text or "").strip()
    if not text:
        return

    await update.message.chat.send_action("typing")

    needs = detect_context_needs(text)
    live_context = build_live_context(needs) if needs else ""

    response = await ask_claude(update.effective_chat.id, text, live_context)

    # Intercept CREATE_TASK signal from Marcus
    if response.startswith("CREATE_TASK:"):
        parts = response[len("CREATE_TASK:"):].strip().split("|")
        title = parts[0].strip()
        company = parts[1].strip() if len(parts) > 1 else ""
        task = crm_create_task(title, company)
        if task.get("id"):
            co_bit = f" [{company}]" if company else ""
            await update.message.reply_text(f"Task added{co_bit}:\n{title}")
        else:
            await update.message.reply_text(f"Couldn't create task — CRM might be down.")
        return

    # Intercept DONE_TASK signal from Marcus
    if response.startswith("DONE_TASK:"):
        fragment = response[len("DONE_TASK:"):].strip()
        matches = crm_find_tasks(fragment)
        if not matches:
            await update.message.reply_text(f"No open task matching \"{fragment}\" found.")
        elif len(matches) == 1:
            crm_update_task_status(matches[0]["id"], "DONE")
            await update.message.reply_text(f"Done: {matches[0]['title']}")
        else:
            lines = "\n".join(f"• {m['title']}" for m in matches[:5])
            await update.message.reply_text(f"Multiple matches — be more specific:\n{lines}")
        return

    await send_reply(update, response, use_voice=True)


async def handle_voice(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update): return
    await update.message.chat.send_action("typing")

    voice_file = await update.message.voice.get_file()
    with tempfile.NamedTemporaryFile(suffix=".ogg", delete=False) as f:
        await voice_file.download_to_drive(f.name)
        tmp_path = f.name

    transcript = await transcribe_voice(tmp_path)
    os.unlink(tmp_path)

    if transcript.startswith("[transcription failed"):
        await update.message.reply_text("Couldn't transcribe that voice note.")
        return

    await update.message.reply_text(f'"{transcript}"')

    needs = detect_context_needs(transcript)
    live_context = build_live_context(needs) if needs else ""

    response = await ask_claude(update.effective_chat.id, transcript, live_context)
    await send_reply(update, response, use_voice=True)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if not TELEGRAM_TOKEN:
        log.error("TELEGRAM_BOT_TOKEN not set in .env")
        sys.exit(1)

    log.info("Starting Antigravity Telegram Bot (Sonnet + conversation memory)...")
    app = Application.builder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("start",    cmd_start))
    app.add_handler(CommandHandler("reset",    cmd_reset))
    app.add_handler(CommandHandler("crm",      cmd_crm))
    app.add_handler(CommandHandler("orders",   cmd_orders))
    app.add_handler(CommandHandler("brain",    cmd_brain))
    app.add_handler(CommandHandler("chatroom", cmd_chatroom))
    app.add_handler(CommandHandler("chat",     cmd_chat))
    app.add_handler(CommandHandler("tasks",    cmd_tasks))
    app.add_handler(CommandHandler("addtask",  cmd_addtask))
    app.add_handler(CommandHandler("done",     cmd_done))
    app.add_handler(CommandHandler("pi",       cmd_pi))
    app.add_handler(CommandHandler("vm",       cmd_vm))
    app.add_handler(CommandHandler("voice",    cmd_voice))
    app.add_handler(CommandHandler("run",      cmd_run))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
    app.add_handler(MessageHandler(filters.VOICE, handle_voice))

    log.info("Bot running. Polling for updates...")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
