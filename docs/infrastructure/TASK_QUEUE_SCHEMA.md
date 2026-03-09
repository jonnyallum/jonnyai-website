# Task Queue Schema — Antigravity Pi Cluster
**Authors:** @Sebastian (The Architect) + @Diana (The Vault)
**Commissioned by:** @Marcus
**Date:** 2026-02-27
**Status:** Production-Ready Design

---

## Architecture Philosophy

> Nodes are STATELESS workers. State lives in Supabase. If a node dies, tasks re-queue automatically.

Each Pi node polls Supabase for tasks assigned to its `node_tier`. Tasks are claimed atomically using `FOR UPDATE SKIP LOCKED` — guarantees no two nodes in the same tier ever claim the same task. Dead nodes are detected by a stale `picked_up_at` timestamp and their tasks are automatically returned to `pending`.

### Node Registry

| Node ID            | Port | Tier         | Primary Agents                                                   |
| :----------------- | :--- | :----------- | :--------------------------------------------------------------- |
| `pi-research-01`   | 8747 | `research`   | @Sophie, @Scholar, @Hugo, @Patrick, @Intelhub, @Parser           |
| `pi-automation-01` | 8748 | `automation` | @Alex, @Nathan, @Syncmaster, @Executor, @Owen, @Chronos          |
| `pi-llm-01`        | 8749 | `llm-a`      | @Marcus, @Sebastian, @Diana, @Delegator, @Steve, @Vigil, @Rowan  |
| `pi-llm-02`        | 8750 | `llm-b`      | @Priya, @Felix, @Grace, @Maya, @Dreamer, @Neo, @Elena, @Vivienne |
| `pi-betting-01`    | 8751 | `betting`    | @Gareth, @Monty, @Redeye, @Pietro, @Terry, @Harry, @Daniel, @Sterling |

---

## 1. Full SQL Migration

**File:** `execution/migrations/006_task_queue.sql`

```sql
-- Migration 006: task_queue + node-aware agent routing
-- Authors: @Sebastian + @Diana | Date: 2026-02-27

CREATE TYPE task_status AS ENUM ('pending', 'picked_up', 'complete', 'failed');

CREATE TYPE node_tier_enum AS ENUM ('research', 'automation', 'llm-a', 'llm-b', 'betting');

CREATE TABLE IF NOT EXISTS task_queue (
    id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_handle    TEXT            NOT NULL,
    node_tier       node_tier_enum  NOT NULL,
    node_id         TEXT,                                   -- NULL = any node in tier
    status          task_status     NOT NULL DEFAULT 'pending',
    retry_count     SMALLINT        NOT NULL DEFAULT 0,
    error_message   TEXT,
    task_type       TEXT            NOT NULL,
    payload         JSONB           NOT NULL DEFAULT '{}',
    result          JSONB           DEFAULT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    picked_up_at    TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    CONSTRAINT valid_agent_handle CHECK (char_length(agent_handle) > 0),
    CONSTRAINT valid_task_type    CHECK (char_length(task_type) > 0),
    CONSTRAINT retry_limit        CHECK (retry_count <= 10)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_queue_polling
    ON task_queue (node_tier, status, created_at ASC) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_task_queue_node_id
    ON task_queue (node_id) WHERE node_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_task_queue_agent
    ON task_queue (agent_handle, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_task_queue_stale
    ON task_queue (picked_up_at, status) WHERE status = 'picked_up';
```

---

## 2. RLS Policies

```sql
ALTER TABLE task_queue ENABLE ROW LEVEL SECURITY;

-- SERVICE ROLE: full access
CREATE POLICY "task_queue_service_all"
    ON task_queue FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- ANON KEY (Pi nodes): SELECT only their tier's pending tasks
CREATE POLICY "task_queue_node_select"
    ON task_queue FOR SELECT TO anon
    USING (
        node_tier = current_setting('app.current_node_tier', true)::node_tier_enum
        AND status = 'pending'
    );

-- ANON KEY: nodes can UPDATE rows in their tier
CREATE POLICY "task_queue_node_update"
    ON task_queue FOR UPDATE TO anon
    USING (node_tier = current_setting('app.current_node_tier', true)::node_tier_enum)
    WITH CHECK (node_tier = current_setting('app.current_node_tier', true)::node_tier_enum);

-- AUTHENTICATED: full read
CREATE POLICY "task_queue_read_authenticated"
    ON task_queue FOR SELECT TO authenticated USING (true);
```

**RLS note:** Each Pi node sets `app.current_node_tier` via `SET LOCAL` at the start of every transaction so the RLS filter scopes it to only its own tier's tasks.

---

## 3. Node Polling Logic

**File:** `execution/edge-node/task_worker.py`

```python
import os, time, json
import psycopg2
from dotenv import load_dotenv

load_dotenv()

NODE_ID           = os.getenv("NODE_ID",   "pi-research-01")
NODE_TIER         = os.getenv("NODE_TIER", "research")
DB_URL            = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")
POLL_INTERVAL_SEC = 5


def get_db():
    return psycopg2.connect(DB_URL)


def poll_and_execute():
    conn = get_db()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute("SET LOCAL app.current_node_tier = %s", (NODE_TIER,))
                cur.execute("""
                    SELECT id, agent_handle, task_type, payload, retry_count
                    FROM   task_queue
                    WHERE  node_tier = %s
                      AND  status    = 'pending'
                      AND  (node_id IS NULL OR node_id = %s)
                    ORDER BY created_at ASC
                    LIMIT  1
                    FOR UPDATE SKIP LOCKED
                """, (NODE_TIER, NODE_ID))

                row = cur.fetchone()
                if not row:
                    return

                task_id, agent_handle, task_type, payload, retry_count = row
                cur.execute("""
                    UPDATE task_queue
                    SET status = 'picked_up', node_id = %s, picked_up_at = NOW()
                    WHERE id = %s
                """, (NODE_ID, task_id))

        print(f"[{NODE_ID}] Executing task {task_id}: {task_type} for @{agent_handle}")
        result, error = dispatch_task(task_type, payload)

        with conn:
            with conn.cursor() as cur:
                if error:
                    cur.execute("""
                        UPDATE task_queue SET status = 'failed', error_message = %s, completed_at = NOW()
                        WHERE id = %s
                    """, (error, task_id))
                else:
                    cur.execute("""
                        UPDATE task_queue SET status = 'complete', result = %s, completed_at = NOW()
                        WHERE id = %s
                    """, (json.dumps(result), task_id))
    finally:
        conn.close()


def dispatch_task(task_type: str, payload: dict) -> tuple:
    try:
        if task_type == "scrape":
            from tools.scraper import scrape_url
            return scrape_url(payload["url"], payload.get("selectors")), None
        elif task_type == "competitor_monitor":
            from tools.scraper import monitor_competitor
            return monitor_competitor(payload["domain"]), None
        elif task_type == "shell":
            from tools.shell import run_shell
            return run_shell(payload["command"], payload.get("timeout_sec", 30)), None
        elif task_type == "validate_agent":
            from tools.validator import validate_agent_skill
            return validate_agent_skill(payload["agent_handle"]), None
        else:
            return None, f"Unknown task_type '{task_type}' on tier '{NODE_TIER}'"
    except Exception as exc:
        return None, str(exc)


if __name__ == "__main__":
    print(f"[{NODE_ID}] Task worker online — tier={NODE_TIER}, poll={POLL_INTERVAL_SEC}s")
    while True:
        try:
            poll_and_execute()
        except Exception as e:
            print(f"[{NODE_ID}] Worker error: {e}")
        time.sleep(POLL_INTERVAL_SEC)
```

---

## 4. Task Routing Function

**File:** `execution/route_task.py`

```python
import os, json
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")

AGENT_NODE_TIER_MAP: dict[str, str] = {
    # research
    "sophie": "research", "scholar": "research", "hugo": "research",
    "patrick": "research", "intelhub": "research", "parser": "research",
    # automation
    "alex": "automation", "nathan": "automation", "syncmaster": "automation",
    "executor": "automation", "owen": "automation", "chronos": "automation",
    "qualityguard": "automation", "validator": "automation", "watcher": "automation",
    "hannah": "automation", "mason": "automation", "julian": "automation",
    "quartermaster": "automation", "successbot": "automation", "finops": "automation",
    # llm-a
    "marcus": "llm-a", "sebastian": "llm-a", "diana": "llm-a", "delegator": "llm-a",
    "steve": "llm-a", "derek": "llm-a", "sam": "llm-a", "vigil": "llm-a",
    "rowan": "llm-a", "milo": "llm-a", "adrian": "llm-a", "victor": "llm-a",
    "luna": "llm-a", "riskguard": "llm-a", "arthur": "llm-a",
    # llm-b
    "priya": "llm-b", "felix": "llm-b", "grace": "llm-b", "maya": "llm-b",
    "dreamer": "llm-b", "neo": "llm-b", "elena": "llm-b", "vivienne": "llm-b",
    "blaise": "llm-b", "contentforge": "llm-b", "boyce": "llm-b", "rocket": "llm-b",
    "quinn": "llm-b", "jasper": "llm-b", "nina": "llm-b", "theo": "llm-b",
    "dashboard": "llm-b", "coursewright": "llm-b", "genesis": "llm-b",
    "winston": "llm-b", "trotter": "llm-b",
    # betting
    "gareth": "betting", "monty": "betting", "redeye": "betting", "pietro": "betting",
    "terry": "betting", "harry": "betting", "daniel": "betting", "sterling": "betting",
}

DEFAULT_TIER = "llm-a"


def get_node_tier(agent_handle: str, conn=None) -> str:
    handle = agent_handle.lower()
    if conn:
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT node_tier FROM agents WHERE id = %s", (handle,))
                row = cur.fetchone()
                if row and row[0]:
                    return row[0]
        except Exception:
            pass
    return AGENT_NODE_TIER_MAP.get(handle, DEFAULT_TIER)


def route_task(agent_handle: str, task_type: str, payload: dict, node_id: str = None) -> str:
    """
    Queue a task to the correct node tier for the given agent.
    Returns the UUID of the created task_queue row.

    Usage:
        task_id = route_task("sophie", "scrape", {"url": "https://example.com"})
        task_id = route_task("gareth", "bet_analysis", {"match_id": "epl_123"})
    """
    conn = psycopg2.connect(DB_URL)
    try:
        tier = get_node_tier(agent_handle, conn)
        with conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO task_queue (agent_handle, node_tier, node_id, task_type, payload, status)
                    VALUES (%s, %s::node_tier_enum, %s, %s, %s, 'pending')
                    RETURNING id
                """, (agent_handle.lower(), tier, node_id, task_type, json.dumps(payload)))
                task_id = str(cur.fetchone()[0])
        print(f"[route_task] Queued '{task_type}' for @{agent_handle} → tier={tier} | id={task_id}")
        return task_id
    finally:
        conn.close()


def route_task_bulk(tasks: list[dict]) -> list[str]:
    """Insert multiple tasks in a single DB round-trip."""
    conn = psycopg2.connect(DB_URL)
    try:
        rows = []
        for t in tasks:
            tier = get_node_tier(t["agent_handle"], conn)
            rows.append((t["agent_handle"].lower(), tier, t.get("node_id"),
                         t["task_type"], json.dumps(t["payload"]), "pending"))
        with conn:
            with conn.cursor() as cur:
                execute_values(cur, """
                    INSERT INTO task_queue (agent_handle, node_tier, node_id, task_type, payload, status)
                    VALUES %s RETURNING id
                """, rows)
                return [str(row[0]) for row in cur.fetchall()]
    finally:
        conn.close()
```

---

## 5. Failover Logic

### SQL View — Stale Task Detection

```sql
CREATE OR REPLACE VIEW stale_tasks AS
SELECT id, agent_handle, node_tier, node_id, task_type, retry_count,
       picked_up_at, NOW() - picked_up_at AS stale_duration, payload
FROM task_queue
WHERE status = 'picked_up' AND picked_up_at < NOW() - INTERVAL '5 minutes';
```

### SQL Function — Atomic Failover Reset

```sql
CREATE OR REPLACE FUNCTION reset_stale_tasks()
RETURNS TABLE (reset_id UUID, agent_handle TEXT, node_tier node_tier_enum, was_node_id TEXT, retry_count SMALLINT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    UPDATE task_queue
    SET status        = 'pending',
        picked_up_at  = NULL,
        node_id       = NULL,
        retry_count   = retry_count + 1,
        error_message = format('Failover reset at %s — was held by %s (attempt %s)',
                               NOW()::TEXT, COALESCE(node_id, 'unknown'), (retry_count + 1)::TEXT)
    WHERE status = 'picked_up' AND picked_up_at < NOW() - INTERVAL '5 minutes' AND retry_count < 10
    RETURNING id, agent_handle, node_tier, node_id, retry_count;
END; $$;
```

### Python Failover Watchdog

**File:** `execution/edge-node/failover_watchdog.py`

```python
import os, time
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_URL         = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")
CHECK_INTERVAL = 60


def run_failover():
    conn = psycopg2.connect(DB_URL)
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM reset_stale_tasks()")
                recovered = cur.fetchall()
        if recovered:
            print(f"[failover_watchdog] Recovered {len(recovered)} stale tasks:")
            for row in recovered:
                task_id, agent, tier, node_id, retries = row
                print(f"  {task_id} | @{agent} | {tier} | was on {node_id} | retry #{retries}")
    finally:
        conn.close()


if __name__ == "__main__":
    print(f"[failover_watchdog] Online — checking every {CHECK_INTERVAL}s")
    while True:
        try:
            run_failover()
        except Exception as e:
            print(f"[failover_watchdog] Error: {e}")
        time.sleep(CHECK_INTERVAL)
```

---

## 6. agents Table Update

```sql
ALTER TABLE agents
    ADD COLUMN IF NOT EXISTS node_tier  node_tier_enum,
    ADD COLUMN IF NOT EXISTS node_id    TEXT;

-- Backfill
UPDATE agents SET node_tier = 'research'   WHERE id IN ('sophie','scholar','hugo','patrick','intelhub','parser');
UPDATE agents SET node_tier = 'automation' WHERE id IN ('alex','nathan','syncmaster','executor','owen','chronos','qualityguard','validator','watcher','hannah','mason','julian','quartermaster','successbot','finops');
UPDATE agents SET node_tier = 'llm-a'      WHERE id IN ('marcus','sebastian','diana','delegator','steve','derek','sam','vigil','rowan','milo','adrian','victor','luna','riskguard','arthur');
UPDATE agents SET node_tier = 'llm-b'      WHERE id IN ('priya','felix','grace','maya','dreamer','neo','elena','vivienne','blaise','contentforge','boyce','rocket','quinn','jasper','nina','theo','dashboard','coursewright','genesis','winston','trotter');
UPDATE agents SET node_tier = 'betting'    WHERE id IN ('gareth','monty','redeye','pietro','terry','harry','daniel','sterling');
```

---

## Deployment Checklist

1. Run `execution/migrations/006_task_queue.sql` in Supabase SQL editor
2. Run the backfill `UPDATE` statements from Section 6
3. Deploy `task_worker.py` to each Pi node with `NODE_ID` and `NODE_TIER` in `.env`
4. Deploy `failover_watchdog.py` to `pi-automation-01` as systemd service
5. Add `route_task.py` to `execution/` and import from orchestration scripts
6. Update `brain_sync.py` agent upsert to include `node_tier` from `AGENT_NODE_TIER_MAP`
7. Smoke test: `python -c "from execution.route_task import route_task; print(route_task('sophie','scrape',{'url':'https://example.com'}))"`

---

## Design Decisions

| Decision | Rationale |
| :--- | :--- |
| `FOR UPDATE SKIP LOCKED` | Postgres-native atomic claim — no double-claiming under concurrent polling |
| `node_tier` enum not FK | Avoids join on every poll; tiers are a fixed, small set |
| `node_id = NULL` default | Enables load-balancing within tier without manual pinning |
| `retry_count <= 10` constraint | Hard cap in DB — prevents runaway retry loops |
| `SECURITY DEFINER` on failover fn | Allows automation node (anon key) to call without service-role credentials |

*@Sebastian (The Architect) + @Diana (The Vault) | 2026-02-27*
