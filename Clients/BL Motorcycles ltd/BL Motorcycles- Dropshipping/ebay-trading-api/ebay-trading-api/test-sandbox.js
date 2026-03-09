const axios = require("axios");

// Test with eBay Sandbox environment first
const headers = {
  "X-EBAY-API-CALL-NAME": "GeteBayOfficialTime",
  "X-EBAY-API-SITEID": "3", // UK
  "X-EBAY-API-APP-NAME": "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277",
  "X-EBAY-API-DEV-NAME": "8cb9bb9c-70d3-4409-8d8f-4c9eac24fec3", 
  "X-EBAY-API-CERT-NAME": "PRD-471f0ac800ad-fd45-4df6-87ab-a208",
  "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
  "Content-Type": "text/xml"
};

// This call doesn't require authentication - tests basic API connectivity
const data = `<?xml version="1.0" encoding="utf-8"?>
<GeteBayOfficialTimeRequest xmlns="urn:ebay:apis:eBLBaseComponents">
</GeteBayOfficialTimeRequest>`;

console.log("🔍 Testing eBay API Basic Connectivity...");
console.log("📍 App ID:", headers["X-EBAY-API-APP-NAME"]);
console.log("🌍 Site ID:", headers["X-EBAY-API-SITEID"], "(UK)");

axios.post("https://api.ebay.com/ws/api.dll", data, { headers })
  .then(res => {
    console.log("\n✅ eBay API Connection Success!");
    console.log("Response:", res.data);
    
    if (res.data.includes("<Ack>Success</Ack>")) {
      console.log("\n🎉 Your eBay application credentials are VALID!");
      console.log("💡 The authentication issue is specifically with the User Token");
      console.log("📋 Next: You need to generate a fresh User Token in eBay Developer Console");
    }
  })
  .catch(err => {
    console.error("\n❌ eBay API Connection Failed:");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data || err.message);
    
    if (err.response?.status === 401) {
      console.log("\n🔑 Error 401: Application credentials may be invalid");
    } else if (err.response?.status === 404) {
      console.log("\n🔍 Error 404: API endpoint or application not found");
    }
  });
