require("dotenv").config();
const querystring = require("querystring");

const { EBAY_CLIENT_ID, EBAY_REDIRECT_URI, EBAY_SCOPE } = process.env;

const params = querystring.stringify({
  client_id: EBAY_CLIENT_ID,
  response_type: "code",
  redirect_uri: EBAY_REDIRECT_URI,
  scope: EBAY_SCOPE,
});

console.log("🔗 Click to authenticate:");
console.log(`https://auth.ebay.com/oauth2/authorize?${params}`);
