// eBay Trading API User Token Generator
// This generates the URL you need to visit to get a new User Token

const querystring = require("querystring");

const APP_NAME = "BLMotorc-Bikeitsy-PRD-9471f0ac8-7600a277";
const DEV_NAME = "8cb9bb9c-70d3-4409-8d8f-4c9eac24fec3";
const CERT_NAME = "PRD-471f0ac800ad-fd45-4df6-87ab-a208";

// eBay Auth URL for Production (UK Site)
const authURL = "https://signin.ebay.com/ws/eBayISAPI.dll";

const params = querystring.stringify({
  SignIn: "",
  RuName: "BL_Motorcycles-BLMotorc-Bikei-wvhbcwsp", // Your RuName if you have one
  SessID: Date.now().toString() // Unique session ID
});

console.log("🔗 eBay User Token Generation");
console.log("=====================================");
console.log("");
console.log("📋 Your Application Details:");
console.log(`App Name: ${APP_NAME}`);
console.log(`Dev Name: ${DEV_NAME}`);
console.log(`Cert Name: ${CERT_NAME}`);
console.log("");
console.log("🚀 Steps to Generate New User Token:");
console.log("");
console.log("1. Go to eBay Developer Console:");
console.log("   https://developer.ebay.com/my/keys");
console.log("");
console.log("2. Find your application:");
console.log(`   "${APP_NAME}"`);
console.log("");
console.log("3. Click 'Generate a User Token'");
console.log("");
console.log("4. Log in with your BL Motorcycles eBay account");
console.log("");
console.log("5. Copy the generated User Token");
console.log("");
console.log("6. Replace the token in get-user-trading.js");
console.log("");
console.log("💡 Note: User Tokens are easier than OAuth for Trading API");
console.log("   They last longer and don't require redirect URI setup.");
