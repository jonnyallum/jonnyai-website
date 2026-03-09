const axios = require("axios");
require("dotenv").config();

const ACCESS_TOKEN = process.env.EBAY_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error("❌ No access token found in .env file");
  console.error("Run the OAuth flow first:");
  console.error("1. node simple-oauth.js");
  console.error("2. Complete authorization");
  console.error("3. node oauth-complete.js <CODE>");
  process.exit(1);
}

console.log("🧪 Testing BL Motorcycles eBay OAuth Token...");
console.log(`🔑 Token: ${ACCESS_TOKEN.substring(0, 20)}...`);

// Test with Inventory API (modern REST API)
async function testInventoryAPI() {
  try {
    const response = await axios.get(
      "https://api.ebay.com/sell/inventory/v1/inventory_item",
      {
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        params: {
          limit: 5 // Just get first 5 items
        }
      }
    );

    console.log("\n✅ Inventory API Test Success!");
    console.log("📊 Response:", JSON.stringify(response.data, null, 2));
    
    if (response.data.inventoryItems && response.data.inventoryItems.length > 0) {
      console.log(`\n📦 Found ${response.data.inventoryItems.length} inventory items`);
    } else {
      console.log("\n📦 No inventory items found (this is normal for new accounts)");
    }

  } catch (err) {
    console.error("\n❌ Inventory API Test Failed:");
    console.error("Status:", err.response?.status);
    console.error("Error:", err.response?.data || err.message);
    
    if (err.response?.status === 401) {
      console.error("\n🔑 Token appears to be invalid or expired");
    } else if (err.response?.status === 403) {
      console.error("\n🚫 Permission denied - check OAuth scopes");
    }
  }
}

// Test with Account API
async function testAccountAPI() {
  try {
    const response = await axios.get(
      "https://api.ebay.com/sell/account/v1/fulfillment_policy",
      {
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        params: {
          marketplace_id: "EBAY_GB" // UK marketplace
        }
      }
    );

    console.log("\n✅ Account API Test Success!");
    console.log("📋 Fulfillment Policies:", response.data.fulfillmentPolicies?.length || 0);

  } catch (err) {
    console.error("\n❌ Account API Test Failed:");
    console.error("Status:", err.response?.status);
    console.error("Error:", err.response?.data?.errors || err.message);
  }
}

(async () => {
  await testInventoryAPI();
  await testAccountAPI();
  
  console.log("\n🎉 OAuth Token Testing Complete!");
  console.log("💡 If tests passed, your BL Motorcycles eBay API connection is ready!");
})();
