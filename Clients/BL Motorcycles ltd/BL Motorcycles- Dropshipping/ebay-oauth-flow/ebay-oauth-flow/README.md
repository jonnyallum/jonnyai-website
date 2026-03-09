
# eBay OAuth Flow (Modern REST API)

## ✅ Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your credentials to `.env`

3. Start the auth flow:
   ```bash
   node oauth-init.js
   ```

4. Click the login link in the console and log in with Brett's eBay.

5. Copy the full URL from the final redirect (after you see "localhost refused to connect").

6. Paste it into:
   ```bash
   node oauth-complete.js "<FULL_URL_HERE>"
   ```

7. Your token will be printed and saved to `.env` as `EBAY_OAUTH_TOKEN=...`
