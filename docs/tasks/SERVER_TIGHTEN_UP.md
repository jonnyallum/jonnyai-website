# Mission: Server Tighten Up & n8n Integration

**Status:** Active | **Priority:** High | **Owner:** @Marcus

## Objectives

- [ ] **n8n Integration:** Connect the n8n MCP server and use it for automated workflows.
- [ ] **Cancellation Reinforcement:** Automate follow-up emails for cancelled orders using n8n.
- [ ] **Order Logic Fix:** Update systems to handle "Local Stock" (Brett's own stock) alongside Dropshipping.
- [ ] **Failure Reduction:** Minimize "REJECTED" statuses in the Order Matrix.

## Task Board

### P0: Foundation & Connectivity

- [x] **[SYS]** Install/Configure n8n MCP server in `.mcp.json`. (@Marcus)
- [x] **[SYS]** Test n8n connectivity — UI returns 200 OK. (@Marcus)
- [x] **[SYS]** Workflow JSON built and saved: `execution/bl_cancellation_workflow.json`. (@Cline)
- [ ] **[SYS]** ⚠️ **N8N_API_KEY needs regenerating** — current key returns 401. Go to `https://n8n.jonnyai.co.uk` → Settings → API → Generate New Key → update `.env`. Then run `python execution/create_n8n_cancellation_workflow.py`.

### P1: Workflow Automation (n8n)

- [ ] **[OPS]** Design follow-up email workflow for cancellations (@Nathan).
  - Trigger: Order status changes to `cancelled` in Supabase.
  - Action: Send follow-up email to customer via n8n/Resend.
- [ ] **[OPS]** Implement "Manual Fulfillment" notification for Brett's local stock. (@Nathan)

### P2: Core Logic Optimization

- [ ] **[BUG]** Analyze why "Brett own stock" items are currently failing.
- [ ] **[DEV]** Modify fulfillment engine to skip portal automation for items flagged as "Local Stock".
- [ ] **[DEV]** Implement a "Manual Dispatch Queue" for local items instead of a hard reject.

### P3: Monitoring & Cleanup

- [ ] **[SYS]** Sync all order history to the new cloud server database.
- [ ] **[SYS]** Enable 24/7 monitoring of the Order Matrix on the new VPS.

## Progress Notes

- **2026-03-04:** VPS access confirmed. Mission started. n8n MCP info received and configured.
- **2026-03-04:** @Nathan assigned to lead the n8n automation reinforcement.
- **2026-03-04:** Analyzed failure reasons: 2x local stock (Manual intervention required), 1x SKU mismatch (Portal sync error), 1x data validation (Address check).
- **2026-03-04:** n8n endpoint `200 OK` verified. @Nathan briefed via `.tmp/message4nathan.md`.
- **2026-03-04:** @Cline: GCP VM timers confirmed live (bl-stock-sync every 15min, ais-branch-listener daily). VM updated via `git pull`.
- **2026-03-04:** @Cline: n8n workflow JSON built → `execution/bl_cancellation_workflow.json`. API key expired — needs regenerating before deploying via `create_n8n_cancellation_workflow.py`.
- **2026-03-04:** @Cline: Brand asset library initialised at `library/brand_assets/` with MANIFEST.md. Visual regression baseline structure created.

---

_Created by @marcus (The Maestro) | Jai.OS 5.0_
