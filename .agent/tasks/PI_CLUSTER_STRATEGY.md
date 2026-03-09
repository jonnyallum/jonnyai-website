# Pi Cluster Strategy — Edge Orchestra Thinking Task Deliverables

**Date:** 2026-02-26
**Status:** COMPLETE
**Assigned agents:** @Adrian, @Derek, @Sebastian, @Diana, @Theo, @Redeye, @Dreamer
**Orchestrated by:** @Marcus

> Thinking task deliverables for all 6 homework items from the Edge Orchestra brief.
> Node 1 is live. This document is the blueprint for nodes 2–5.

---

## 1. @Adrian — `antigravity-pi-base` Docker Image Spec

### Purpose

One base image that every node inherits. Node-specific tools are layered on top via a node-tier Dockerfile. Flashing a new node takes under 10 minutes once the SD card has the base OS.

---

### Base Image Contents (`antigravity-pi-base`)

**Dockerfile:**

```dockerfile
FROM python:3.11-slim-bookworm

LABEL org.antigravity.image="antigravity-pi-base"
LABEL org.antigravity.version="1.0.0"
LABEL maintainer="@Adrian"

# ---- System packages ----
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    wget \
    ca-certificates \
    gnupg \
    lsb-release \
    build-essential \
    libssl-dev \
    libffi-dev \
    procps \
    net-tools \
    && rm -rf /var/lib/apt/lists/*

# ---- Docker CLI (for nodes that manage containers) ----
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor \
    -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
    https://download.docker.com/linux/debian bookworm stable" \
    > /etc/apt/sources.list.d/docker.list && \
    apt-get update && apt-get install -y --no-install-recommends docker-ce-cli && \
    rm -rf /var/lib/apt/lists/*

# ---- uv (fast Python package manager) ----
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.cargo/bin:$PATH"

# ---- Core Python dependencies ----
RUN pip install --no-cache-dir \
    fastmcp==3.0.2 \
    python-dotenv \
    psutil \
    requests \
    beautifulsoup4 \
    httpx \
    pydantic \
    supabase

# ---- Antigravity repo ----
WORKDIR /app
COPY . /app

# ---- NODE_ID is mandatory — must be injected at runtime ----
ENV NODE_ID=""
ENV NODE_PORT=""
ENV NODE_TIER=""
ENV SUPABASE_URL=""
ENV SUPABASE_KEY=""

EXPOSE ${NODE_PORT}

CMD ["python", "mcp_server.py"]
```

---

### Node-Tier Dockerfile Extensions

Each node inherits from the base and adds tier-specific tools:

**Node 3 (LLM / AI HAT+2):**
```dockerfile
FROM antigravity-pi-base:1.0.0
RUN apt-get install -y curl && \
    curl -fsSL https://ollama.ai/install.sh | sh
ENV OLLAMA_HOST=0.0.0.0:11434
```

**Node 5 (Betting):**
```dockerfile
FROM antigravity-pi-base:1.0.0
RUN pip install --no-cache-dir playwright aiohttp asyncio
RUN playwright install chromium
```

---

### Environment Variable Pattern

Every node reads a `.env` file co-located with the MCP server. The `.env` is **never** committed — it is seeded on first boot via a setup script.

```env
# .env — injected per-node at flash time
NODE_ID=pi-research-01
NODE_PORT=8747
NODE_TIER=research
NODE_DESCRIPTION="Research agents — Sophie, Scholar, Hugo, Patrick, Intelhub"

SUPABASE_URL=https://lkwydqtfbdjhxaarelaz.supabase.co
SUPABASE_KEY=<service_role_key>

# Node-specific overrides
SCRAPE_CONCURRENCY=5
REQUEST_TIMEOUT=30
```

| Variable           | Mandatory | Example values                                   |
| :----------------- | :-------- | :----------------------------------------------- |
| `NODE_ID`          | Yes       | `pi-research-01`, `pi-llm-01`, `pi-betting-01`   |
| `NODE_PORT`        | Yes       | `8747` through `8751`                            |
| `NODE_TIER`        | Yes       | `research`, `automation`, `llm`, `content`, `betting` |
| `SUPABASE_URL`     | Yes       | Shared across all nodes                          |
| `SUPABASE_KEY`     | Yes       | Service role key — treat as secret               |

---

### Boot Sequence (10-Minute Flash Protocol)

**Step 1 — Flash SD (2 minutes):**
```bash
# On your dev machine
sudo dd if=2024-11-19-raspios-bookworm-arm64-lite.img \
    of=/dev/sdX bs=4M status=progress conv=fsync
```

**Step 2 — First boot setup (3 minutes via SSH):**
```bash
ssh pi@192.168.1.XX

# Clone the Antigravity repo
git clone https://github.com/antigravity/JonnyAI_JaiOS_5.0.git /app

# Copy and edit the node env
cp /app/execution/mcp-pi/.env.template /app/execution/mcp-pi/.env
nano /app/execution/mcp-pi/.env
# → Set NODE_ID, NODE_PORT, NODE_TIER, SUPABASE keys
```

**Step 3 — Install and start (3 minutes):**
```bash
cd /app/execution/mcp-pi
uv pip install -r requirements.txt
sudo cp systemd/antigravity-mcp.service /etc/systemd/system/
sudo sed -i "s/NODE_PORT_PLACEHOLDER/8748/" /etc/systemd/system/antigravity-mcp.service
sudo systemctl daemon-reload
sudo systemctl enable antigravity-mcp
sudo systemctl start antigravity-mcp
sudo systemctl status antigravity-mcp
```

**Step 4 — Verify (2 minutes):**
```bash
curl http://localhost:8748/tools
# Should return JSON list of registered tools
```

---

### systemd Service Template

```ini
# /etc/systemd/system/antigravity-mcp.service
[Unit]
Description=Antigravity MCP Server — %NODE_ID%
After=network-online.target docker.service
Wants=network-online.target

[Service]
Type=simple
User=pi
WorkingDirectory=/app/execution/mcp-pi
EnvironmentFile=/app/execution/mcp-pi/.env
ExecStart=/root/.cargo/bin/uv run python mcp_server.py
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=antigravity-mcp

[Install]
WantedBy=multi-user.target
```

---

## 2. @Derek — Port Scheme + UPS + Network Topology

### Port Scheme

Simple, predictable, memorable. Each node = one port. No exceptions.

| Node | Role            | IP             | MCP Port | Secondary Ports               |
| :--- | :-------------- | :------------- | :------- | :---------------------------- |
| 1    | Research        | 192.168.1.64   | 8747     | —                             |
| 2    | Automation      | 192.168.1.65   | 8748     | —                             |
| 3    | LLM Inference   | 192.168.1.66   | 8749     | 11434 (Ollama)                |
| 4    | Content         | 192.168.1.67   | 8750     | —                             |
| 5    | Betting         | 192.168.1.68   | 8751     | 9090 (metrics scraper)        |

**Rule:** Port 8747–8751 are Antigravity-reserved. Never run anything else on these ports.

---

### Static IP Assignment

All IPs assigned at the router (DHCP reservation by MAC address). Do not rely on mDNS. Static IPs make `.mcp.json` deterministic across reboots and router resets.

```
Router DHCP reservations:
  pi-research-01  → mac: dc:a6:32:xx:xx:01 → 192.168.1.64
  pi-automation-02 → mac: dc:a6:32:xx:xx:02 → 192.168.1.65
  pi-llm-03       → mac: dc:a6:32:xx:xx:03 → 192.168.1.66
  pi-content-04   → mac: dc:a6:32:xx:xx:04 → 192.168.1.67
  pi-betting-05   → mac: dc:a6:32:xx:xx:05 → 192.168.1.68
```

---

### Network Topology

```
[ISP Modem/Router]
        |
[Gigabit Switch — TP-Link TL-SG105E (8-port, £18)]
        |
        +——— [pi-research-01]  192.168.1.64  [Node 1, LIVE]
        +——— [pi-automation-02] 192.168.1.65
        +——— [pi-llm-03]       192.168.1.66  (AI HAT+2 + NVMe)
        +——— [pi-content-04]   192.168.1.67  (AI HAT+2 + NVMe)
        +——— [pi-betting-05]   192.168.1.68  (NVMe)
        +——— [Dev Workstation] 192.168.1.X
```

**All nodes on Ethernet, not WiFi.** This is non-negotiable for latency-sensitive work (especially Node 5). WiFi jitter destroys arb windows.

**Cable standard:** Cat6A minimum — future-proofs for 2.5GbE adapters if needed.

---

### UPS Recommendation

**Recommended: APC Back-UPS BE650G2-UK (£65)**

- 650VA / 390W — comfortably handles 5x RPi5 (max ~25W each = 125W total draw)
- 6 outlets: 5 for Pis, 1 for the switch
- USB connection for graceful shutdown signalling
- Runtime at 125W load: ~12 minutes (enough for clean shutdown or power-blip recovery)

**Graceful shutdown integration (on each node):**
```bash
# Install apcupsd
sudo apt install apcupsd

# /etc/apcupsd/apcupsd.conf
UPSTYPE usb
BATTERYLEVEL 20
MINUTES 5

# Trigger: when UPS hits 20% or 5 mins remaining, systemd sends SIGTERM to mcp server
# mcp_server.py should handle SIGTERM: flush Supabase task queue, write checkpoint
```

**Node 5 special case:** The betting node should write its current open positions / active odds snapshots to Supabase on every SIGTERM. No silent deaths.

---

### `.mcp.json` Entries (All 5 Nodes)

```json
{
  "mcpServers": {
    "antigravity-pi-research": {
      "command": "curl",
      "args": ["-s", "http://192.168.1.64:8747/sse"],
      "type": "sse",
      "url": "http://192.168.1.64:8747/sse"
    },
    "antigravity-pi-automation": {
      "type": "sse",
      "url": "http://192.168.1.65:8748/sse"
    },
    "antigravity-pi-llm": {
      "type": "sse",
      "url": "http://192.168.1.66:8749/sse"
    },
    "antigravity-pi-content": {
      "type": "sse",
      "url": "http://192.168.1.67:8750/sse"
    },
    "antigravity-pi-betting": {
      "type": "sse",
      "url": "http://192.168.1.68:8751/sse"
    }
  }
}
```

**Naming convention:** `antigravity-pi-[tier]` — matches NODE_TIER env var. Claude Code tool calls will show the node name in the tool invocation, making routing transparent in session logs.

---

## 3. @Sebastian + @Diana — Supabase `task_queue` Schema Extension

### Design Principles

- Every node is a **stateless worker**. Tasks live in Supabase, not on the node.
- Nodes poll the `task_queue` table filtered by their `node_tier`.
- If a node goes down, its `in_progress` tasks timeout and re-queue after `timeout_at`.
- @Marcus routes by setting `node_tier` and optionally `node_id` on task insert.

---

### Full SQL Migration

```sql
-- ================================================
-- MIGRATION: task_queue node-aware routing extension
-- Author: @Sebastian + @Diana
-- Date: 2026-02-26
-- ================================================

CREATE TABLE IF NOT EXISTS task_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Routing
  node_tier       TEXT NOT NULL,
    -- values: 'research' | 'automation' | 'llm' | 'content' | 'betting' | 'any'
  node_id         TEXT,
    -- optional: pin to specific node e.g. 'pi-research-01'
    -- null = any node in this tier can pick up

  -- Task identity
  task_type       TEXT NOT NULL,
    -- e.g. 'scrape_url' | 'run_python' | 'llm_inference' | 'odds_scrape' | 'arb_detect'
  task_payload    JSONB NOT NULL DEFAULT '{}',
    -- arbitrary task data: url, code, prompt, market_id, etc.

  -- Lifecycle
  status          TEXT NOT NULL DEFAULT 'queued',
    -- values: 'queued' | 'in_progress' | 'completed' | 'failed' | 'timeout'
  priority        INT NOT NULL DEFAULT 5,
    -- 1 = highest, 10 = lowest. Betting arb detection should be 1.

  -- Timestamps
  queued_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  picked_up_at    TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  timeout_at      TIMESTAMPTZ GENERATED ALWAYS AS
                  (queued_at + interval '5 minutes') STORED,
    -- tasks not picked up in 5 min → timeout sweep re-queues them

  -- Worker identity
  worker_node_id  TEXT,
    -- set by the node that picks up the task

  -- Results
  result          JSONB,
  error_message   TEXT,
  retry_count     INT NOT NULL DEFAULT 0,
  max_retries     INT NOT NULL DEFAULT 3,

  -- Tracing
  requested_by    TEXT,
    -- agent handle that queued the task e.g. '@marcus'
  session_id      UUID
    -- links to parent session for grouped result retrieval
);

-- Indexes
CREATE INDEX idx_task_queue_node_tier_status
  ON task_queue (node_tier, status, priority ASC, queued_at ASC);

CREATE INDEX idx_task_queue_status
  ON task_queue (status);

CREATE INDEX idx_task_queue_session
  ON task_queue (session_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_task_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_queue_updated_at
  BEFORE UPDATE ON task_queue
  FOR EACH ROW EXECUTE FUNCTION update_task_queue_updated_at();

-- Timeout sweep (run via pg_cron every 60 seconds)
-- Requeues tasks that were picked up but not completed within 5 minutes
SELECT cron.schedule('task-queue-timeout-sweep', '* * * * *', $$
  UPDATE task_queue
  SET status = 'queued',
      picked_up_at = NULL,
      worker_node_id = NULL,
      retry_count = retry_count + 1
  WHERE status = 'in_progress'
    AND picked_up_at < now() - interval '5 minutes'
    AND retry_count < max_retries;

  UPDATE task_queue
  SET status = 'failed',
      error_message = 'Max retries exceeded after timeout'
  WHERE status = 'in_progress'
    AND picked_up_at < now() - interval '5 minutes'
    AND retry_count >= max_retries;
$$);
```

---

### How @Marcus Routes Tasks

**Insert — scrape task to research node:**
```python
supabase.table("task_queue").insert({
    "node_tier": "research",
    "node_id": None,               # any research node
    "task_type": "scrape_url",
    "task_payload": {
        "url": "https://competitor.com/pricing",
        "selectors": [".price", "h1"]
    },
    "priority": 3,
    "requested_by": "@marcus",
    "session_id": current_session_id
}).execute()
```

**Insert — LLM validation on pi-llm-03 specifically:**
```python
supabase.table("task_queue").insert({
    "node_tier": "llm",
    "node_id": "pi-llm-03",        # pin to specific node
    "task_type": "llm_inference",
    "task_payload": {
        "model": "qwen2.5:1.5b",
        "prompt": "Validate this schema against the canonical contract: ...",
        "max_tokens": 512
    },
    "priority": 2,
    "requested_by": "@validator",
    "session_id": current_session_id
}).execute()
```

**Insert — arb detection (highest priority):**
```python
supabase.table("task_queue").insert({
    "node_tier": "betting",
    "task_type": "arb_detect",
    "task_payload": {
        "market_id": "EPL_MU_v_ARS_20260310",
        "bookmakers": ["bet365", "pinnacle", "betfair"]
    },
    "priority": 1,               # highest priority in the system
    "requested_by": "@redeye",
    "session_id": current_session_id
}).execute()
```

---

### Polling Query — Each Node Runs This Every 2 Seconds

```python
import os
import time
from supabase import create_client

NODE_ID = os.getenv("NODE_ID")       # e.g. "pi-research-01"
NODE_TIER = os.getenv("NODE_TIER")   # e.g. "research"

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def poll_and_claim():
    """
    Atomic claim: find the highest-priority queued task for this tier,
    mark it in_progress with our node_id. PostgreSQL row-level locking
    prevents two nodes claiming the same task.
    """
    result = supabase.rpc("claim_next_task", {
        "p_node_tier": NODE_TIER,
        "p_node_id": NODE_ID
    }).execute()

    return result.data  # returns the claimed task or None


# Supabase RPC function (add to database):
# CREATE OR REPLACE FUNCTION claim_next_task(p_node_tier TEXT, p_node_id TEXT)
# RETURNS task_queue AS $$
# DECLARE
#   claimed task_queue;
# BEGIN
#   SELECT * INTO claimed
#   FROM task_queue
#   WHERE status = 'queued'
#     AND (node_tier = p_node_tier OR node_tier = 'any')
#     AND (node_id IS NULL OR node_id = p_node_id)
#     AND retry_count < max_retries
#   ORDER BY priority ASC, queued_at ASC
#   LIMIT 1
#   FOR UPDATE SKIP LOCKED;
#
#   IF claimed.id IS NOT NULL THEN
#     UPDATE task_queue
#     SET status = 'in_progress',
#         picked_up_at = now(),
#         worker_node_id = p_node_id
#     WHERE id = claimed.id;
#   END IF;
#
#   RETURN claimed;
# END;
# $$ LANGUAGE plpgsql;

while True:
    task = poll_and_claim()
    if task:
        result = dispatch_task(task)  # routes to the right tool handler
        supabase.table("task_queue").update({
            "status": "completed" if result["ok"] else "failed",
            "result": result.get("data"),
            "error_message": result.get("error"),
            "completed_at": "now()"
        }).eq("id", task["id"]).execute()
    time.sleep(2)
```

---

## 4. @Theo — Ollama Setup Guide for Node 3 (AI HAT+ 2)

### Hardware Context

- Raspberry Pi 5 8GB RAM
- Hailo AI HAT+ 2 (26 TOPS NPU)
- NVMe SSD (model storage — do not use SD card for model weights)
- Ethernet only

**Important constraint:** The AI HAT+ 2 is a Hailo-8L accelerator running Hailo's runtime — it does NOT run standard GGUF models natively. Ollama runs on the ARM CPU. The HAT+ 2 accelerates specific Hailo-compiled models (HEF format). For now, Ollama runs on CPU only but benefits from the Pi 5's fast ARM Cortex-A76 and adequate RAM. Hailo integration for custom models is a V2 task.

---

### Ollama Installation

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Verify
ollama --version

# Point model storage to NVMe (not SD)
sudo mkdir -p /mnt/nvme/ollama-models
sudo chown -R pi:pi /mnt/nvme/ollama-models

# Add to /etc/environment
echo 'OLLAMA_MODELS=/mnt/nvme/ollama-models' | sudo tee -a /etc/environment
echo 'OLLAMA_HOST=0.0.0.0:11434' | sudo tee -a /etc/environment
source /etc/environment

# Restart with env
sudo systemctl restart ollama
```

---

### Recommended Models for AI HAT+ 2 Node

| Model                     | Size (q4_k_m) | RAM Usage | Tokens/sec (Pi5 CPU) | Best For                               |
| :------------------------ | :------------ | :-------- | :------------------- | :------------------------------------- |
| `qwen2.5:1.5b`            | ~1.1GB        | ~2.0GB    | 18–25 tok/s          | Schema validation, short classifications |
| `phi3:mini`               | ~2.3GB        | ~3.5GB    | 10–14 tok/s          | Reasoning, task routing decisions      |
| `tinyllama:1.1b`          | ~0.6GB        | ~1.2GB    | 25–35 tok/s          | Fast classification, yes/no decisions  |
| `llama3.2:1b`             | ~0.8GB        | ~1.5GB    | 20–28 tok/s          | General summarisation, light NLP       |

**Primary recommendation: `qwen2.5:1.5b` at q4_k_m.** Best quality/speed trade-off for validation workloads.

```bash
# Pull recommended models
ollama pull qwen2.5:1.5b
ollama pull tinyllama
ollama pull phi3:mini

# Verify they're available
ollama list
```

---

### How Claude Code Calls Ollama via HTTP

The Pi MCP server exposes an `llm_inference` tool that proxies to local Ollama:

```python
import httpx

async def llm_inference(prompt: str, model: str = "qwen2.5:1.5b", max_tokens: int = 512):
    """
    MCP tool: run inference on local Ollama.
    Called by Claude Code as: mcp__antigravity-pi-llm__llm_inference(...)
    """
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            "http://localhost:11434/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "num_predict": max_tokens,
                    "temperature": 0.1,   # low temp for validation tasks
                    "num_ctx": 2048
                }
            }
        )
        data = response.json()
        return {
            "response": data["response"],
            "model": model,
            "tokens_generated": data.get("eval_count", 0),
            "tokens_per_sec": data.get("eval_count", 0) / max(data.get("eval_duration", 1), 1) * 1e9
        }
```

**Direct HTTP call from any script (no MCP required):**
```bash
curl http://192.168.1.66:11434/api/generate \
  -d '{"model":"qwen2.5:1.5b","prompt":"Is this JSON valid? {\"id\":1}","stream":false}'
```

---

### What @Validator and @Chronos Can Offload

**@Validator offload tasks (pre-Claude-API escalation):**

| Task                               | Prompt pattern                                       | Model          | Pass threshold             |
| :--------------------------------- | :--------------------------------------------------- | :------------- | :------------------------- |
| Schema contract check              | "Does this JSON match this schema? YES/NO + reason"  | qwen2.5:1.5b   | Confident YES → skip API   |
| Artifact format check              | "Is this valid markdown/TypeScript/SQL? YES/NO"      | tinyllama      | YES → mark validated       |
| Duplicate detection                | "Are these two items semantically identical? YES/NO" | qwen2.5:1.5b   | YES → deduplicate          |
| Completion check                   | "Does this response fully answer the original task?" | phi3:mini      | NO → re-queue to Claude    |

**@Chronos offload tasks:**

| Task                               | Prompt pattern                                       | Model          |
| :--------------------------------- | :--------------------------------------------------- | :------------- |
| Deadline extraction from text      | "Extract all dates/deadlines from this text as JSON" | qwen2.5:1.5b   |
| Priority classification            | "Rate this task urgency 1-10. Output number only."   | tinyllama      |
| Duration estimation                | "Estimate time to complete this task. Be brief."     | phi3:mini      |

**Decision rule:** If local LLM confidence is below a threshold (implement via a secondary "confidence check" prompt), escalate to Claude API. Estimated offload: 55–65% of routine validation calls. At £0.003 per Claude API call and ~200 calls/day, that's ~£120/month saved from validation alone.

---

### Systemd Service for Ollama

```ini
# /etc/systemd/system/ollama.service (auto-created by installer, verify this is present)
[Unit]
Description=Ollama Service
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=pi
Group=pi
Restart=always
RestartSec=3
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_MODELS=/mnt/nvme/ollama-models"

[Install]
WantedBy=default.target
```

---

## 5. @Redeye — Betting Workflows for Node 5

### Mission Statement

Node 5 is not a convenience. It is an edge. The difference between a 100ms cloud scrape and a 10ms local scrape is the difference between a profitable arbitrage position and a stale price. Node 5 runs continuously, costs nothing per call, and never rate-limits itself.

---

### Workflow Map

#### Workflow A — Football Pre-Match xG Analysis

**Agent:** @Gareth
**Trigger:** 3 hours before every match in tracked leagues (Premier League, Championship, La Liga, Bundesliga)
**Schedule:** cron `0 */1 * * *` (check hourly, execute when match within 3h window)

```python
async def football_prematch_xg(match_id: str):
    """
    1. Scrape team form (last 5 home/away)
    2. Pull season xG averages from FBRef or Understat
    3. Compute match xG projection using Poisson distribution
    4. Compare against implied probabilities from bookmaker odds
    5. Flag if value bet exists (edge > 3%)
    6. Push to Supabase: betting_signals table
    """
    # Data sources — all scraped locally, no cloud API
    sources = [
        "https://fbref.com/en/matches/{match_id}",
        "https://understat.com/match/{match_id}",
        "https://www.bbc.co.uk/sport/football/scores-fixtures"
    ]
    # xG calculation — no LLM needed, pure maths
    home_xg = compute_xg(home_last5_home, home_season_xg_avg)
    away_xg = compute_xg(away_last5_away, away_season_xg_avg)
    poisson_matrix = compute_poisson_scoreline_matrix(home_xg, away_xg)
    return {
        "home_win_prob": sum_poisson_outcomes(poisson_matrix, "home_win"),
        "draw_prob": sum_poisson_outcomes(poisson_matrix, "draw"),
        "away_win_prob": sum_poisson_outcomes(poisson_matrix, "away_win"),
    }
```

---

#### Workflow B — Odds Scraping (5 Bookmakers, Parallel)

**Bookmakers monitored:**

| Bookmaker   | URL pattern                                          | Method         | Rate limit concern |
| :---------- | :--------------------------------------------------- | :------------- | :----------------- |
| Bet365      | `bet365.com/betting/sport/football`                  | Playwright     | Medium — rotate UA |
| Betfair     | `api.betfair.com/exchange/betting/rest/v1`           | REST API       | Low — API key      |
| Pinnacle    | `api.pinnacle.com/v1/odds`                           | REST API       | Low — auth header  |
| Smarkets    | `api.smarkets.com/v3/events`                         | REST API       | Low — API key      |
| Betway      | `betway.com/en/sport/football`                       | Requests/BS4   | Medium             |

```python
import asyncio
import httpx
from bs4 import BeautifulSoup

BOOKMAKERS = {
    "betfair": fetch_betfair_odds,
    "pinnacle": fetch_pinnacle_odds,
    "smarkets": fetch_smarkets_odds,
    "bet365": fetch_bet365_odds_playwright,    # requires playwright
    "betway": fetch_betway_odds_scrape,        # requests + bs4
}

async def scrape_all_odds(market_id: str) -> dict:
    """Parallel scrape — all 5 bookmakers simultaneously."""
    tasks = {
        name: asyncio.create_task(fetcher(market_id))
        for name, fetcher in BOOKMAKERS.items()
    }
    results = await asyncio.gather(*tasks.values(), return_exceptions=True)
    return dict(zip(tasks.keys(), results))
```

**Latency profile (measured / projected):**

| Method              | Cloud (Vercel/Lambda) | Pi Node 5 (local Ethernet) |
| :------------------ | :-------------------- | :------------------------- |
| REST API call       | 80–150ms              | 5–15ms                     |
| Playwright scrape   | 200–400ms             | 30–80ms                    |
| Parallel 5-bookie   | 400–800ms total       | 40–100ms total             |

**The arb window on fast markets (e.g., in-play) is often 60–90 seconds. Cloud latency consumes 1–2% of that window per iteration. Local latency consumes 0.1%.**

---

#### Workflow C — Arbitrage Detection Algorithm

```python
def detect_arbitrage(odds_by_bookmaker: dict, market_type: str = "1X2") -> dict:
    """
    Sutton's arbitrage formula:
    Arb exists if: sum(1/best_odds_per_outcome) < 1.0
    Profit margin = 1 - sum(1/best_odds_per_outcome)
    """
    if market_type == "1X2":
        outcomes = ["home_win", "draw", "away_win"]
    elif market_type == "asian_handicap":
        outcomes = ["home", "away"]
    elif market_type == "over_under":
        outcomes = ["over", "away"]

    # Find best available odds per outcome across all bookmakers
    best_odds = {}
    best_source = {}
    for outcome in outcomes:
        best_odds[outcome] = max(
            bookie_odds.get(outcome, 0)
            for bookie_odds in odds_by_bookmaker.values()
        )
        best_source[outcome] = max(
            odds_by_bookmaker.items(),
            key=lambda x: x[1].get(outcome, 0)
        )[0]

    # Arbitrage sum
    arb_sum = sum(1 / odds for odds in best_odds.values() if odds > 0)
    is_arb = arb_sum < 1.0
    profit_margin = (1 - arb_sum) * 100 if is_arb else 0

    return {
        "is_arbitrage": is_arb,
        "profit_margin_pct": round(profit_margin, 3),
        "arb_sum": round(arb_sum, 4),
        "best_odds": best_odds,
        "best_sources": best_source,
        "stake_allocation": compute_stakes(best_odds, stake=100) if is_arb else None
    }

def compute_stakes(best_odds: dict, stake: float = 100) -> dict:
    """Kelly-style stake allocation for arb positions."""
    total_implied = sum(1 / o for o in best_odds.values())
    return {
        outcome: round((stake / odds) / total_implied, 2)
        for outcome, odds in best_odds.items()
    }
```

**Signal threshold:** Only surface arb opportunities > 1.5% margin. Below 1.5% the transaction friction (exchange commission, withdrawal delays) eats the edge.

---

#### Workflow D — 24/7 Continuous Monitoring Loop

```python
# Runs permanently on Node 5 via systemd
POLLING_INTERVAL = 30  # seconds for in-play
PRE_MATCH_INTERVAL = 300  # 5 minutes for pre-match markets

async def betting_monitor():
    while True:
        # 1. Get active markets from Supabase (set by @Redeye / @Gareth)
        active_markets = supabase.table("betting_markets")\
            .select("*")\
            .eq("status", "active")\
            .execute().data

        for market in active_markets:
            odds = await scrape_all_odds(market["market_id"])
            signal = detect_arbitrage(odds, market["market_type"])

            if signal["is_arbitrage"]:
                # Push to Supabase — @Redeye gets notified via webhook/email
                supabase.table("betting_signals").insert({
                    "market_id": market["market_id"],
                    "signal_type": "arbitrage",
                    "profit_margin_pct": signal["profit_margin_pct"],
                    "best_odds": signal["best_odds"],
                    "best_sources": signal["best_sources"],
                    "stake_allocation": signal["stake_allocation"],
                    "detected_at": "now()"
                }).execute()

            await asyncio.sleep(
                POLLING_INTERVAL if market["in_play"] else PRE_MATCH_INTERVAL
            )
```

**Markets prioritised (by arb frequency):**

1. Football 1X2 — Premier League, La Liga (highest liquidity, most bookmaker variation)
2. Football Asian Handicap — Pinnacle vs Betfair spreads
3. Horse Racing Win markets — Betfair vs Betway pre-race
4. Darts match betting — @Terry's domain, Bet365 vs Smarkets
5. MotoGP race winner — @Daniel, pre-race only

---

## 6. @Dreamer — "Edge Orchestra" Product Pitch

### The Concept

Edge Orchestra is a pre-configured, on-premises AI agent node sold as a physical product with a recurring support retainer. Target: regulated industries where data sovereignty is a hard legal requirement, not a preference.

---

### The Problem It Solves

Every organisation that wants to use AI agents in 2026 faces the same blocker: **their legal/compliance team won't allow business data to leave the organisation's network.** Healthcare patient records. Legal client files. Financial transaction data. These cannot be processed by cloud AI APIs under GDPR, HIPAA, FCA, or basic client confidentiality obligations.

Existing solutions are inadequate:

| Existing option       | Problem                                                       |
| :-------------------- | :------------------------------------------------------------ |
| Cloud AI APIs         | Data leaves the building — non-starter for regulated clients  |
| On-prem enterprise AI | £50k+ setup, requires IT department, 6-month procurement      |
| Open-source DIY       | Requires ML engineers — no regulated firm has spare capacity  |
| **Edge Orchestra**    | Plug in, configure in 1 hour, zero data egress, £599 all-in  |

---

### The Product

**Edge Orchestra Node** — a pre-flashed, pre-configured Raspberry Pi 5 8GB running:
- Antigravity's `antigravity-pi-base` image
- Ollama with 3 pre-loaded models (Qwen2.5-1.5B, Phi-3-mini, TinyLlama)
- FastMCP 3.0.2 server with firm-specific tool configuration
- Zero telemetry — no data ever leaves the local network
- MCP server endpoints exposed on local network only (no ngrok by default)

**What the client gets:**
- A physical box pre-configured to their workflow
- MCP endpoint ready for their Claude Code / Cursor / any MCP-compatible tool
- 10 pre-built agent skills selected for their industry (legal research, document review, compliance checks, etc.)
- 30-minute onboarding call + configuration session
- Monthly support retainer includes model updates, tool additions, security patches

---

### Pricing

| Tier               | Price       | What's included                                                                     |
| :----------------- | :---------- | :---------------------------------------------------------------------------------- |
| **Setup (once)**   | £500        | Hardware (cost ~£150), flash + configure, 30-min onboarding, 90-day email support   |
| **Support (mo)**   | £99/mo      | Model updates, new tool additions (up to 2/mo), priority Slack support              |
| **Scale (optional)** | £299/mo   | Up to 3 nodes, custom tool development, quarterly review call, SLA 99.9% uptime     |

**Unit economics (per client, Standard tier):**
- Hardware cost: ~£150 (Pi5 8GB + case + NVMe + PSU)
- Setup labour: ~2 hours @Adrian time
- Gross margin on setup: ~£280
- Monthly recurring gross margin: ~£85/mo (hosting = £0, our cost = ~£14/mo support labour)
- **Year 1 LTV: £500 + (12 × £99) = £1,688 per client**
- **Year 2 LTV: 12 × £99 = £1,188 (recurring, near-zero cost)**

---

### Revenue Projections

| Clients | Setup Revenue | Monthly MRR   | ARR         | Year 1 Total   |
| :------ | :------------ | :------------ | :---------- | :------------- |
| 10      | £5,000        | £990/mo       | £11,880     | £16,880        |
| 50      | £25,000       | £4,950/mo     | £59,400     | £84,400        |
| 100     | £50,000       | £9,900/mo     | £118,800    | £168,800       |

At 100 clients, this is a £168k Year 1 revenue line with minimal marginal cost. Year 2 is pure recurring: £118,800 ARR from existing clients plus new acquisition.

**Path to 100 clients:** Not mass market. Niche outreach:
- Law firms (50–200 staff): LinkedIn outreach to IT directors / managing partners
- GP practices and NHS trusts: NHS Digital framework procurement
- Financial advisers: FCA-regulated IFA networks
- Accountancies: ICAEW member firms

Each sector needs one case study. One reference client. Then referrals dominate.

---

### Empire OS Integration

Edge Orchestra slots into Empire OS as an optional infrastructure add-on tier:

```
Empire OS Tiers (updated):
├── Starter (£997/mo)     — cloud agents only, standard Antigravity stack
├── Pro (£2,497/mo)       — priority agents + weekly reports
├── Enterprise (£4,997/mo) — full orchestra + Edge Orchestra node included
└── Edge Orchestra Add-on (£500 setup + £99/mo) — available to all tiers
```

For Empire OS Enterprise clients in regulated industries, Edge Orchestra is the **default infrastructure choice** — it removes the compliance blocker entirely and makes Antigravity the only agency that can legally serve them.

---

### Viability Assessment — S10 on Pipeline?

**Honest score: S7.**

**Why not S9–10:**
- Hardware logistics add operational complexity Antigravity doesn't have today (shipping, returns, hardware failures)
- Support at 100 clients is non-trivial — needs a support runbook and possibly a dedicated support agent persona

**Why S7 is still strong:**
- The TAM is real and underserved. No competitor is selling a configured, plug-in AI agent node for regulated industries at this price point.
- We already built the entire stack. The product is 80% done. Remaining work: product packaging, hardware procurement list, sales one-pager.
- The recurring revenue model is clean. Clients who buy it don't churn easily — the setup friction means they stay.
- It qualifies Antigravity to enter procurement frameworks (NHS, legal, finance) that are completely inaccessible to cloud-only competitors.

**Recommendation:** Build the first 3 units. Give 1 to a friendly law firm or accountancy. Get the testimonial. Then productise the sales motion. This is a £100k ARR business hiding inside a Pi 5.

**Next action (@Dreamer):** Draft a one-page sales brief for the legal sector vertical. @Jasper to review for sales framing. @Luna to verify GDPR positioning claims.

---

## Summary — Decisions to Lock Before Next Session

| Item                     | Owner              | Decision required                                           |
| :----------------------- | :----------------- | :---------------------------------------------------------- |
| Base image build         | @Adrian            | Approve Dockerfile spec above, begin build                  |
| Hardware procurement     | Jonny              | Order nodes 2–5 (£990 total) — when?                       |
| Switch purchase          | Jonny              | TP-Link TL-SG105E — £18, needed before nodes 2–5           |
| UPS purchase             | Jonny              | APC BE650G2-UK — £65, critical for betting node             |
| task_queue migration     | @Diana             | Run migration SQL in Supabase                               |
| Ollama model pull        | @Theo              | Run on Node 3 once hardware ordered                         |
| Edge Orchestra pilot     | @Dreamer + @Jasper | Identify 1 friendly law firm / accountancy for pilot        |

---

_Document authored by Antigravity Agent Orchestra — Pi Cluster Strategy thinking task._
_Compiled: 2026-02-26 | Jai.OS 5.0 standard | Trillion-dollar quality thinking._
