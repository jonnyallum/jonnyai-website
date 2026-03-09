import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: [path.join(__dirname, "dist", "index.js")],
    env: {
      ...process.env,
      SUPABASE_URL: "https://ddjuoeyaoxllockcusgf.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkanVvZXlhb3hsbG9ja2N1c2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM4ODM3OSwiZXhwIjoyMDgwOTY0Mzc5fQ.tQTpdQCkE-V-aCfdt7GgN5FF-IdXQzGCAEuRE6gNupE"
    }
  });

  const client = new Client(
    {
      name: "test-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  await client.connect(transport);
  console.log("Connected to MCP server");

  try {
    const tools = await client.request({ method: "tools/list" }, { schema: {} });
    console.log("Available tools:", JSON.stringify(tools, null, 2));

    const result = await client.request(
      {
        method: "tools/call",
        params: {
          name: "query_products",
          arguments: { limit: 1 }
        },
      },
      { schema: {} }
    );
    console.log("Query Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
}

main();
