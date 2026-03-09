const axios = require("axios");
const fs = require("fs");

// BL Motorcycles eBay OAuth Configuration
const CLIENT_ID = "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277";
const CLIENT_SECRET = "PRD-471f0ac800ad-fd45-4df6-87ab-a208";
const REDIRECT_URI = "https://blmotorcyclesltd.co.uk/auth-success";

const authCode = process.argv[2];

if (!authCode) {
  console.error("❌ Please provide the authorization code from eBay.");
  console.error("Usage: node oauth-complete.js <AUTHORIZATION_CODE>");
  console.error("");
  console.error("📋 Steps:");
  console.error("1. Run: node simple-oauth.js");
  console.error("2. Visit the authorization URL");
  console.error("3. Copy the code from the callback URL");
  console.error("4. Run: node oauth-complete.js <CODE>");
  process.exit(1);
}

console.log("🔄 Exchanging authorization code for access token...");
console.log(`📋 Code: ${authCode.substring(0, 20)}...`);

(async () => {
  try {
    // Create Basic Auth header from Client ID and Secret
    const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const response = await axios.post(
      "https://api.ebay.com/identity/v1/oauth2/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: REDIRECT_URI,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${creds}`,
        },
      }
    );

    const tokenData = response.data;
    
    console.log("\n✅ OAuth Success! BL Motorcycles eBay Access Token:");
    console.log("================================================================");
    console.log(`🔑 Access Token: ${tokenData.access_token}`);
    console.log(`⏱️  Expires In: ${tokenData.expires_in} seconds`);
    console.log(`🔄 Refresh Token: ${tokenData.refresh_token || 'N/A'}`);
    console.log(`📊 Token Type: ${tokenData.token_type}`);
    console.log("================================================================");

    // Save token to .env file
    const envContent = `
# BL Motorcycles eBay OAuth Tokens
EBAY_CLIENT_ID=${CLIENT_ID}
EBAY_CLIENT_SECRET=${CLIENT_SECRET}
EBAY_REDIRECT_URI=${REDIRECT_URI}
EBAY_ACCESS_TOKEN=${tokenData.access_token}
EBAY_REFRESH_TOKEN=${tokenData.refresh_token || ''}
EBAY_TOKEN_EXPIRES=${Date.now() + (tokenData.expires_in * 1000)}
`;

    fs.writeFileSync(".env", envContent);
    console.log("\n💾 Tokens saved to .env file");
    
    console.log("\n🚀 Next Steps:");
    console.log("- Use the access token to make eBay API calls");
    console.log("- Test with: node test-oauth-token.js");
    console.log("- Token expires in", Math.floor(tokenData.expires_in / 3600), "hours");

  } catch (err) {
    console.error("\n❌ Error exchanging authorization code:");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data || err.message);
    
    if (err.response?.status === 400) {
      console.error("\n💡 Common fixes:");
      console.error("- Check the authorization code is correct and not expired");
      console.error("- Verify redirect URI matches eBay app configuration");
      console.error("- Ensure Client ID and Secret are correct");
    }
  }
})();
