# VM & Enterprise Recovery Plan — 2026-03-08

**Status at time of writing:** Multiple systems stabilised by this session. Remaining items require manual access to n8n or VM.

---

## ✅ FIXED THIS SESSION

| What | Fix |
|------|-----|
| Social Listener `UnboundLocalError: os` | Module-level image imports, UK English prompt |
| Orchestra Heartbeat `NameError: USE_MCP` | Removed undefined variable reference |
| Social listener timeout too short | Extended `timeout-minutes: 5 → 12` |
| Auto-sync workflow 403 push error | Added `permissions: contents: write` |
| BL Order Processor missing Supabase env | Added all secrets to workflow YAML |
| 43 eBay listings under £50 (BIKEIT) | Withdrawn via `bulk_withdraw_offers` |
| GitHub MCP added to `.mcp.json` | New PAT configured |
| Twenty CRM `uuid_generate_v4` error | Enabled `uuid-ossp` + `pgcrypto` in CRM Postgres |

---

## 🔴 CRITICAL — MANUAL ACTION REQUIRED

### 1. EMAIL LOOP — STOP IMMEDIATELY

**Problem:** Something on n8n is auto-replying to inbound emails from Postmark.
The subject line shows 40+ "Re:" prefixes — an infinite loop started from "Join your team on Twenty".
100+ junk chatroom entries created today (10:42 → 20:24 UTC).

**Root cause:** n8n inbound email workflow receives email to `marcus@jonnyai.co.uk` → auto-replies → Postmark receives reply as new inbound → loops.

**Fix (do now):**
1. Go to `https://n8n.jonnyai.co.uk`
2. Find the "Marcus Email" or "Inbound Email" workflow
3. **PAUSE IT** immediately
4. Add a guard condition before the reply step:
   - `If sender domain == "jonnyai.co.uk" → skip (do not reply)`
   - OR: `If "Re: Re: Re:" appears in subject → skip`
5. Re-enable workflow

---

### 2. n8n API KEY — REGENERATE

**Problem:** n8n REST API key is stale (returns 401). This breaks any programmatic workflow management.

**Fix:**
1. `https://n8n.jonnyai.co.uk` → Settings → API → Generate new key
2. Update on VM: `sudo nano /home/antigravity-ai/antigravity/.env` → set `N8N_API_KEY=<new_key>`
3. Update GitHub secret: `gh secret set N8N_API_KEY --body "<new_key>"` (in Antigravity_Orchestra repo)

---

### 3. DELETE DUPLICATE n8n WORKFLOWS

Per the 2026-03-06 audit, 9 duplicate/old-name workflows exist. Log into n8n and delete:

| Workflow ID | Name | Action |
|-------------|------|--------|
| `9XitRAsKEG2A4BMh` | BL Motorcycles — Order Cancellation Follow-Up (dup) | Delete |
| `F3UUrM965xO9Ug3R` | BL Motorcycles — Order Cancellation Follow-Up (dup) | Delete |
| `LDz7RsTQoaSEnBx3` | BL Motorcycles — Manual Dispatch Alert (dup) | Delete |
| `hqZk5CXtXWBguyEt` | BL Motorcycles — Manual Dispatch Alert (dup) | Delete |
| `FRcj8vaNDUKwh3Gg` | BL Motorcycles — SKU Not Found Ops Alert (dup) | Delete |
| `uoqZexQDkT5LYJeq` | BL Motorcycles — SKU Not Found Ops Alert (dup) | Delete |
| `LVhGxQdypNhnIL07` | bl-order-cancel (old name) | Delete |
| `7fU4cJyQeC9nklEX` | bl-manual-dispatch (old name) | Delete |
| `B1U78Zdoei3DmgAF` | bl-sku-alert (old name) | Delete |

---

## 🟡 IMPORTANT — VM MAINTENANCE

### 4. VM `.env` File Corrections

SSH: `ssh antigravity-ai@34.105.146.38`

Edit: `sudo nano /home/antigravity-ai/antigravity/.env`

Required changes:
```bash
# Fix BL Supabase URL (was pointing at jonnyai project)
SUPABASE_URL=https://ddjuoeyaoxllockcusgf.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE

# Update GitHub PAT (old one expired)
GITHUB_PAT=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
```

After editing: `sudo systemctl restart bl-stock-sync` (if running on VM)

---

### 5. WIRE UP 4 BL n8n WORKFLOWS

These 4 workflows need credentials configured in n8n UI:

| Workflow ID | Name | What to configure |
|-------------|------|-------------------|
| `HelXvZ4HsjIbATno` | BL: Dispatch Email to Customer | Postmark API key + BL Supabase creds |
| `y6Nh2Fqt4dgx1u9p` | BL: Overdue Order Escalator | BL Supabase creds + email |
| `NJk9uncrrV8scRJA` | BL: Oversell Guard | BL Supabase + eBay creds |
| `X1lP95P6LucP7uUB` | BL: Monday Weekly Ops Summary | BL Supabase + email |

---

### 6. EBAY REFRESH TOKEN — REGENERATE

The eBay refresh token on the VM was invalid (`invalid_grant`). The `.mcp.json` token may also be near expiry.

Steps:
1. Log into eBay Developer Portal: `https://developer.ebay.com`
2. Generate new User Token for `BLMotorcycles` account
3. Update in:
   - VM `.env`: `EBAY_REFRESH_TOKEN=<new_token>`
   - `.mcp.json` env: `EBAY_REFRESH_TOKEN`
   - GitHub Secrets: `gh secret set EBAY_REFRESH_TOKEN --body "<new_token>"`

---

## 🟢 HEALTHY (CONFIRMED WORKING)

| System | Status |
|--------|--------|
| GitHub Actions: Social Listener | Fixed — running every 15min |
| GitHub Actions: Orchestra Heartbeat | Fixed — running 4x/day |
| GitHub Actions: BL Order Processor | Fixed — running every 30min |
| GitHub Actions: BL Stock Sync | Working (hardcoded creds) |
| GitHub Actions: Dreamer Daily | Working |
| GitHub Actions: Scholar Research | Working |
| GitHub Actions: Content Calendar | Working |
| BL Supabase | Healthy |
| Antigravity Brain Supabase | Healthy |
| Twenty CRM Postgres extensions | Fixed (uuid-ossp enabled) |
| eBay MCP | Healthy — 7718 inventory items |
| n8n UI | Reachable at n8n.jonnyai.co.uk |

---

## ⚠️ ARCHITECTURAL NOTE: VM vs GitHub Actions

The VM runs **systemd timers** that duplicate GitHub Actions workflows. Both systems run:
- Social listener (VM: every 15min, GHA: every 15min) → **DOUBLE RUNNING**
- Orchestra heartbeat (VM: every 1hr, GHA: every 6hr) → overlapping

**Recommendation:** Decide on ONE execution environment per job. Suggested split:
- **GitHub Actions** → Social Listener, Heartbeat, Dreamer, Research, BL Order Processor
- **VM systemd** → Stock Sync (FTP access), long-running processes, always-on services
- **n8n** → BL customer comms, email dispatch, order escalation

---

_Next audit recommended: 2026-03-15_
_Actions completed this session by Claude Code / Antigravity Orchestra_
