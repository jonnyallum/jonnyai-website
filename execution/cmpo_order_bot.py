import asyncio
import os
import sys
from playwright.async_api import async_playwright
from dotenv import load_dotenv

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

load_dotenv(override=True)

CMPO_EMAIL = os.environ.get("CMPO_EMAIL", "blmotorcyclesltd@gmail.com")
CMPO_PASSWORD = os.environ.get("CMPO_PASSWORD", "blmotorcycles8206@")

async def place_cmpo_order(sku: str, qty: int, shipping_address: dict):
    """
    Automated Order Placement on CMPO (cmpoparts.com)
    Address format: {name, line1, line2, city, postcode, phone}
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        
        print(f"🚀 Starting CMPO Order Bot for SKU: {sku}")
        
        try:
            # 1. Login
            await page.goto("https://www.cmpoparts.com/login.php")
            
            # Handle Cookie Overlay
            try:
                accept_btn = page.locator("button#ll_cookie_accept_all")
                if await accept_btn.count() > 0:
                    await accept_btn.click()
                    print("✅ Cookies accepted.")
            except:
                pass
                
            await page.fill('#login', CMPO_EMAIL)
            await page.fill('#password', CMPO_PASSWORD)
            await page.click('input.tp-in-btn.w-100')
            
            # Verify login
            await page.wait_for_url("**/index.php**")
            print("✅ Logged in to CMPO.")

            # 2. Clear Basket (Mandatory for clean automation)
            # CMPO typically has a basket page
            await page.goto("https://www.cmpoparts.com/basket.php")
            clear_btn = await page.get_by_text("Empty Basket").element_handle()
            if clear_btn:
                await clear_btn.click()
                print("🗑️ Basket cleared.")

            # 4. Add to Basket via SKU Search
            await page.goto(f"https://www.cmpoparts.com/index.php?query={sku}&search=1")
            
            # The subagent found a way to add to cart
            # Based on recording mapping: X:761, Y:707 was the "ADD TO CART" button
            # But we want a selector. Using .product-list-item or similar.
            add_btn = page.locator('input[value="ADD TO CART"]').first
            if await add_btn.count() > 0:
                await add_btn.click()
                print(f"📦 Added {sku} to basket.")
            else:
                return {"success": False, "error": f"SKU {sku} not found or out of stock."}

            # 5. Checkout
            await page.goto("https://www.cmpoparts.com/checkout.php")
            
            # 6. Fill Shipping Address (The 'Drop Ship' flow)
            # Open the modal
            await page.click(".add-drop-shipping-address")
            await page.wait_for_selector("#name", state="visible")
            
            # Fill fields
            await page.fill("#name", shipping_address.get("name", ""))
            await page.fill("#drop_ship_tel_1", shipping_address.get("phone", "07000000000"))
            await page.fill("#line_1", shipping_address.get("line1", ""))
            await page.fill("#line_2", shipping_address.get("line2", ""))
            await page.fill("#town", shipping_address.get("city", ""))
            await page.fill("#county", shipping_address.get("county", "UK"))
            await page.fill("#postcode", shipping_address.get("postcode", ""))
            
            # Save address
            await page.click("#save-drop-shipping-address-btn")
            print("📍 Shipping address saved (Drop Ship).")

            # 7. Final Order Creation
            # On checkout.php there should now be an option to confirm the order.
            # We will stop here or look for the final place order button.
            await page.screenshot(path="cmpo_checkout_final_review.png")
            
            # NOTE: To prevent actual spend during testing, we'll cap it here.
            # In production, we'd find the 'Pay' or 'Confirm Order' button.
            
            return {"success": True, "order_ref": "PENDING_CONFIRMATION", "screenshot": "cmpo_checkout_final_review.png"}

        except Exception as e:
            print(f"❌ Error: {e}")
            await page.screenshot(path="cmpo_order_error.png")
            return {"success": False, "error": str(e)}
        finally:
            await browser.close()

if __name__ == "__main__":
    test_address = {
        "name": "Test Buyer",
        "line1": "1 Jai Building",
        "city": "London",
        "postcode": "SW1A 1AA",
        "phone": "07123456789"
    }
    res = asyncio.run(place_cmpo_order("CP8C", 1, test_address))
    print("FINAL BOT RESULT:", res)
