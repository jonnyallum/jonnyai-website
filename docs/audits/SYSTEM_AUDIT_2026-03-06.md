# 🚨 SYSTEM AUDIT — 2026-03-06
**Audited by:** @marcus (Cline/Claude) | **Time:** 13:34 UTC  
**Scope:** GCP VM (antigravity-orchestra), n8n, BL Motorcycles scripts, GitHub, local workspace

---

## 🔴 CRITICAL FAILURES

### 1. bl-order-processor.service — FAILING EVERY 10 MINUTES
- **Script:** `execution/process_orders.py` (User: `antigravity-ai`, VM: `antigravity-orchestra`)
- **Timer:** `bl-order-processor.timer` — fires every 10 minutes
- **Error 1:** eBay `invalid_grant` — refresh token is DEAD
  ```
  eBay poll error: Token failed: {"error":"invalid_grant",
  "error_description":"the provided authorization refresh token is invalid or was issued to another client"}
  ```
- **Error 2:** Supabase `public.orders` table NOT FOUND
  ```
  Failed to fetch pending orders: Could not find the table 'public.orders' in the schema cache
  Hint: Perhaps you meant the table 'public.players'
  ```
  > **Root cause:** VPS `.env` is pointing at the WRONG Supabase project — `ddjuoeyaoxllockcusgf` has `players` (jonnyai website), not BL Motorcycles orders.
- **Confirmed failures:** 12:51, 13:01, 13:12, 13:22, 13:32 (every 10min all day)
- **Action:** Disabled timer. Must regenerate eBay token + fix Supabase URL.

### 2. GitHub PAT — EXPIRED (401 Bad Credentials)
- **Token:** `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`
- **Impact:** gh CLI broken, GitHub MCP broken, cannot view Action runs, merge PRs, or push via API
- **Action:** Regenerate at https://github.com/settings/tokens — update `.env` and `cline_mcp_settings.json`

### 3. n8n REST API Key — Unauthorized
- **Key in .env:** Stale — returns `{"message":"unauthorized"}`
- **Root cause:** n8n API key was likely regenerated in n8n UI but `.env` was not updated
- **Action:** Log into n8n.jonnyai.co.uk → Settings → API → copy new key → update `.env`

---

## 🟡 ARCHITECTURE DEBT — BL MOTORCYCLES

### VPS Systemd Services (Anaconda-era scripts, should be n8n)

| Service | Timer | Script | Status |
|---------|-------|--------|--------|
| `bl-order-processor.timer` | every 10min | `execution/process_orders.py` | 🔴 BROKEN (disabled) |
| `bl-stock-sync.timer` | every 15min | `execution/sync_bl_stock.py` | 🟡 WORKING but should migrate |

### n8n Workflow Inventory (14 total)

| Workflow | ID | Status |
|----------|-----|--------|
| BL: Dispatch Email to Customer | `HelXvZ4HsjIbATno` | ✅ Keep |
| BL: Overdue Order Escalator | `y6Nh2Fqt4dgx1u9p` | ✅ Keep |
| BL: Oversell Guard | `NJk9uncrrV8scRJA` | ✅ Keep |
| BL: Monday Weekly Ops Summary | `X1lP95P6LucP7uUB` | ✅ Keep |
| Antigravity CRM → Marcus Sync | `IXnG6uZu3LSiPctj` | ✅ Keep |
| BL Motorcycles — Order Cancellation Follow-Up | `9XitRAsKEG2A4BMh` | ⚠️ DUPLICATE — delete |
| BL Motorcycles — Order Cancellation Follow-Up | `F3UUrM965xO9Ug3R` | ⚠️ DUPLICATE — delete |
| BL Motorcycles — Manual Dispatch Alert (Brett) | `LDz7RsTQoaSEnBx3` | ⚠️ DUPLICATE — delete |
| BL Motorcycles — Manual Dispatch Alert (Brett) | `hqZk5CXtXWBguyEt` | ⚠️ DUPLICATE — delete |
| BL Motorcycles — SKU Not Found Ops Alert | `FRcj8vaNDUKwh3Gg` | ⚠️ DUPLICATE — delete |
| BL Motorcycles — SKU Not Found Ops Alert | `uoqZexQDkT5LYJeq` | ⚠️ DUPLICATE — delete |
| bl-order-cancel | `LVhGxQdypNhnIL07` | ⚠️ Old name — delete |
| bl-manual-dispatch | `7fU4cJyQeC9nklEX` | ⚠️ Old name — delete |
| bl-sku-alert | `B1U78Zdoei3DmgAF` | ⚠️ Old name — delete |

**MISSING:** eBay Order Poller workflow (must build to replace `bl-order-processor.service`)

---

## ✅ HEALTHY SYSTEMS

| System | Status | Notes |
|--------|--------|-------|
| n8n | 🟢 UP | Docker, 2 days uptime, n8n.jonnyai.co.uk HTTP 200 |
| Twenty CRM | 🟢 UP | Docker 3hrs, Redis healthy, port 3000 |
| bl-stock-sync | 🟢 WORKING | 11,545 BikeIt + 1,000 CMPO products synced at 13:31 |
| social-listener.timer | 🟢 ACTIVE | fires every 15min |
| heartbeat.timer | 🟢 ACTIVE | fires hourly |
| dreamer-daily.timer | 🟢 ACTIVE | fired 07:00 today |
| research-daily.timer | 🟢 ACTIVE | fired 06:00 today |
| ais-branch-listener.timer | 🟢 ACTIVE | fires midnight daily |
| GCP VM SSH | 🟢 OK | IP: 34.105.146.38, user: antigravity-ai |
| GCP Compute API | 🔴 DISABLED | Wrong project (splendid-light-451420-a0) — should use charged-magnet-489103-g9 |

---

## 📋 PRIORITISED ACTION LIST

| Priority | Owner | Action |
|----------|-------|--------|
| P0 | @derek | Regenerate eBay refresh token via BL eBay dev portal → push to VPS `.env` |
| P0 | @derek | Fix `SUPABASE_URL` in VPS `.env` → must point at BL project, not jonnyai |
| P0 | @nathan | `systemctl disable --now bl-order-processor.timer` on VM (**done by audit**) |
| P1 | @jonny | Regenerate GitHub PAT → update `.env` + `cline_mcp_settings.json` |
| P1 | @nathan | Delete 9 duplicate/old-name n8n workflows |
| P1 | @nathan | Build eBay Order Poller n8n workflow (Schedule → eBay API → Supabase insert) |
| P2 | @nathan | Migrate `bl-stock-sync` to n8n Schedule trigger, then disable systemd timer |
| P2 | @nathan | Update `N8N_API_KEY` in `.env` with fresh key from n8n Settings → API |
| P3 | @derek | Enable Compute Engine API on correct GCP project (`charged-magnet-489103-g9`) |

---

## VM Full Systemd Timer Inventory (2026-03-06)

| Timer | Frequency | Status |
|-------|-----------|--------|
| bl-order-processor.timer | every 10min | 🔴 DISABLED (broken) |
| bl-stock-sync.timer | every 15min | 🟡 Running (migrate to n8n) |
| social-listener.timer | every 15min | ✅ Running |
| content-calendar.timer | every 4hrs | ✅ Running |
| heartbeat.timer | every 1hr | ✅ Running |
| research-daily.timer | daily 06:00 | ✅ Running |
| dreamer-daily.timer | daily 07:00 | ✅ Running |
| ecosystem-audit.timer | daily 08:00 | ✅ Running |
| analytics-report.timer | daily 09:00 | ✅ Running |
| daily-standup.timer | daily 09:50 | ✅ Running |
| agent-ralph-rotation.timer | daily 10:00 | ✅ Running |
| ais-branch-listener.timer | daily 00:00 | ✅ Running |
| repo-scan.timer | weekly Sun | ✅ Scheduled |
| certbot.timer | twice daily | ✅ Running |

---

_Audit posted to Supabase chatroom. Next audit recommended: 2026-03-13_
