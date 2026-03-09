const querystring = require("querystring");

// BL Motorcycles eBay OAuth Configuration
const CLIENT_ID = "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277";
const REDIRECT_URI = "https://blmotorcyclesltd.co.uk/auth-success";

console.log("🔍 eBay OAuth Parameter Debug");
console.log("============================");
console.log("");

// Test 1: Basic authorization URL (minimal params)
console.log("Test 1: Basic OAuth URL");
const basicParams = querystring.stringify({
  client_id: CLIENT_ID,
  response_type: "code",
  redirect_uri: REDIRECT_URI,
  scope: "https://api.ebay.com/oauth/api_scope"
});

const basicUrl = `https://auth.ebay.com/oauth2/authorize?${basicParams}`;
console.log("URL:", basicUrl);
console.log("");

// Test 2: With sell scope only
console.log("Test 2: Sell Scope Only");
const sellParams = querystring.stringify({
  client_id: CLIENT_ID,
  response_type: "code", 
  redirect_uri: REDIRECT_URI,
  scope: "https://api.ebay.com/oauth/api_scope/sell.inventory"
});

const sellUrl = `https://auth.ebay.com/oauth2/authorize?${sellParams}`;
console.log("URL:", sellUrl);
console.log("");

// Test 3: Check if redirect URI needs to be different
console.log("Test 3: Alternative Redirect URI");
const altParams = querystring.stringify({
  client_id: CLIENT_ID,
  response_type: "code",
  redirect_uri: "https://www.blmotorcyclesltd.co.uk", // Using your decline URL
  scope: "https://api.ebay.com/oauth/api_scope"
});

const altUrl = `https://auth.ebay.com/oauth2/authorize?${altParams}`;
console.log("URL:", altUrl);
console.log("");

// Test 4: Manual URL construction (no encoding)
console.log("Test 4: Manual URL Construction");
const manualUrl = `https://auth.ebay.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent("https://api.ebay.com/oauth/api_scope")}`;
console.log("URL:", manualUrl);
console.log("");

console.log("💡 Troubleshooting Steps:");
console.log("1. Try each URL above in your browser");
console.log("2. Check which one doesn't give 'invalid_request' error");
console.log("3. Verify your eBay app redirect URI matches exactly");
console.log("4. Ensure your eBay app has OAuth enabled (not just User Tokens)");
console.log("");

console.log("🔧 Common Issues:");
console.log("- Redirect URI mismatch between this script and eBay Developer Console");
console.log("- Application not configured for OAuth (only User Tokens enabled)"); 
console.log("- Wrong environment (Sandbox vs Production)");
console.log("- Client ID typo or incorrect application");
