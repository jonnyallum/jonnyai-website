const querystring = require("querystring");

// BL Motorcycles eBay OAuth Configuration
const CLIENT_ID = "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277";
const REDIRECT_URI = "https://blmotorcyclesltd.co.uk/auth-success";

// OAuth parameters for BL Motorcycles eBay app
const params = querystring.stringify({
  client_id: CLIENT_ID,
  response_type: "code",
  redirect_uri: REDIRECT_URI,
  scope: "https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.fulfillment",
  state: "bl_motorcycles_oauth_" + Date.now() // Security state parameter
});

console.log("🏍️  BL Motorcycles eBay OAuth Flow");
console.log("===================================");
console.log("");
console.log("📋 Configuration:");
console.log(`   Client ID: ${CLIENT_ID}`);
console.log(`   Redirect URI: ${REDIRECT_URI}`);
console.log(`   Privacy Policy: https://blmotorcyclesltd.co.uk/privacy-policy`);
console.log("");
console.log("🚀 Steps to Authorize:");
console.log("");
console.log("1. 🌐 Click this authorization URL:");
console.log(`   https://auth.ebay.com/oauth2/authorize?${params}`);
console.log("");
console.log("2. 🔐 Log in with your BL Motorcycles eBay account");
console.log("");
console.log("3. ✅ Accept the permissions for your application");
console.log("");
console.log("4. 📝 Copy the authorization code from the callback URL");
console.log(`   (You'll be redirected to: ${REDIRECT_URI}?code=YOUR_CODE&state=...)`);
console.log("");
console.log("5. 🔄 Complete OAuth with: node oauth-complete.js YOUR_CODE");
console.log("");
console.log("💡 Note: Make sure localhost:3000 is available for the callback");
