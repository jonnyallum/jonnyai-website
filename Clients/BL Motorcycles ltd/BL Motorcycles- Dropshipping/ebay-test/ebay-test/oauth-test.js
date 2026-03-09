require("dotenv").config();
const axios = require("axios");

const EBAY_OAUTH_TOKEN = process.env.EBAY_AUTH_TOKEN;

async function testOAuthConnection() {
  console.log("🔄 Testing eBay REST API with OAuth token...");
  console.log(`OAuth token exists: ${EBAY_OAUTH_TOKEN ? 'YES' : 'NO'}`);
  
  if (!EBAY_OAUTH_TOKEN) {
    console.log("❌ No OAuth token found");
    return;
  }

  try {
    // Test with eBay's REST API - Get user account info
    const response = await axios({
      method: "get",
      url: "https://api.ebay.com/sell/account/v1/fulfillment_policy",
      headers: {
        "Authorization": `Bearer ${EBAY_OAUTH_TOKEN}`,
        "Content-Type": "application/json",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_GB" // UK marketplace
      }
    });

    console.log("✅ OAuth API Connection Successful!");
    console.log("Fulfillment policies retrieved:");
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log("❌ OAuth API Connection Failed:");
    if (error.response) {
      console.log(`Status: ${error.response.status} ${error.response.statusText}`);
      console.log("Response:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Error:", error.message);
    }
  }

  // Try another endpoint - Get inventory
  try {
    console.log("\n🔄 Testing inventory endpoint...");
    const inventoryResponse = await axios({
      method: "get",
      url: "https://api.ebay.com/sell/inventory/v1/inventory_item?limit=10",
      headers: {
        "Authorization": `Bearer ${EBAY_OAUTH_TOKEN}`,
        "Content-Type": "application/json",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_GB"
      }
    });

    console.log("✅ Inventory API works!");
    console.log("Inventory items:", JSON.stringify(inventoryResponse.data, null, 2));
    
  } catch (error) {
    console.log("❌ Inventory API failed:");
    if (error.response) {
      console.log(`Status: ${error.response.status} ${error.response.statusText}`);
      console.log("Response:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

testOAuthConnection();
