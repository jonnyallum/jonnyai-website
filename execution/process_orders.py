"""
BL Motorcycles — Order Processor (@Executor)
1. Polls eBay for new orders
2. For each pending order in Supabase, fires the correct supplier bot
3. Updates order status + reference back to Supabase
4. Broadcasts result to chatroom
Timeout: 3 minutes hard kill via signal.alarm (Linux/VM safe)
"""
import sys
import os
import signal
import asyncio
from datetime import datetime, timezone
from dotenv import load_dotenv

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

load_dotenv(override=True)

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://ddjuoeyaoxllockcusgf.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", os.environ.get("SUPABASE_KEY", ""))
BIKEIT_EMAIL = os.environ.get("BIKEIT_EMAIL", "")
BIKEIT_PASSWORD = os.environ.get("BIKEIT_PASSWORD", "")
NOW = datetime.now(timezone.utc)

# Hard timeout handler — kills the process after 3 min if stuck
def _timeout_handler(signum, frame):
    print("\nERROR: Order processor timed out after 3 minutes — exiting cleanly.")
    chatroom_broadcast("executor", "bl-order-processor TIMEOUT after 3 min — investigate bikeit_order_bot", "error")
    sys.exit(1)

if hasattr(signal, "SIGALRM"):
    signal.signal(signal.SIGALRM, _timeout_handler)
    signal.alarm(180)  # 3 minute hard kill


def get_supabase():
    try:
        from supabase import create_client
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Supabase connection failed: {e}")
        return None


def chatroom_broadcast(agent, message, status="info"):
    """Post run summary to Supabase chatroom."""
    import urllib.request, json
    if not SUPABASE_URL or not SUPABASE_KEY:
        return
    try:
        payload = json.dumps({
            "agent": agent,
            "message": message,
            "status": status,
            "created_at": NOW.isoformat(),
            "session": "cron-order-processor"
        }).encode()
        req = urllib.request.Request(
            SUPABASE_URL + "/rest/v1/chatroom",
            data=payload,
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }, method="POST"
        )
        with urllib.request.urlopen(req, timeout=5):
            pass
    except Exception:
        pass  # Never let broadcast failure kill the processor


def get_pending_orders(sb) -> list:
    try:
        res = sb.table("orders").select("*").eq("status", "pending").execute()
        return res.data or []
    except Exception as e:
        print(f"  Failed to fetch pending orders: {e}")
        return []


def update_order(sb, order_id: str, updates: dict):
    try:
        sb.table("orders").update(updates).eq("id", order_id).execute()
    except Exception as e:
        print(f"  Failed to update order {order_id}: {e}")


def main():
    print(f"\n=== BL Motorcycles Order Processor | {NOW.strftime('%Y-%m-%d %H:%M:%S')} ===")

    sb = get_supabase()
    if not sb:
        chatroom_broadcast("executor", "bl-order-processor FAILED: Supabase connection error", "error")
        sys.exit(1)

    # Step 1: Poll eBay
    print("\n[1/2] Polling eBay for new orders...")
    try:
        from ebay_order_poller import poll
        poll()
    except Exception as e:
        print(f"  eBay poll error: {e}")

    # Step 2: Process pending orders
    print("\n[2/2] Processing pending orders...")
    pending = get_pending_orders(sb)

    if not pending:
        print("  No pending orders to process.")
        chatroom_broadcast("executor", "bl-order-processor: 0 pending orders — all clear", "success")
        return

    print(f"  Found {len(pending)} pending order(s).")
    success_count = 0
    fail_count = 0

    for order in pending:
        order_id = order["id"]
        sku = order.get("sku")
        qty = order.get("qty", 1)
        address = order.get("shipping_address", {})
        ebay_ref = order.get("ebay_order_id")

        if not sku or not address:
            print(f"  ! Order {ebay_ref}: missing SKU or address — skipping")
            update_order(sb, order_id, {"status": "failed", "error_message": "Missing SKU or address"})
            fail_count += 1
            continue

        try:
            prod_res = sb.table("products").select("supplier_id").eq("sku", sku).limit(1).execute()
            supplier_id = prod_res.data[0].get("supplier_id") if prod_res.data else "UNKNOWN"
        except Exception:
            supplier_id = "UNKNOWN"

        print(f"\n  Processing: {ebay_ref} | SKU:{sku} | Supplier:{supplier_id} | -> {address.get('name', '?')}")
        update_order(sb, order_id, {"status": "ordering"})

        result = {"success": False, "error": f"No handler for supplier: {supplier_id}"}

        try:
            if supplier_id == "BIKEIT":
                if not BIKEIT_EMAIL or not BIKEIT_PASSWORD:
                    result = {"success": False, "error": "BIKEIT credentials missing from .env"}
                else:
                    from bikeit_order_bot import place_order_sync
                    result = place_order_sync(sku, qty, address)

            elif supplier_id in ("LLEXETER", "CMPO"):
                CMPO_EMAIL = os.environ.get("CMPO_EMAIL")
                CMPO_PASSWORD = os.environ.get("CMPO_PASSWORD")
                if not CMPO_EMAIL or not CMPO_PASSWORD:
                    result = {"success": False, "error": "CMPO credentials missing from .env"}
                else:
                    from cmpo_order_bot import place_cmpo_order
                    result = asyncio.run(place_cmpo_order(sku, qty, address))
            else:
                result = {"success": False, "error": f"Unknown supplier: {supplier_id}"}

        except Exception as e:
            result = {"success": False, "error": f"Bot exception: {str(e)[:200]}"}

        if result.get("success"):
            update_order(sb, order_id, {
                "status": "ordered",
                "bikeit_order_ref": result.get("order_ref", ""),
            })
            print(f"  SUCCESS — Ref: {result.get('order_ref', 'OK')}")
            success_count += 1
        else:
            update_order(sb, order_id, {
                "status": "failed",
                "error_message": result.get("error", "Unknown error"),
            })
            print(f"  FAILED — {result.get('error')}")
            fail_count += 1

    summary = f"bl-order-processor: {success_count} ordered | {fail_count} failed"
    print(f"\n=== DONE: {success_count} ordered | {fail_count} failed ===")
    status = "success" if fail_count == 0 else "warning"
    chatroom_broadcast("executor", summary, status)

    if hasattr(signal, "SIGALRM"):
        signal.alarm(0)  # Cancel timeout


if __name__ == "__main__":
    main()
