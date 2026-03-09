/**
 * mcp-google OAuth2 Auth Flow
 * Run: node dist/auth.js
 * Opens browser, catches callback, saves tokens.json automatically.
 */
import { google } from "googleapis";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
const TOKEN_PATH = path.resolve(__dirname, "../tokens.json");
const PORT = 3099;
const REDIRECT_URI = `http://localhost:${PORT}/oauth/callback`;

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/presentations",
  "https://www.googleapis.com/auth/tasks",
  "https://www.googleapis.com/auth/contacts",
  "https://www.googleapis.com/auth/analytics.readonly",
];

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
  login_hint: "jonnyallum@gmail.com",
});

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(" Antigravity Google OAuth2 Auth Flow");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("\nStarting local callback server on port", PORT);
console.log("Opening browser for authorization...\n");
console.log("If browser doesn't open, visit this URL manually:");
console.log(authUrl);
console.log("\n");

// Try to open browser
try {
  const { default: open } = await import("open");
  await open(authUrl);
} catch {
  console.log("Could not auto-open browser. Please open the URL above manually.");
}

// Start local HTTP server to catch the OAuth callback
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url!, `http://localhost:${PORT}`);
  if (url.pathname !== "/oauth/callback") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<html><body style="font-family:sans-serif;text-align:center;padding:40px"><h2>❌ Authorization Failed</h2><p>${error}</p></body></html>`);
    console.error("OAuth error:", error);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400);
    res.end("No code received");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html><body style="font-family:sans-serif;text-align:center;padding:40px;background:#0a0a0a;color:#fff">
        <h2 style="color:#4ade80">✅ Antigravity Google MCP — Authorized!</h2>
        <p>All Google services are now connected:</p>
        <p style="color:#94a3b8">Drive · Gmail · Calendar · Docs · Sheets · Tasks · Contacts · Gemini</p>
        <p style="margin-top:30px;color:#64748b">You can close this tab and restart Claude Code.</p>
      </body></html>
    `);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(" ✅ Authorization successful!");
    console.log(`    Tokens saved to: ${TOKEN_PATH}`);
    console.log("    Scopes granted:");
    SCOPES.forEach((s) => console.log(`      • ${s.split("/auth/")[1]}`));
    console.log("\n    Restart Claude Code to activate the MCP server.");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    server.close();
    process.exit(0);
  } catch (err: any) {
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end(`<html><body style="font-family:sans-serif;text-align:center;padding:40px"><h2>❌ Token Exchange Failed</h2><p>${err.message}</p></body></html>`);
    console.error("Token exchange failed:", err.message);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`Waiting for Google to redirect to http://localhost:${PORT}/oauth/callback ...`);
});
