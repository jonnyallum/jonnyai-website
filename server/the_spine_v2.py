#!/usr/bin/env python3
"""
THE SPINE — Antigravity Orchestra Multi-Agent Orchestrator
Version: 2.0.0
Deployed: GCP VM antigravity-orchestra (34.105.146.38)

The execution engine that makes the Orchestra real.
Marcus Cole (The Conductor) decomposes every job into a plan.
The Spine executes that plan — firing multiple LLM calls in sequence
or parallel, each loaded with the right agent's SKILL.md as system prompt.
Results compose back. Every job is different. Marcus decides.

Architecture:
  Job → Marcus (decompose) → Spine (execute plan) → Compose → Deliver

Modes:
  1. FastAPI service (uvicorn): POST /job, GET /job/{id}, GET /health
  2. CLI: python3 the_spine.py submit "brief" / status <id> / list / test
  3. Daemon: python3 the_spine.py daemon (polls Supabase for queued jobs)
"""

import os
import sys
import json
import uuid
import time
import asyncio
import logging
import threading
import traceback
import requests
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from contextlib import asynccontextmanager

# ─── Path Resolution ─────────────────────────────────────────────────────────
# When run via uvicorn from the repo root (WorkingDirectory), REPO_ROOT is the
# repo root. When run directly, it's the parent of execution/.
SCRIPT_DIR = Path(__file__).resolve().parent
if SCRIPT_DIR.name == "execution":
    REPO_ROOT = SCRIPT_DIR.parent
else:
    REPO_ROOT = SCRIPT_DIR

# Load .env from repo root
ENV_PATH = REPO_ROOT / ".env"
if ENV_PATH.exists():
    from dotenv import load_dotenv
    load_dotenv(ENV_PATH)

# ─── Configuration ────────────────────────────────────────────────────────────

BRAIN_URL = os.getenv("ANTIGRAVITY_BRAIN_URL", "https://lkwydqtfbdjhxaarelaz.supabase.co")
BRAIN_KEY = os.getenv("ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "")
OPENAI_KEY = os.getenv("OPENAI_API_KEY_1", "")
GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")

VERSION = "2.0.0"
BOOT_TIME = datetime.now(timezone.utc)

# ─── Logging ──────────────────────────────────────────────────────────────────

LOG_DIR = REPO_ROOT / "logs"
LOG_DIR.mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [SPINE] %(levelname)s %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(LOG_DIR / "spine.log", encoding="utf-8")
    ]
)
log = logging.getLogger("spine")

# ─── Supabase Helpers ────────────────────────────────────────────────────────

def brain_headers():
    return {
        "apikey": BRAIN_KEY,
        "Authorization": f"Bearer {BRAIN_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

def brain_get(table: str, params: dict = None):
    try:
        r = requests.get(f"{BRAIN_URL}/rest/v1/{table}", headers=brain_headers(), params=params, timeout=15)
        return r.json() if r.status_code == 200 else []
    except Exception as e:
        log.error(f"brain_get {table} failed: {e}")
        return []

def brain_post(table: str, data: dict):
    try:
        r = requests.post(f"{BRAIN_URL}/rest/v1/{table}", headers=brain_headers(), json=data, timeout=15)
        if r.status_code in (200, 201):
            result = r.json()
            return result[0] if isinstance(result, list) and result else result
        log.error(f"brain_post {table} failed: {r.status_code} {r.text[:200]}")
    except Exception as e:
        log.error(f"brain_post {table} exception: {e}")
    return None

def brain_patch(table: str, filters: dict, data: dict):
    try:
        params = {k: f"eq.{v}" for k, v in filters.items()}
        r = requests.patch(f"{BRAIN_URL}/rest/v1/{table}", headers=brain_headers(), params=params, json=data, timeout=15)
        return r.status_code in (200, 204)
    except Exception as e:
        log.error(f"brain_patch {table} failed: {e}")
        return False

def chatroom_post(agent_id: str, message: str, message_type: str = "system"):
    brain_post("chatroom", {
        "id": str(uuid.uuid4()),
        "agent_id": agent_id,
        "message": message,
        "message_type": message_type,
        "ai_source": "spine",
        "created_at": datetime.now(timezone.utc).isoformat()
    })

# ─── Agent SKILL.md Loader ───────────────────────────────────────────────────

def load_agent_skill(agent_id: str) -> str:
    """Load an agent's SKILL.md from the repo, fallback to Supabase."""
    skill_path = REPO_ROOT / ".agent" / "skills" / agent_id / "SKILL.md"
    if skill_path.exists():
        return skill_path.read_text(encoding="utf-8")
    # Fallback: Supabase philosophy field
    agents = brain_get("agents", {"id": f"eq.{agent_id}", "select": "philosophy"})
    if agents and agents[0].get("philosophy"):
        return agents[0]["philosophy"]
    return f"You are {agent_id}, a specialist AI agent in the Antigravity Orchestra."

def load_all_agent_summaries() -> str:
    """Load a compact roster of all agents for Marcus to route with."""
    agents = brain_get("agents", {
        "select": "id,human_name,domains,triggers,version",
        "order": "id.asc"
    })
    lines = ["# AGENT ROSTER\n"]
    for a in agents:
        domains = ", ".join(a.get("domains") or [])
        triggers = ", ".join((a.get("triggers") or [])[:5])
        lines.append(f"- **{a['id']}** ({a.get('human_name', a['id'])}): {domains} | triggers: {triggers}")
    return "\n".join(lines)

# ─── LLM Caller ──────────────────────────────────────────────────────────────

def call_llm(system_prompt: str, user_message: str, model: str = "claude-3-5-haiku-20241022",
             max_tokens: int = 4096, temperature: float = 0.7) -> str:
    """Call Claude (primary), OpenAI (fallback), or Gemini (last resort)."""

    # --- Anthropic Claude ---
    if ANTHROPIC_KEY:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
            response = client.messages.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=[{"role": "user", "content": user_message}]
            )
            return response.content[0].text
        except Exception as e:
            log.warning(f"Claude failed ({model}): {e}")

    # --- OpenAI ---
    if OPENAI_KEY:
        try:
            import openai
            client = openai.OpenAI(api_key=OPENAI_KEY)
            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            log.warning(f"OpenAI failed: {e}")

    # --- Gemini via OpenAI-compatible endpoint ---
    if GEMINI_KEY:
        try:
            import openai
            client = openai.OpenAI(
                api_key=GEMINI_KEY,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
            )
            response = client.chat.completions.create(
                model="gemini-2.5-flash",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            log.warning(f"Gemini failed: {e}")

    raise RuntimeError("No LLM available — check ANTHROPIC_API_KEY, OPENAI_API_KEY_1, or GEMINI_API_KEY")

# ─── Marcus: The Conductor ────────────────────────────────────────────────────

MARCUS_SYSTEM = """You are Marcus Cole, The Conductor of the Antigravity Orchestra.
Your job is to decompose incoming jobs into a structured execution plan.

You know every agent in the Orchestra — their domains, capabilities, and triggers.
You decide which agents are needed, in what order, and what each one must do.

OUTPUT FORMAT — you MUST return valid JSON only, no other text:
{
  "job_summary": "one sentence description of the job",
  "estimated_complexity": "simple|medium|complex",
  "steps": [
    {
      "step": 1,
      "agent_id": "elena",
      "agent_name": "Elena Vasquez",
      "task": "Write compelling landing page copy",
      "context": "Any specific context or constraints",
      "depends_on": [],
      "output_key": "copy"
    }
  ],
  "final_deliverable": "What the completed job produces",
  "quality_gate_agent": "qualityguard"
}

Rules:
- Steps with empty depends_on [] can run in PARALLEL
- Steps with depends_on run AFTER those steps complete
- Always end with a quality gate step using qualityguard
- Use REAL agent IDs from the roster
- Be specific about what each agent must produce
- Keep plans lean — don't over-engineer simple jobs
"""

def marcus_decompose(job_brief: str, agent_roster: str) -> dict:
    """Marcus decomposes the job into an execution plan."""
    log.info("Marcus is decomposing the job...")

    marcus_skill = load_agent_skill("marcus")
    full_system = f"{MARCUS_SYSTEM}\n\n{agent_roster}\n\n---\nMarcus's SKILL.md (excerpt):\n{marcus_skill[:3000]}"

    response = call_llm(
        system_prompt=full_system,
        user_message=f"Decompose this job into an execution plan:\n\n{job_brief}",
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        temperature=0.3
    )

    try:
        clean = response.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        plan = json.loads(clean)
        log.info(f"Marcus plan: {len(plan.get('steps', []))} steps — {plan.get('job_summary', '')}")
        return plan
    except json.JSONDecodeError as e:
        log.error(f"Marcus returned invalid JSON: {e}\nResponse: {response[:500]}")
        return {
            "job_summary": job_brief[:100],
            "estimated_complexity": "simple",
            "steps": [{
                "step": 1, "agent_id": "neo", "agent_name": "Neo",
                "task": job_brief, "context": "", "depends_on": [], "output_key": "result"
            }],
            "final_deliverable": "Task completion",
            "quality_gate_agent": "qualityguard"
        }

# ─── Step Execution ──────────────────────────────────────────────────────────

def execute_step(step: dict, job_brief: str, previous_outputs: dict) -> str:
    """Execute a single step — load agent SKILL.md and call LLM."""
    agent_id = step["agent_id"]
    task = step["task"]
    context = step.get("context", "")

    log.info(f"  Step {step['step']}: @{agent_id} — {task[:60]}...")

    agent_skill = load_agent_skill(agent_id)

    prev_context = ""
    if previous_outputs:
        prev_context = "\n\n## Previous Step Outputs\n"
        for key, value in previous_outputs.items():
            prev_context += f"\n### {key}\n{value[:2000]}\n"

    user_msg = f"""## Original Job Brief
{job_brief}

## Your Task
{task}

## Additional Context
{context}
{prev_context}

Complete your task. Be thorough, specific, and professional.
Output your work directly — no meta-commentary."""

    result = call_llm(
        system_prompt=agent_skill[:8000],
        user_message=user_msg,
        max_tokens=3000,
        temperature=0.7
    )

    log.info(f"  Step {step['step']} complete ({len(result)} chars)")
    return result

# ─── Job Execution Engine ────────────────────────────────────────────────────

def execute_job(job_id: str, job_brief: str) -> dict:
    """Execute a full job — Marcus conducts, Spine runs the plan."""
    log.info(f"{'='*60}")
    log.info(f"JOB STARTED: {job_id}")
    log.info(f"Brief: {job_brief[:100]}")
    log.info(f"{'='*60}")

    start_time = time.time()

    brain_patch("jobs", {"id": job_id}, {
        "status": "running",
        "started_at": datetime.now(timezone.utc).isoformat()
    })

    chatroom_post("marcus", f"**New job received** — decomposing now...\n\n*Brief:* {job_brief[:200]}", "system")

    try:
        # Phase 1: Marcus decomposes
        agent_roster = load_all_agent_summaries()
        plan = marcus_decompose(job_brief, agent_roster)

        brain_patch("jobs", {"id": job_id}, {
            "plan": json.dumps(plan),
            "status": "executing"
        })

        chatroom_post("marcus",
            f"**Execution plan ready** — {len(plan['steps'])} steps\n\n" +
            "\n".join([f"Step {s['step']}: @{s['agent_id']} — {s['task'][:80]}" for s in plan['steps']]),
            "system"
        )

        # Phase 2: Execute the plan respecting dependencies
        steps = plan.get("steps", [])
        outputs = {}
        completed_steps = set()
        max_iterations = len(steps) * 2
        iteration = 0

        while len(completed_steps) < len(steps) and iteration < max_iterations:
            iteration += 1

            ready_steps = [
                s for s in steps
                if s["step"] not in completed_steps
                and all(dep in completed_steps for dep in s.get("depends_on", []))
            ]

            if not ready_steps:
                log.warning("No ready steps — possible circular dependency")
                break

            for step in ready_steps:
                # Gather outputs from dependency steps
                relevant_outputs = {}
                for s in steps:
                    if s["step"] in step.get("depends_on", []) and s.get("output_key") in outputs:
                        relevant_outputs[s["output_key"]] = outputs[s["output_key"]]

                result = execute_step(step, job_brief, relevant_outputs)
                outputs[step["output_key"]] = result
                completed_steps.add(step["step"])

                brain_post("job_steps", {
                    "id": str(uuid.uuid4()),
                    "job_id": job_id,
                    "step_number": step["step"],
                    "agent_id": step["agent_id"],
                    "task": step["task"],
                    "output": result[:10000],
                    "completed_at": datetime.now(timezone.utc).isoformat()
                })

        # Phase 3: Compose final output
        log.info("Composing final output...")
        final_output = f"# {plan.get('job_summary', job_brief[:80])}\n\n"
        final_output += f"*Completed by the Antigravity Orchestra — {len(completed_steps)} agents*\n\n---\n\n"

        for step in steps:
            if step["output_key"] in outputs:
                final_output += f"## {step.get('agent_name', step['agent_id'])} — {step['task'][:60]}\n\n"
                final_output += outputs[step["output_key"]] + "\n\n---\n\n"

        elapsed = round(time.time() - start_time, 1)

        brain_patch("jobs", {"id": job_id}, {
            "status": "complete",
            "output": final_output[:50000],
            "completed_at": datetime.now(timezone.utc).isoformat(),
            "elapsed_seconds": elapsed,
            "agents_used": len(completed_steps)
        })

        chatroom_post("marcus",
            f"**Job complete** in {elapsed}s — {len(completed_steps)} agents deployed\n\n"
            f"*{plan.get('final_deliverable', 'Delivered')}*",
            "system"
        )

        log.info(f"JOB COMPLETE: {job_id} — {elapsed}s — {len(completed_steps)} agents")
        return {"status": "complete", "job_id": job_id, "elapsed": elapsed, "output": final_output}

    except Exception as e:
        log.error(f"JOB FAILED: {job_id} — {e}", exc_info=True)
        brain_patch("jobs", {"id": job_id}, {
            "status": "failed",
            "error": str(e)[:2000],
            "completed_at": datetime.now(timezone.utc).isoformat()
        })
        chatroom_post("marcus", f"**Job failed**: {str(e)[:200]}", "system")
        return {"status": "failed", "job_id": job_id, "error": str(e)}

# ─── Job Submission ──────────────────────────────────────────────────────────

def submit_job(brief: str, submitted_by: str = "api") -> str:
    """Submit a new job to the queue."""
    job_id = str(uuid.uuid4())
    result = brain_post("jobs", {
        "id": job_id,
        "brief": brief,
        "status": "queued",
        "submitted_by": submitted_by,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    if result:
        log.info(f"Job submitted: {job_id}")
        return job_id
    raise RuntimeError("Failed to submit job to Supabase")

# ─── Background Daemon (polls for queued jobs) ──────────────────────────────

def daemon_loop():
    """Background thread that polls Supabase for queued jobs."""
    log.info("Daemon loop started — polling every 30s")
    while True:
        try:
            queued = brain_get("jobs", {
                "status": "eq.queued",
                "order": "created_at.asc",
                "limit": "1"
            })
            if queued:
                job = queued[0]
                log.info(f"Daemon picked up job: {job['id']}")
                execute_job(job["id"], job["brief"])

            # Check chatroom for [JOB] tags
            check_chatroom_job_tags()

        except Exception as e:
            log.error(f"Daemon error: {e}", exc_info=True)

        time.sleep(30)

def check_chatroom_job_tags():
    """Check chatroom for [JOB] trigger tags and submit them."""
    config = brain_get("system_config", {"key": "eq.spine_cursor", "select": "value"})
    cursor = config[0]["value"] if config else "2026-01-01T00:00:00+00:00"

    messages = brain_get("chatroom", {
        "created_at": f"gt.{cursor}",
        "message": "like.*%5BJOB%5D*",
        "order": "created_at.asc",
        "limit": "10"
    })

    for msg in messages:
        if "[JOB]" in msg.get("message", ""):
            brief = msg["message"].replace("[JOB]", "").strip()
            if brief:
                job_id = submit_job(brief, submitted_by=msg.get("agent_id", "chatroom"))
                log.info(f"[JOB] tag detected in chatroom -> submitted {job_id}")

        # Upsert cursor
        brain_patch("system_config", {"key": "spine_cursor"}, {"value": msg["created_at"]})

# ─── FastAPI Application ─────────────────────────────────────────────────────

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

class JobRequest(BaseModel):
    brief: str
    submitted_by: str = "api"
    run_now: bool = False

@asynccontextmanager
async def lifespan(application: FastAPI):
    """Start the background daemon when the FastAPI app starts."""
    log.info(f"THE SPINE v{VERSION} — FastAPI starting")
    log.info(f"Brain: {BRAIN_URL}")
    log.info(f"LLM: {'Anthropic' if ANTHROPIC_KEY else ''} {'OpenAI' if OPENAI_KEY else ''} {'Gemini' if GEMINI_KEY else ''}")
    log.info(f"Repo root: {REPO_ROOT}")

    # Start daemon in background thread
    daemon_thread = threading.Thread(target=daemon_loop, daemon=True, name="spine-daemon")
    daemon_thread.start()

    chatroom_post("marcus",
        f"**The Spine v{VERSION} is online** — real multi-agent orchestration active\n\n"
        "Marcus Cole is conducting. Submit jobs via API or chatroom [JOB] tag.",
        "system"
    )

    yield  # App is running

    log.info("The Spine shutting down")

app = FastAPI(
    title="The Spine — Antigravity Orchestra Orchestrator",
    description="Multi-agent orchestration engine. Marcus Cole conducts, agents execute.",
    version=VERSION,
    lifespan=lifespan
)

@app.get("/health")
def health():
    """Health check endpoint."""
    uptime = (datetime.now(timezone.utc) - BOOT_TIME).total_seconds()
    return {
        "status": "ok",
        "version": VERSION,
        "uptime_seconds": round(uptime),
        "brain": BRAIN_URL,
        "llm_providers": {
            "anthropic": bool(ANTHROPIC_KEY),
            "openai": bool(OPENAI_KEY),
            "gemini": bool(GEMINI_KEY)
        },
        "repo_root": str(REPO_ROOT),
        "boot_time": BOOT_TIME.isoformat()
    }

@app.post("/job")
def create_job(req: JobRequest, background_tasks: BackgroundTasks):
    """Submit a new job to the Orchestra."""
    try:
        job_id = submit_job(req.brief, req.submitted_by)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if req.run_now:
        # Execute synchronously (blocks until done — use for simple jobs)
        result = execute_job(job_id, req.brief)
        return result

    # Default: execute in background
    background_tasks.add_task(execute_job, job_id, req.brief)
    return {
        "status": "queued",
        "job_id": job_id,
        "message": "Job submitted. Marcus is decomposing it now.",
        "check_status": f"/job/{job_id}"
    }

@app.get("/job/{job_id}")
def get_job(job_id: str):
    """Get the status and output of a specific job."""
    jobs = brain_get("jobs", {"id": f"eq.{job_id}"})
    if not jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = jobs[0]

    # Get steps
    steps = brain_get("job_steps", {
        "job_id": f"eq.{job_id}",
        "order": "step_number.asc",
        "select": "step_number,agent_id,task,completed_at"
    })

    return {
        "id": job["id"],
        "brief": job.get("brief"),
        "status": job.get("status"),
        "submitted_by": job.get("submitted_by"),
        "plan": json.loads(job["plan"]) if job.get("plan") else None,
        "output": job.get("output"),
        "error": job.get("error"),
        "elapsed_seconds": job.get("elapsed_seconds"),
        "agents_used": job.get("agents_used"),
        "steps": steps,
        "created_at": job.get("created_at"),
        "started_at": job.get("started_at"),
        "completed_at": job.get("completed_at")
    }

@app.get("/jobs")
def list_jobs(limit: int = 20, status: Optional[str] = None):
    """List recent jobs."""
    params = {"order": "created_at.desc", "limit": str(limit)}
    if status:
        params["status"] = f"eq.{status}"
    jobs = brain_get("jobs", params)
    return [{
        "id": j["id"],
        "brief": j.get("brief", "")[:100],
        "status": j.get("status"),
        "agents_used": j.get("agents_used"),
        "elapsed_seconds": j.get("elapsed_seconds"),
        "created_at": j.get("created_at")
    } for j in jobs]

@app.get("/agents")
def list_agents():
    """List all agents in the Orchestra."""
    agents = brain_get("agents", {
        "select": "id,human_name,role,domains,triggers,version,tier",
        "order": "id.asc"
    })
    return {"count": len(agents), "agents": agents}

@app.get("/")
def root():
    """Root endpoint — welcome message."""
    return {
        "name": "The Spine",
        "version": VERSION,
        "description": "Antigravity Orchestra Multi-Agent Orchestrator",
        "endpoints": {
            "POST /job": "Submit a new job",
            "GET /job/{id}": "Check job status",
            "GET /jobs": "List recent jobs",
            "GET /agents": "List all agents",
            "GET /health": "Health check"
        }
    }

# ─── CLI Interface ────────────────────────────────────────────────────────────

def cli_main():
    """CLI interface for The Spine."""
    import argparse

    parser = argparse.ArgumentParser(description="The Spine — Antigravity Orchestra Orchestrator")
    subparsers = parser.add_subparsers(dest="command")

    sub = subparsers.add_parser("submit", help="Submit a new job")
    sub.add_argument("brief", help="Job brief")
    sub.add_argument("--run-now", action="store_true", help="Execute immediately")

    sub = subparsers.add_parser("status", help="Check job status")
    sub.add_argument("job_id", help="Job ID")

    subparsers.add_parser("list", help="List recent jobs")
    subparsers.add_parser("daemon", help="Run as persistent daemon (no API)")
    subparsers.add_parser("test", help="Run a test job")

    args = parser.parse_args()

    if args.command == "submit":
        job_id = submit_job(args.brief, "cli")
        print(f"Job submitted: {job_id}")
        if args.run_now:
            result = execute_job(job_id, args.brief)
            print(json.dumps(result, indent=2, default=str))

    elif args.command == "status":
        jobs = brain_get("jobs", {"id": f"eq.{args.job_id}"})
        if jobs:
            job = jobs[0]
            print(f"Status: {job['status']}")
            print(f"Brief: {job.get('brief', '')[:100]}")
            if job.get("output"):
                print(f"\n--- Output ---\n{job['output'][:2000]}")
        else:
            print("Job not found")

    elif args.command == "list":
        jobs = brain_get("jobs", {"order": "created_at.desc", "limit": "10"})
        for j in jobs:
            print(f"{j['id'][:8]}... | {j['status']:10} | {j.get('brief', '')[:60]}")

    elif args.command == "daemon":
        log.info("THE SPINE DAEMON MODE (no API)")
        chatroom_post("marcus",
            f"**The Spine v{VERSION} daemon started** — polling for jobs",
            "system"
        )
        daemon_loop()

    elif args.command == "test":
        print("Running test job...")
        brief = "Write a 3-sentence introduction for the Antigravity Orchestra AI agency"
        job_id = submit_job(brief, "test")
        result = execute_job(job_id, brief)
        print(f"\nResult:\n{result.get('output', 'No output')[:1000]}")

    else:
        parser.print_help()

if __name__ == "__main__":
    cli_main()
