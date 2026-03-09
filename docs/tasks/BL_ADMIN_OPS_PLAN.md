, can you help with that# BL Motorcycles — Admin & Operations Overhaul Plan

**Date:** 2026-03-05  
**Status:** PLANNING  
**Client:** Brett — BL Motorcycles Ltd

---

## Current State Audit

| Asset                        | Status                 | Notes                                                             |
| ---------------------------- | ---------------------- | ----------------------------------------------------------------- |
| **Products in Supabase**     | 36,194                 | ~12k Bike It, rest LLEXETER/CMPO/Legacy                           |
| **Orders in Supabase**       | 15                     | ALL eBay channel. No website orders captured.                     |
| **Admin Dashboard**          | Live but basic         | Good bones: order matrix, email templates, stock view             |
| **eBay MCP**                 | `search_listings` only | Needs Sell Inventory API upgrade for listing management           |
| **`is_active_on_ebay` flag** | STALE                  | Not synced — most show `false` even if listed                     |
| **Recent orders**            | 4/5 FAILED             | Supplier bots broken — urgent                                     |
| **n8n Workflows**            | 4 JSON files exist     | dispatch_email, overdue_escalator, oversell_guard, weekly_summary |
| **Website orders**           | NOT CAPTURED           | BL site has no order pipeline to Supabase                         |

---

## Phase 1: Fix What's Broken (URGENT — This Week)

### 1.1 Upgrade eBay MCP Server

Add Sell Inventory API tools using refresh token (user-level access):

- `get_inventory_items` — paginated list of all inventory (SKU, price, stock, category)
- `get_inventory_item` — single SKU lookup
- `withdraw_offer` — end a listing by offer ID
- `delete_inventory_item` — remove SKU from eBay inventory
- `get_offers` — list offers for a SKU
- `get_orders` — pull recent eBay orders (Fulfillment API)
- `bulk_update_price` — update pricing for multiple SKUs

### 1.2 eBay Under-£50 Cleanup

Once MCP has inventory tools:

1. Pull all BL Motorcycles inventory from eBay
2. Cross-reference with Supabase products (supplier_id = BIKEIT/CMPO)
3. Withdraw/end all listings where retail < £50
4. Update Supabase `is_active_on_ebay` flag to reflect reality

### 1.3 Fix Failed Orders

- Audit `bikeit_order_bot.py` and `cmpo_order_bot.py` on VPS
- Check supplier portal login credentials
- Fix Playwright selectors if portal UI changed
- Re-process the 4 failed orders

---

## Phase 2: Admin Dashboard Rebuild (Week 2)

### 2.1 New Admin Tabs / Sections

Brett needs to see at-a-glance:

**Command Centre (enhanced):**

- Today's revenue + margin (live)
- Orders needing action (failed, overdue, pending)
- Low stock alerts with reorder buttons
- Recent customer emails sent/received

**Order Matrix (enhanced):**

- eBay order categorisation (auto-pulled from eBay item category)
- Profit per order calculated live
- Bulk status update (select multiple → mark dispatched)
- CSV export for accounting
- "Website" filter (once website orders flow in)

**Customer Hub (new):**

- Customer list with order history, total spend, last contact
- Email history per customer (all dispatch/review/upsell emails)
- One-click email from customer row
- Repeat buyer flagging
- Customer notes (Brett can add context)

**Inventory Intelligence (enhanced):**

- Live eBay sync status per SKU
- Margin calculator with target % alerts
- Supplier fill-rate scorecards
- "Sync with eBay" button to refresh inventory data
- Price comparison: trade vs retail vs eBay listing price

**Financial Summary (new):**

- Weekly/monthly revenue, profit, margin %
- Revenue by category (exhausts, brake pads, etc.)
- Revenue by supplier (Bike It vs CMPO vs own stock)
- Top 20 selling SKUs with trend arrows
- Failed order cost (lost revenue)

---

## Phase 3: n8n Automation Workflows (Weeks 2-3)

### PRIORITY 1 — Orders & Fulfilment

| Workflow                    | Trigger                      | Action                                                   |
| --------------------------- | ---------------------------- | -------------------------------------------------------- |
| **Oversell Guard**          | Stock hits 0 in Supabase     | Email Brett + disable eBay listing via API               |
| **Delayed Order Escalator** | Order pending 3+ days        | Auto-email Brett: "Chase supplier for Order #X"          |
| **Tracking Number Handler** | Supplier email with tracking | Parse → update order → email customer branded dispatch   |
| **Order Intake from Email** | Customer emails order query  | Parse details → create sheet row → internal notification |

### PRIORITY 2 — Customer Communication

| Workflow                         | Trigger                         | Action                                                |
| -------------------------------- | ------------------------------- | ----------------------------------------------------- |
| **Post-Purchase Upsell**         | Order marked Delivered + 3 days | Email compatible accessories for their bike           |
| **Review Request Sequence**      | 10 days post-delivery           | Send review request → if positive, Google Review link |
| **Abandoned Enquiry Follow-up**  | Enquiry but no purchase 48h     | Friendly follow-up email from BL                      |
| **Bike Fitment Enquiry Handler** | Customer asks "does this fit?"  | AI checks fitment data → auto-reply                   |

### PRIORITY 3 — Monitoring & Reporting

| Workflow                     | Trigger                        | Action                                                 |
| ---------------------------- | ------------------------------ | ------------------------------------------------------ |
| **Weekly Ops Summary**       | Monday 08:00                   | Orders, returns, stock alerts, revenue → email Brett   |
| **Price Margin Monitor**     | Supplier price change detected | Calculate new margin → alert if below threshold        |
| **Low Stock Alert**          | Stock ≤ 5 in Supabase          | Push "Only X left" to website + email Brett to reorder |
| **Competitor Price Watcher** | Weekly cron                    | Scrape top 20 SKUs → price intelligence report         |

---

## Phase 4: Product & Inventory Automation (Month 2)

| Feature                         | Description                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| **Supplier Feed Ingester**      | Every 12h pull supplier CSV → parse SKUs, prices, stock → update Supabase            |
| **New Product Intake Pipeline** | Supplier sends new SKUs → AI writes product description → "Pending Review" for Brett |
| **Daily Stock Snapshot**        | 23:00 nightly → full stock/price CSV → Google Drive backup                           |
| **SEO Content Engine**          | Weekly: pull top keywords → AI draft blog post → email Brett for approval            |
| **Seasonal Campaign Launcher**  | Calendar-triggered email campaigns (MOT season, summer riding, etc.)                 |

---

## Technical Requirements

| Requirement             | Tool                             | Status                       |
| ----------------------- | -------------------------------- | ---------------------------- |
| eBay Sell Inventory API | Refresh token in .mcp.json       | ✅ Have token                |
| eBay Fulfillment API    | Same refresh token               | ✅ Have token                |
| Supabase (BL)           | Service role key                 | ✅ Connected                 |
| n8n                     | Self-hosted at n8n.jonnyai.co.uk | ✅ Running                   |
| Resend (email)          | API key in .env                  | ✅ Configured                |
| VPS                     | GCP instance                     | ✅ Running (needs bot fixes) |

---

## Recommended Start Order

1. **Upgrade eBay MCP** → enables everything else
2. **eBay under-£50 cleanup** → immediate business impact
3. **Fix failed orders** → revenue recovery
4. **Admin dashboard rebuild** → Brett visibility
5. **n8n Priority 1 workflows** → automation
6. **n8n Priority 2-3 workflows** → growth

---

_Plan by @Sebastian + @Nathan | Antigravity Agency | Jai.OS 5.0_
