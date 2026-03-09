import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(override=True)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def generate_dashboard():
    print("==========================================")
    print("📊 B&L MOTORCYCLES - LIVE OPS DASHBOARD")
    print("==========================================")
    
    # 1. Inventory Summary
    res = supabase.table("products").select("supplier_id", count="exact").execute()
    total = res.count
    
    res_bikeit = supabase.table("products").select("id", count="exact").eq("supplier_id", "BIKE_IT").execute()
    bikeit_count = res_bikeit.count
    
    res_llex = supabase.table("products").select("id", count="exact").eq("supplier_id", "LLEXETER").execute()
    llex_count = res_llex.count
    
    print(f"Total Products In Synced DB: {total}")
    print(f"   - Bike It Inventory:   {bikeit_count}")
    print(f"   - CMPO/Lextek (NEW):   {llex_count}")
    
    # 2. eBay Status
    res_ebay_queued = supabase.table("products").select("id", count="exact").eq("is_active_on_ebay", True).execute()
    res_ebay_live = supabase.table("products").select("id", count="exact").not_.is_("ebay_item_id", "null").execute()
    
    print(f"\neBay Status:")
    print(f"   - Queued for Listing:  {res_ebay_queued.count}")
    print(f"   - Confirmed Live:      {res_ebay_live.count}")
    
    # 3. Stock Level Warning (Less than 3)
    res_low = supabase.table("products").select("sku, stock_level").eq("is_active_on_ebay", True).lt("stock_level", 3).gt("stock_level", 0).limit(5).execute()
    if res_low.data:
        print("\n⚠️  LOW STOCK WARNING (Top 5):")
        for item in res_low.data:
            print(f"   - {item['sku']}: {item['stock_level']} units left")
            
    # 4. Out of Stock (Auto-Disabled)
    res_out = supabase.table("products").select("id", count="exact").eq("stock_level", 0).execute()
    print(f"\nInactive (Out of Stock): {res_out.count}")

if __name__ == "__main__":
    generate_dashboard()
