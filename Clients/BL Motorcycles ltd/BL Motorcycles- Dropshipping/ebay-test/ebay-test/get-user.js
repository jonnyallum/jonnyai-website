require("dotenv").config();
const axios = require("axios");

const EBAY_AUTH_TOKEN = process.env.EBAY_AUTH_TOKEN;

async function getUserInfo() {
  try {
    const response = await axios({
      method: "post",
      url: "https://api.ebay.com/ws/api.dll",
      headers: {
        "X-EBAY-API-CALL-NAME": "GetUser",
        "X-EBAY-API-SITEID": "3",
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

    console.log("✅ User Info Retrieved:");
    console.log(response.data);
  } catch (error) {
    console.error("❌ Failed to retrieve user info:");
    console.error(error.response?.data || error.message);
  }
}

getUserInfo();
