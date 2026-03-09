require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const EBAY_AUTH_TOKEN = process.env.EBAY_AUTH_TOKEN;

async function testEbayConnection() {
  const logMessages = [];
  
  function log(message) {
    console.log(message);
    logMessages.push(message);
  }

  try {
    log("🔄 Testing eBay API Connection for BL Motorcycles...");
    log(`Token exists: ${EBAY_AUTH_TOKEN ? 'YES' : 'NO'}`);
    
    if (!EBAY_AUTH_TOKEN) {
      log("❌ No eBay auth token found in .env file");
      return;
    }

    const response = await axios({
      method: "post",
      url: "https://api.ebay.com/ws/api.dll",
      headers: {
        "X-EBAY-API-CALL-NAME": "GetUser",
        "X-EBAY-API-SITEID": "3", // UK site
        "X-EBAY-API-APP-NAME": "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277",
        "X-EBAY-API-DEV-NAME": "8cb9bb9c-70d3-4409-8d8f-4c9eac24fec3",
        "X-EBAY-API-CERT-NAME": "PRD-471f0ac800ad-fd45-4df6-87ab-a208",
        "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
        "Content-Type": "text/xml",
      },
      data: `<?xml version="1.0" encoding="utf-8"?>
        <GetUserRequest xmlns="urn:ebay:apis:eBLBaseComponents">
          <RequesterCredentials>
            <eBayAuthToken>${EBAY_AUTH_TOKEN}</eBayAuthToken>
          </RequesterCredentials>
        </GetUserRequest>`,
    });

    log("✅ eBay API Connection Successful!");
    log("Response received:");
    log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    log("❌ eBay API Connection Failed:");
    if (error.response) {
      log(`Status: ${error.response.status}`);
      log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      log(`Error: ${error.message}`);
    }
  }

  // Write results to file
  fs.writeFileSync('ebay-test-results.txt', logMessages.join('\n'));
  log("📄 Results saved to ebay-test-results.txt");
}

testEbayConnection();
