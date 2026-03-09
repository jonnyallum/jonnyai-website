# -*- coding: utf-8 -*-
"""
enrich_ebay_descriptions.py
============================
Reads the Bike It product CSV and pushes rich HTML descriptions +
image URLs to every matching eBay inventory item via the eBay Inventory API.

Brett's listings currently have no description body. This script uses:
  - key_features   → bullet-point list
  - short_description → marketing copy (HTML already)
  - technical_details → spec block (HTML already)
  - image1-image12  → product image gallery

Run:
    python enrich_ebay_descriptions.py [--dry-run] [--sku RCOBLK03]

Requirements:
    pip install pandas requests python-dotenv
"""

import os
import sys
import time
import argparse
import pandas as pd
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../../../.env"))

EBAY_REFRESH_TOKEN = os.environ.get("EBAY_REFRESH_TOKEN", "")
EBAY_CLIENT_ID = os.environ.get("EBAY_CLIENT_ID", "")
EBAY_CLIENT_SECRET = os.environ.get("EBAY_CLIENT_SECRET", "")
EBAY_BASE_URL = "https://api.ebay.com"

# Path to the master Bike It product CSV
CSV_PATH = os.path.join(os.path.dirname(__file__), "01_All_Products_CSV.csv")


# ── eBay auth ────────────────────────────────────────────────────────────────

def get_access_token() -> str:
    """Exchange refresh token for a seller access token."""
    import base64
    creds = base64.b64encode(f"{EBAY_CLIENT_ID}:{EBAY_CLIENT_SECRET}".encode()).decode()
    resp = requests.post(
        f"{EBAY_BASE_URL}/identity/v1/oauth2/token",
        headers={
            "Authorization": f"Basic {creds}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data={
            "grant_type": "refresh_token",
            "refresh_token": EBAY_REFRESH_TOKEN,
            "scope": "https://api.ebay.com/oauth/api_scope/sell.inventory",
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


# ── HTML builder ─────────────────────────────────────────────────────────────

def build_html_description(row: pd.Series) -> str:
    """Build a clean, professional eBay HTML description from Bike It feed fields."""
    parts = []

    # --- Key Features ---
    raw_features = str(row.get("key_features", "") or "").strip()
    if raw_features and raw_features.lower() not in ("nan", ""):
        # Features are pipe-delimited: "Feature 1 | Feature 2 | Feature 3"
        features = [f.strip() for f in raw_features.split("|") if f.strip()]
        if features:
            bullets = "".join(f"<li>{f}</li>" for f in features)
            parts.append(
                f'<div class="bi-features">'
                f'<h3 style="color:#1a1a1a;font-family:Arial,sans-serif;margin-bottom:8px">Key Features</h3>'
                f'<ul style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#333">'
                f'{bullets}</ul></div>'
            )

    # --- Short Description (already HTML) ---
    short_desc = str(row.get("short_description", "") or "").strip()
    if short_desc and short_desc.lower() not in ("nan", ""):
        parts.append(
            f'<div class="bi-short-desc" style="font-family:Arial,sans-serif;font-size:14px;'
            f'line-height:1.7;color:#333;margin-top:16px">{short_desc}</div>'
        )

    # --- Technical Details (already HTML) ---
    tech = str(row.get("technical_details", "") or "").strip()
    if tech and tech.lower() not in ("nan", ""):
        parts.append(
            f'<div class="bi-tech" style="margin-top:16px">'
            f'<h3 style="color:#1a1a1a;font-family:Arial,sans-serif;margin-bottom:8px">Technical Details</h3>'
            f'<div style="font-family:Arial,sans-serif;font-size:13px;color:#444">{tech}</div>'
            f'</div>'
        )

    # --- Fallback if all three are empty ---
    if not parts:
        title = str(row.get("item_title", "") or row.get("parent_title", "") or "").strip()
        brand = str(row.get("brand", "") or "").strip()
        if title:
            parts.append(
                f'<p style="font-family:Arial,sans-serif;font-size:14px;color:#333">'
                f'{"<strong>" + brand + "</strong> — " if brand else ""}{title}. '
                f'Genuine motorcycle accessory. New and unused.</p>'
            )

    # --- Footer ---
    parts.append(
        '<div style="margin-top:24px;padding-top:12px;border-top:1px solid #eee;'
        'font-family:Arial,sans-serif;font-size:12px;color:#888">'
        'BL Motorcycles Ltd — UK-based motorcycle parts &amp; accessories specialist. '
        'All items are brand new and genuine. Fast UK dispatch.</div>'
    )

    return "\n".join(parts)


def get_image_urls(row: pd.Series) -> list:
    """Extract up to 12 non-empty image URLs from image1..image12 columns."""
    urls = []
    for i in range(1, 13):
        col = f"image{i}"
        val = str(row.get(col, "") or "").strip()
        if val and val.lower() not in ("nan", ""):
            urls.append(val)
    return urls


# ── eBay API helpers ──────────────────────────────────────────────────────────

def get_inventory_item(sku: str, token: str) -> dict | None:
    resp = requests.get(
        f"{EBAY_BASE_URL}/sell/inventory/v1/inventory_item/{requests.utils.quote(sku, safe='')}",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        timeout=15,
    )
    if resp.status_code == 404:
        return None
    resp.raise_for_status()
    return resp.json()


def put_inventory_item(sku: str, item: dict, token: str) -> bool:
    resp = requests.put(
        f"{EBAY_BASE_URL}/sell/inventory/v1/inventory_item/{requests.utils.quote(sku, safe='')}",
        json=item,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json",
                 "Content-Language": "en-GB"},
        timeout=20,
    )
    if resp.status_code in (200, 204):
        return True
    print(f"    ✗ PUT failed {resp.status_code}: {resp.text[:200]}")
    return False


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Enrich BL Motorcycles eBay descriptions from Bike It feed")
    parser.add_argument("--dry-run", action="store_true", help="Preview HTML without pushing to eBay")
    parser.add_argument("--sku", help="Only process a single SKU (for testing)")
    parser.add_argument("--limit", type=int, default=0, help="Max items to process (0 = all)")
    parser.add_argument("--skip-empty", action="store_true",
                        help="Skip products where all description fields are empty")
    args = parser.parse_args()

    print(f"Loading product data from: {CSV_PATH}")
    df = pd.read_csv(CSV_PATH, dtype=str, low_memory=False)
    df["sku"] = df["sku"].str.strip()
    print(f"  {len(df):,} products loaded")

    if args.sku:
        df = df[df["sku"] == args.sku]
        if df.empty:
            print(f"SKU '{args.sku}' not found in CSV.")
            sys.exit(1)

    if args.limit > 0:
        df = df.head(args.limit)

    token = None
    if not args.dry_run:
        print("Getting eBay access token...")
        token = get_access_token()
        print("  Token obtained.")

    ok = skipped = failed = no_match = 0

    for _, row in df.iterrows():
        sku = row["sku"]
        html = build_html_description(row)
        images = get_image_urls(row)

        if args.skip_empty and not html.strip():
            skipped += 1
            continue

        if args.dry_run:
            print(f"\n{'='*60}")
            print(f"SKU: {sku}  |  Images: {len(images)}")
            print(f"HTML preview ({len(html)} chars):\n{html[:400]}...")
            ok += 1
            continue

        # Check item exists on eBay
        item = get_inventory_item(sku, token)
        if item is None:
            no_match += 1
            continue

        # Patch product fields
        item["product"] = item.get("product", {})
        item["product"]["description"] = html
        if images:
            item["product"]["imageUrls"] = images

        success = put_inventory_item(sku, item, token)
        if success:
            ok += 1
            print(f"  ✓ {sku} enriched ({len(html)} chars, {len(images)} images)")
        else:
            failed += 1

        time.sleep(0.3)  # rate limit: ~200 req/min eBay allowance

    print(f"\nDone. Updated: {ok} | No eBay match: {no_match} | Skipped: {skipped} | Failed: {failed}")


if __name__ == "__main__":
    main()
