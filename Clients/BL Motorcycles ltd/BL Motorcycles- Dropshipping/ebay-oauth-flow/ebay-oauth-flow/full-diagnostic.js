const querystring = require("querystring");

console.log("🚨 Complete eBay OAuth Diagnostic");
console.log("==================================");
console.log("");

// Your BL Motorcycles credentials
const CLIENT_ID = "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277";
const DEV_ID = "8cb9bb9c-70d3-4409-8d8f-4c9eac24fec3";
const CERT_ID = "PRD-471f0ac800ad-fd45-4df6-87ab-a208";

console.log("📋 Current Configuration:");
console.log(`   Client ID: ${CLIENT_ID}`);
console.log(`   Dev ID: ${DEV_ID}`);
console.log(`   Cert ID: ${CERT_ID}`);
console.log("");

console.log("🔍 ISSUE ANALYSIS:");
console.log("Since ALL OAuth URLs failed with 'invalid_request', this means:");
console.log("1. ❌ Client ID is incorrect, OR");
console.log("2. ❌ Application not configured for OAuth, OR");
console.log("3. ❌ Application is Sandbox but we're using Production URLs, OR");
console.log("4. ❌ Application is inactive/doesn't exist");
console.log("");

// Test Sandbox Environment
console.log("🧪 SANDBOX ENVIRONMENT TESTS:");
console.log("==============================");

const sandboxUrl1 = `https://auth.sandbox.ebay.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent('https://blmotorcyclesltd.co.uk/auth-success')}&scope=${encodeURIComponent('https://api.ebay.com/oauth/api_scope')}`;
console.log("Sandbox Test 1:");
console.log(sandboxUrl1);
console.log("");

const sandboxUrl2 = `https://auth.sandbox.ebay.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent('https://blmotorcyclesltd.co.uk/auth-denied')}&scope=${encodeURIComponent('https://api.ebay.com/oauth/api_scope')}`;
console.log("Sandbox Test 2:");
console.log(sandboxUrl2);
console.log("");

// Test Production Environment (again)
console.log("🏭 PRODUCTION ENVIRONMENT TESTS:");
console.log("=================================");

const prodUrl1 = `https://auth.ebay.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}&scope=${encodeURIComponent('https://api.ebay.com/oauth/api_scope')}`;
console.log("Production Test 1:");
console.log(prodUrl1);
console.log("");

const prodUrl2 = `https://auth.ebay.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent('https://www.blmotorcyclesltd.co.uk')}&scope=${encodeURIComponent('https://api.ebay.com/oauth/api_scope')}`;
console.log("Production Test 2:");
console.log(prodUrl2);
console.log("");

console.log("🔧 CRITICAL TROUBLESHOOTING STEPS:");
console.log("===================================");
console.log("");
console.log("1. 🏷️  VERIFY CLIENT ID:");
console.log("   • Log into: https://developer.ebay.com/my/keys");
console.log("   • Check if 'BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277' exists");
console.log("   • If not, copy the CORRECT Client ID from your working OAuth app");
console.log("");

console.log("2. 🔓 CHECK OAUTH CONFIGURATION:");
console.log("   • Find your BL Motorcycles application");
console.log("   • Look for 'OAuth redirect URLs' section");
console.log("   • If missing, your app only supports User Tokens (not OAuth)");
console.log("");

console.log("3. 🌍 ENVIRONMENT CHECK:");
console.log("   • If app shows 'Sandbox' - use Sandbox URLs above");
console.log("   • If app shows 'Production' - use Production URLs above");
console.log("");

console.log("4. 📝 APP STATUS:");
console.log("   • Application must be 'Active' status");
console.log("   • Application must have OAuth scopes enabled");
console.log("");

console.log("💡 NEXT STEPS:");
console.log("==============");
console.log("A) If you find your app has a DIFFERENT Client ID:");
console.log("   • Tell me the correct Client ID");
console.log("   • I'll update all the OAuth files");
console.log("");
console.log("B) If your app doesn't support OAuth:");
console.log("   • You'll need to enable OAuth in eBay Developer Console");
console.log("   • Or create a new OAuth-enabled application");
console.log("");
console.log("C) If this app ID is for a different service:");
console.log("   • Provide the Client ID from your working OAuth setup");
