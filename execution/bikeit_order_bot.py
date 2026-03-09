"""
BL Motorcycles — Bike It Trade Portal Order Bot
Uses Playwright to log into bikeittrade.com, search SKU,
add to basket, and checkout to customer's address.

Credentials: set BIKEIT_EMAIL and BIKEIT_PASSWORD in .env
"""
import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

import os
import asyncio
from dotenv import load_dotenv

load_dotenv(override=True)

BIKEIT_URL      = "https://bikeittrade.com"
BIKEIT_EMAIL    = os.environ.get("BIKEIT_EMAIL", "")
BIKEIT_PASSWORD = os.environ.get("BIKEIT_PASSWORD", "")


async def place_order(sku: str, qty: int, address: dict) -> dict:
    """
    Place an order on bikeittrade.com for the given SKU and deliver to address.

    address dict: {name, line1, line2, city, county, postcode, country, phone}

    Returns: {success: bool, order_ref: str | None, error: str | None}
    """
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        return {"success": False, "error": "playwright not installed — run: pip install playwright && playwright install chromium"}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx     = await browser.new_context(locale="en-GB")
        page    = await ctx.new_page()

        try:
            # --- 1. LOGIN ---
            print(f"  [Bot] Logging in as {BIKEIT_EMAIL}...")
            await page.goto(f"{BIKEIT_URL}/customer/account/login/", wait_until="networkidle")

            await page.fill("input#email", BIKEIT_EMAIL)
            await page.fill("input#pass", BIKEIT_PASSWORD)
            await page.click("button#send2")
            await page.wait_for_load_state("networkidle")

            # Verify login succeeded
            if "login" in page.url.lower():
                error_el = page.locator(".message-error")
                msg = await error_el.inner_text() if await error_el.count() > 0 else "Unknown login failure"
                return {"success": False, "error": f"Login failed: {msg}"}
            print("  [Bot] Logged in OK.")

            # --- 2. CLEAR BASKET (avoid mixing orders) ---
            await page.goto(f"{BIKEIT_URL}/checkout/cart/", wait_until="networkidle")
            remove_links = page.locator("a.action-delete")
            count = await remove_links.count()
            for _ in range(count):
                await page.locator("a.action-delete").first.click()
                await page.wait_for_load_state("networkidle")
            print(f"  [Bot] Basket cleared ({count} items removed).")

            # --- 3. SEARCH FOR SKU ---
            print(f"  [Bot] Searching for SKU: {sku}...")
            await page.goto(f"{BIKEIT_URL}/catalogsearch/result/?q={sku}", wait_until="networkidle")

            # Try direct product URL pattern first (Magento2 SKU search)
            product_link = page.locator(".product-item-link").first
            if await product_link.count() == 0:
                # Fallback: try direct SKU URL
                await page.goto(f"{BIKEIT_URL}/search?q={sku}", wait_until="networkidle")
                product_link = page.locator(".product-item-link").first

            if await product_link.count() == 0:
                return {"success": False, "error": f"SKU {sku} not found on Bike It portal"}

            await product_link.click()
            await page.wait_for_load_state("networkidle")
            print(f"  [Bot] Found product page: {page.url}")

            # --- 4. SET QTY AND ADD TO BASKET ---
            qty_input = page.locator("input#qty")
            if await qty_input.count() > 0:
                await qty_input.fill(str(qty))

            await page.click("button#product-addtocart-button")
            await page.wait_for_load_state("networkidle")

            # Confirm added
            success_msg = page.locator(".message-success")
            if await success_msg.count() == 0:
                return {"success": False, "error": f"Failed to add SKU {sku} to basket"}
            print(f"  [Bot] Added {qty}x {sku} to basket.")

            # --- 5. GO TO CHECKOUT ---
            await page.goto(f"{BIKEIT_URL}/checkout/", wait_until="networkidle")
            await page.wait_for_timeout(2000)  # Let Magento checkout JS initialise

            # --- 6. FILL SHIPPING ADDRESS ---
            print(f"  [Bot] Filling delivery address for {address.get('name')}...")

            # Magento 2 checkout — shipping step
            # Wait for address form to appear
            await page.wait_for_selector("input[name='firstname']", timeout=15000)

            # Split name into first/last
            name_parts  = (address.get("name") or "").split(" ", 1)
            firstname   = name_parts[0]
            lastname    = name_parts[1] if len(name_parts) > 1 else "."

            await page.fill("input[name='firstname']",         firstname)
            await page.fill("input[name='lastname']",          lastname)
            await page.fill("input[name='street[0]']",         address.get("line1", ""))
            if address.get("line2"):
                await page.fill("input[name='street[1]']",     address.get("line2", ""))
            await page.fill("input[name='city']",              address.get("city", ""))
            await page.fill("input[name='postcode']",          address.get("postcode", ""))

            # Country selector (default GB)
            country_select = page.locator("select[name='country_id']")
            if await country_select.count() > 0:
                await country_select.select_option(address.get("country", "GB"))

            # Phone
            phone_input = page.locator("input[name='telephone']")
            if await phone_input.count() > 0:
                await phone_input.fill(address.get("phone", "00000000000"))

            # Select shipping method (standard / cheapest)
            await page.wait_for_timeout(2000)
            shipping_radio = page.locator("input[type='radio'][name='ko_unique_1']").first
            if await shipping_radio.count() > 0:
                await shipping_radio.check()
            else:
                # Try generic shipping radio
                await page.locator("input.radio[name*='shipping']").first.check()

            # Proceed to payment
            await page.click("button.button.action.continue.primary")
            await page.wait_for_load_state("networkidle")
            await page.wait_for_timeout(2000)

            # --- 7. PAYMENT (trade account — should be invoice/account) ---
            print("  [Bot] On payment step...")
            # Bike It trade = "Payment on Account" or "Purchase Order"
            payment_method = page.locator("input[value='free']")  # trade account credit
            if await payment_method.count() == 0:
                payment_method = page.locator("input[type='radio'][name='payment[method]']").first
            if await payment_method.count() > 0:
                await payment_method.check()

            # Place order
            await page.click("button.action.primary.checkout")
            await page.wait_for_load_state("networkidle")
            await page.wait_for_timeout(3000)

            # --- 8. CAPTURE ORDER REFERENCE ---
            # Magento success page usually shows order number
            order_ref = None
            ref_el = page.locator(".order-number strong, span.order-number, .checkout-success .order-number")
            if await ref_el.count() > 0:
                order_ref = (await ref_el.inner_text()).strip()

            if not order_ref:
                # Try extracting from page text
                content = await page.content()
                import re
                match = re.search(r'order[^\d]*#?\s*(\d+)', content, re.IGNORECASE)
                if match:
                    order_ref = match.group(1)

            if page.url and "success" in page.url.lower():
                print(f"  [Bot] Order placed! Ref: {order_ref or 'check Bike It portal'}")
                return {"success": True, "order_ref": order_ref}
            else:
                return {"success": False, "error": f"Unexpected page after submit: {page.url}"}

        except Exception as e:
            screenshot_path = f"bikeit_error_{sku}_{int(__import__('time').time())}.png"
            await page.screenshot(path=screenshot_path)
            return {"success": False, "error": f"{str(e)} (screenshot: {screenshot_path})"}
        finally:
            await browser.close()


def place_order_sync(sku: str, qty: int, address: dict) -> dict:
    """Synchronous wrapper around the async place_order function."""
    return asyncio.run(place_order(sku, qty, address))


if __name__ == "__main__":
    # Test run — uses a dummy address to verify login works
    if not BIKEIT_EMAIL or not BIKEIT_PASSWORD:
        print("ERROR: Set BIKEIT_EMAIL and BIKEIT_PASSWORD in .env first")
    else:
        test_addr = {
            "name": "Test Customer",
            "line1": "1 Test Street",
            "city": "Southampton",
            "postcode": "SO14 1AA",
            "country": "GB",
            "phone": "07700900000",
        }
        result = place_order_sync("AIRX033", 1, test_addr)
        print("Result:", result)
