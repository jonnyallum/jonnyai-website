# BL Motorcycles Enterprise — Full Project Report
**Period:** Initial audit → 2026-03-24 completion
**Author:** Claude (Sonnet 4.6) via JonnyAI

---

## PHASE 1 — INITIAL AUDIT & SITE RECOVERY
*Session: ce061230 (context window 1)*

### Problem Reported
Live site at `blmotorcyclesltd.co.uk` was broken:
- Shop showed `£` symbols instead of `£` (double-encoded UTF-8)
- Nothing was clickable in the shop
- Products not loading properly

### Root Cause Found
A previous Claude session had "audited" the codebase and introduced a UTF-8 double-encoding bug. The JS string `"\xc2\xa3"` creates two characters (`Â` + `£` = `£`) instead of the single correct character `\xa3` = `£`.

### Architecture Discovery
Critically discovered the site is **NOT static HTML** — it runs as a **Node.js/Next.js server** on Hostinger's Passenger WSGI runtime at:
- `/domains/blmotorcyclesltd.co.uk/nodejs/`
- Node.js 22.x, Next.js 15.0.3
- Passenger restarts via `tmp/restart.txt`
- CDN: Hostinger hcdn with `s-maxage=31536000` (1-year cache — must purge manually after every deploy)

### Fix Applied
- Rolled back to working Vite/React backup (01/03/26 snapshot) via FTP upload to `public_html/`
- FTP: `92.112.189.250:21` / user `u384342620` / pass `Aprilia100!69.`

### Supabase Tasks Done
- Ran SQL: set `is_active_on_ebay = true` for all active listings
- Backfilled `category` column from product titles

### n8n Audit (Phase 1)
- n8n instance: `https://n8n.jonnyai.co.uk` (not `n8n.kliqtmedia.co.uk` — that was old)
- Found 7 existing BL workflows, fixed activation issues
- SFTP node not installed on this n8n instance — replaced with Code node using `curl sftp://`

---

## PHASE 2 — FULL ENTERPRISE BUILD
*Session: ce061230 (context window 2 — continued)*

### Task 1: Email Address Fix
All n8n workflows were sending notifications to `brett@blmotorcycles.co.uk` (non-existent). Changed to `blmotorcyclesltd@gmail.com` across all workflows.

Also identified: workflows were using the JonnyAI personal Resend API key (`jonnyallum@gmail.com` account). Changed to BL Motorcycles-specific key: `re_WPiPmTVK_9G1Sp9KPATm8DJnRPvnoH4ru`.

---

### Task 2: BL: Bike It Stock Sync v2
**File:** `n8n-workflows/sync_bikeit_stock_v2.json`
**n8n ID:** `HdlLf4DkRdiLR9nm` | **ACTIVE**

Previous sync workflows existed but:
- Used old FTP server (`ftp.bikeitinternational.com`) with no `OnHandQuantity` column
- Were deactivated/broken
- Didn't filter cheap items or fasteners

New v2 sync:
- SFTP: `sftp.bikeit.co.uk` / `34961@sftp.bikeit.co.uk` / file: `/stockprice.csv`
- CSV columns: `SKU, Description, OnHandQuantity, SRP, Trade`
- **Filters applied:**
  - Excludes: bolt, bolts, nut, nuts, screw, screws, fastener, fasteners, washer, washers, rivet, rivets, split pin, circlip, o-ring, o ring, oring
  - Excludes: SRP < £50
  - Stock threshold: qty ≤ 3 → `stock_level = 0`
- Pricing: `Trade × 1.5 = selling_price`
- Runs every 6 hours
- Sends sync report email to `blmotorcyclesltd@gmail.com`

---

### Task 3: Product Image URL Fix (1,601 products)
Discovered 37% of BIKEIT products had `image_url = NULL`.

**Pattern found:** `https://bikeittrade.com/feeddata/{SKU}/image1/{sku_lower}.jpg`

Applied via 1,601 individual PATCH requests to Supabase. Result: 0 errors.

Also noted: the confirmed-working Bike It FTP at `ftp.bikeitinternational.com` has `image1`–`image15` columns per product — future enhancement opportunity.

---

### Task 4: BL: Order Confirmation Email (Stripe)
**File:** `n8n-workflows/workflow_order_confirmation.json`
**n8n ID:** `dZ8Pu5ryhuD2rRBV` | **ACTIVE**

- Webhook: `POST /webhook/bl-stripe-order`
- Handles: `checkout.session.completed`, `payment_intent.succeeded`
- Sends branded confirmation HTML email to customer
- Stripe webhook registered: `we_1TEbXkRpcmImawCC0kapdaZL` (LIVE)
- Signing secret: `whsec_pPVtcyQUHrwJJUji83yKovAQwEVGCv99`

---

### Task 5: BL: New Order → Supplier Notification
**File:** `n8n-workflows/workflow_supplier_notification.json`
**n8n ID:** `bD0L2jRm6IQVNDum` | **ACTIVE**

- Runs every 15 minutes
- Queries: `supplier_order_id IS NULL AND bikeit_order_ref IS NULL AND status != cancelled AND created_at > (now - 15min)`
- Emails Brett with order table: SKU, buyer, qty, sale price, trade cost
- Once `bikeit_order_ref` filled → drops out of query (no re-notification)

---

### Task 6: BL: Post-Delivery Review Request
**File:** `n8n-workflows/workflow_review_request.json`
**n8n ID:** `yvOSuzuowKdwTiP0` | **ACTIVE**

- Runs every 12 hours
- Queries: `review_email_sent IS NULL AND dispatch_email_sent = true AND dispatched_at < (now - 7 days)`
- Sends personalised eBay feedback request email to buyer
- Marks `review_email_sent = true` after send

---

### Task 7: Admin Dashboard — Website Orders Only
**File:** `website/app/admin/page.tsx`

Before: Admin showed all orders including eBay.
After:
- Supabase query: `.neq("channel", "EBAY")` — eBay never fetched
- Removed: Channel column, eBay filter tab, `channelBadge()` function, Channel row in detail panel
- Order ID: now uses `channel_order_id` (website ref)
- `colSpan` corrected: 9 → 8

---

### Task 8: Database Cleanup (Done 2026-03-24)
The sync workflow correctly filters cheap items and fasteners, but this only prevents NEW products being added — the old data remained.

**Purge executed:**
| Action | Count |
|--------|-------|
| Products with `retail_price < £50` deleted | 22,993 |
| Products with `retail_price = NULL` deleted | 1,193 |
| Bolt products deleted | 20 |
| Washer products deleted | 2 |
| Rivet products deleted | 1 |
| O-ring products deleted | 57 |
| **Total deleted** | **24,266** |
| **Products remaining** | **11,942** |

**Post-cleanup verification:**
- Products under £50: 0 ✓
- Bolt products: 0 ✓
- Nut products: 0 ✓

---

### Task 9: Deployment
- Next.js build compiled successfully
- Uploaded `.next/` to Hostinger FTP: `/domains/blmotorcyclesltd.co.uk/nodejs/.next/`
- Passenger restart: `tmp/restart.txt` touched
- CDN cache purged by client

---

### Task 10: n8n Credentials Fix
n8n free tier has no Variables feature — `$env.X` references were silently unresolved.
Fixed by hardcoding credentials directly in all 4 workflow JSON files:
- `BL_SUPABASE_SERVICE_KEY` ✓
- `RESEND_API_KEY` → switched to BL-specific key ✓
- `BIKEIT_SFTP_PASSWORD` ✓

---

### Task 11: Stripe Webhook
Created via Stripe API:
- ID: `we_1TEbXkRpcmImawCC0kapdaZL`
- URL: `https://n8n.jonnyai.co.uk/webhook/bl-stripe-order`
- Events: `checkout.session.completed`, `payment_intent.succeeded`
- Status: LIVE, enabled

---

---

## PHASE 3 — CMPO / LLEXETER PIPELINE + AUDIT (2026-03-24)

### Task 12: LLExeter (CMPO) Stock Sync v1
**File:** `n8n-workflows/sync_llexeter_stock_v1.json`
**n8n ID:** `uCVHdUwsam5lohHY` | **ACTIVE**

CMPO products are stored in Supabase as `supplier_id = 'LLEXETER'` (LLExeter is the trade supplier; CMPO is the brand displayed on the website). 7,660 products already existed in DB.

- Source: `http://api.llexeter.co.uk` — **no auth required** (public API)
- `/stocklist` → bulk stock update for all existing LLEXETER products
- `/code/{sku}` → full data enrichment for any new SKUs (capped 200/run to prevent n8n timeout)
- Filters: discontinued products, price < £20, fasteners
- Pricing: `retail_price` used directly as `selling_price` (CMPO prices are already retail — no markup)
- Runs every 6 hours
- CMPO portal login: `blmotorcyclesltd@gmail.com` / `blmotorcycles8206@` (saved to `.env`)

### Task 13: Workflow Credential Audit
Found 3 older workflows (`bl-manual-dispatch`, `bl-order-cancel`, `bl-sku-alert`) using a stale Resend API key (`re_8yBdL9Ag...`). Updated all 3 to use the correct BL Motorcycles key (`re_WPiPmTVK...`).

### Task 14: LLEXETER Image URL Backfill

401 LLEXETER products had `image_url = NULL`. Fetched images from `http://api.llexeter.co.uk/code/{sku}` for each:

- Patched: **293 products** ✓
- No image available on API: **108 products** (discontinued or no photo — unavoidable)

---

## FINAL STATE

### n8n Workflows (12 Active)
| ID | Workflow | Trigger |
|----|----------|---------|
| `HdlLf4DkRdiLR9nm` | BL: Bike It Stock Sync v2 | Every 6h |
| `uCVHdUwsam5lohHY` | BL: LLExeter (CMPO) Stock Sync v1 | Every 6h |
| `HelXvZ4HsjIbATno` | BL: Dispatch Email to Customer | Webhook |
| `X1lP95P6LucP7uUB` | BL: Monday Weekly Ops Summary | Weekly Mon |
| `bD0L2jRm6IQVNDum` | BL: New Order → Supplier Notification | Every 15min |
| `dZ8Pu5ryhuD2rRBV` | BL: Order Confirmation Email (Stripe) | Stripe webhook |
| `y6Nh2Fqt4dgx1u9p` | BL: Overdue Order Escalator | Scheduled |
| `NJk9uncrrV8scRJA` | BL: Oversell Guard | Scheduled |
| `yvOSuzuowKdwTiP0` | BL: Post-Delivery Review Request | Every 12h |
| `d1Srq3MeJ09nPmqR` | bl-manual-dispatch | Manual |
| `L8jwwAVv6ZGsQS6A` | bl-order-cancel | Webhook |
| `6szfBlWfbZQwdsqD` | bl-sku-alert | Scheduled |

### Supabase (`ddjuoeyaoxllockcusgf`)
| Metric | Value |
|--------|-------|
| Total products | 11,942 |
| BIKEIT products | 4,282 |
| LLEXETER (CMPO) products | 7,660 |
| Products under £50 | 0 |
| Fastener/bolt products | 0 |
| Null image_url | 109 (108 LLEXETER no photo on API, 1 BIKEIT pattern miss) |
| Null retail_price | 0 |
| Orders (eBay) | 27 (hidden from admin) |
| Orders (Stripe/Web) | 0 (awaiting first sale) |

### Website (`blmotorcyclesltd.co.uk`)
| Page | Status |
|------|--------|
| Homepage | 200 OK |
| /shop | 200 OK — 11,942 products (BIKEIT + LLEXETER), all £50+, no fasteners |
| /admin | 200 OK — website orders only |
| CDN cache | Purged |

### Infrastructure
| System | Detail |
|--------|--------|
| Hosting | Hostinger hPanel — Node.js (Passenger) |
| FTP | `92.112.189.250:21` / `u384342620` / `Aprilia100!69.` |
| Node.js path | `/domains/blmotorcyclesltd.co.uk/nodejs/` |
| n8n | `https://n8n.jonnyai.co.uk` |
| Stripe webhook | `we_1TEbXkRpcmImawCC0kapdaZL` |
| LLExeter API | `http://api.llexeter.co.uk` (no auth) |
| CMPO portal | `cmpoparts.com` / `blmotorcyclesltd@gmail.com` |

---

## REMAINING / FUTURE

| Priority | Task | Notes |
|----------|------|-------|
| Medium | First Bike It sync confirmation | Email arrives ~6h after n8n run — confirms SFTP path works from GCP server |
| Medium | First CMPO sync confirmation | First run will update stock for 7,660 LLEXETER products — check email for report |
| Low | 109 products with no image | 108 LLEXETER (no photo on API), 1 BIKEIT (JTKSRV1A, pattern 403) — will resolve if suppliers add photos |
| Low | Stripe signature verification | Webhook signing secret `whsec_pPVtcyQUHrwJJUji83yKovAQwEVGCv99` not yet verified in n8n workflow |
| Low | Website orders (STRIPE channel) | Admin is ready — no orders yet |
