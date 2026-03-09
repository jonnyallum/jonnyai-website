'''
# Master Task List: Antigravity Orchestra & The Spine Deployment

**Date:** 3 March 2026
**Status:** Not Started

This document outlines the full scope of work required to deploy, stabilize, and professionalize the Antigravity Orchestra infrastructure on the GCP VM. It is based on a comprehensive audit performed on this date.

---

### 1. The Spine (Orchestrator Service)

*Objective: Transform the existing CLI script into a robust, production-ready FastAPI service that can handle incoming jobs via API, while retaining the CLI for manual control and testing.*

- [ ] **Refactor `the_spine.py`:**
    - [ ] Create a `FastAPI` app instance.
    - [ ] Move the core orchestration logic (`execute_job`, `marcus_decompose`, etc.) into a dedicated `orchestrator` module/class.
    - [ ] Wrap the existing `argparse` CLI logic within a `if __name__ == "__main__":` block so it doesn't conflict with the Uvicorn server.
- [ ] **Create API Endpoints:**
    - [ ] `POST /job`: Submits a new job. Accepts a JSON body with a `brief`. Returns a `job_id`.
    - [ ] `GET /job/{job_id}`: Retrieves the status, plan, and output of a specific job.
    - [ ] `GET /jobs`: Lists the 100 most recent jobs.
    - [ ] `GET /health`: A simple health check endpoint that returns `{"status": "ok"}`.
- [ ] **Implement Asynchronous Execution:**
    - [ ] When a job is submitted via the API, add it to a queue.
    - [ ] Use `asyncio.create_task` or a background task runner (like `fastapi.BackgroundTasks`) to process the job from the queue without blocking the API response.
- [ ] **Fix Systemd Service:**
    - [ ] Update `the-spine.service` to correctly point to the new FastAPI `app` object (e.g., `execution.the_spine:app`).
    - [ ] Ensure logs are correctly being written to `/home/antigravity-ai/Antigravity_Orchestra/logs/`.
    - [ ] Test `sudo systemctl restart the-spine` and check the status to confirm it runs without errors.

---

### 2. Cron Jobs (Systemd Timers)

*Objective: Migrate all cron jobs from GitHub Actions to systemd timers on the GCP VM for centralized control, statefulness, and reliability.*

- [ ] **Create Systemd Unit & Timer Files for Each Cron:**
    - [ ] **Antigravity - Social Listener** (`social-listener.timer` + `social-listener.service`)
        - *Schedule:* Every 15 minutes.
        - *Action:* Runs `execution/social_listener_serverside.py`.
    - [ ] **Antigravity - Content Calendar** (`content-calendar.timer` + `content-calendar.service`)
        - *Schedule:* 09:55, 13:00, 17:00 UTC.
        - *Action:* Runs `execution/process_content_calendar.py`.
    - [ ] **Antigravity - Dreamer Daily** (`dreamer-daily.timer` + `dreamer-daily.service`)
        - *Schedule:* 07:00 UTC daily.
        - *Action:* Runs `execution/dreamer_daily_serverside.py`.
    - [ ] **Antigravity - Research Daily** (`research-daily.timer` + `research-daily.service`)
        - *Schedule:* 06:00 UTC daily.
        - *Action:* Runs `execution/research_engine.py --daily-cron`.
    - [ ] **Antigravity - Heartbeat** (`heartbeat.timer` + `heartbeat.service`)
        - *Schedule:* Every 6 hours (00, 06, 12, 18 UTC).
        - *Action:* Runs `execution/orchestra_heartbeat.py`. **Note:** This script needs to be fixed to not use `manus-mcp-cli`.
    - [ ] **BL Motorcycles - Stock Sync** (`bl-stock-sync.timer` + `bl-stock-sync.service`)
        - *Schedule:* Every 2 hours.
        - *Action:* Runs `execution/sync_bl_stock.py`.
- [ ] **Deploy & Enable Timers:**
    - [ ] Copy all `.service` and `.timer` files to `/etc/systemd/system/` on the VM.
    - [ ] Run `sudo systemctl daemon-reload`.
    - [ ] Enable and start all timers (e.g., `sudo systemctl enable --now social-listener.timer`).
- [ ] **Disable GitHub Action Workflows:**
    - [ ] Once VM timers are confirmed working, rename the corresponding `.yml` files in `.github/workflows/` to `.yml.disabled` to prevent double execution.

---

### 3. n8n Self-Hosted Setup

*Objective: Install, configure, and expose a self-hosted n8n instance on the VM for advanced workflow automation.*

- [ ] **Install n8n via Docker:**
    - [ ] Create a `docker-compose.yml` file for n8n.
    - [ ] Configure it to use a local volume for data persistence (`/home/antigravity-ai/n8n_data`).
    - [ ] Set up necessary environment variables for timezone (e.g., `TZ=Europe/London`).
- [ ] **Run as a Systemd Service:**
    - [ ] Create an `n8n.service` file to manage the `docker-compose` up/down lifecycle.
    - [ ] Enable and start the service.
- [ ] **Expose via Nginx:**
    - [ ] Create a new Nginx config (`n8n.conf`).
    - [ ] Configure a subdomain (e.g., `n8n.jonnyai.co.uk`) to reverse proxy to the n8n Docker container (port 5678).
    - [ ] **Note:** This will require a DNS A record pointing the subdomain to `34.105.146.38`.
- [ ] **Secure with HTTPS:**
    - [ ] Use `certbot` to issue a free Let's Encrypt SSL certificate for the n8n subdomain.
    - [ ] Configure Nginx to use the SSL certificate and redirect HTTP to HTTPS.

---

### 4. Infrastructure, Security & Wiring

*Objective: Harden the server, establish proper monitoring, and ensure all services are correctly interconnected.*

- [ ] **Nginx & HTTPS for The Spine:**
    - [ ] Update the existing `the-spine` Nginx config.
    - [ ] Add a `server_name` (e.g., `spine.jonnyai.co.uk`).
    - [ ] Use `certbot` to issue and install an SSL certificate.
    - [ ] **Note:** This also requires a DNS A record.
- [ ] **Firewall Rules:**
    - [ ] Confirm UFW is active and only allows traffic on ports 22 (SSH), 80 (HTTP), and 443 (HTTPS).
- [ ] **Log Rotation:**
    - [ ] Configure `logrotate` for all custom log files in `/home/antigravity-ai/Antigravity_Orchestra/logs/`.
- [ ] **Tailscale:**
    - [ ] Re-authenticate and connect Tailscale on the VM to create a secure private network for direct access.
- [ ] **Database Cleanup:**
    - [ ] Delete the orphan "dashboard_builder" agent from the Supabase `agents` table.

---

### 5. Testing & Validation

*Objective: Perform end-to-end testing to ensure every component of the system is functioning as expected.*

- [ ] **The Spine API:**
    - [ ] Submit a test job via `curl` to the `POST /job` endpoint.
    - [ ] Poll the `GET /job/{job_id}` endpoint until status is `complete`.
    - [ ] Verify the output is correct and stored in Supabase.
- [ ] **Systemd Timers:**
    - [ ] Manually trigger each `.service` file (`sudo systemctl start social-listener.service`).
    - [ ] Check the logs (`journalctl -u social-listener.service`) to confirm successful execution.
- [ ] **n8n:**
    - [ ] Access the n8n UI via its new HTTPS subdomain.
    - [ ] Create a simple test workflow that triggers from a webhook and calls The Spine's `/job` endpoint.
- [ ] **Full System Test:**
    - [ ] Post a `[JOB]` message in the Supabase chatroom.
    - [ ] Verify the `social-listener` cron picks it up and submits it to The Spine.
    - [ ] Monitor the job's execution through to completion.
'''
