import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import * as path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const SUPABASE_URL = process.env.ANTIGRAVITY_BRAIN_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const server = new Server({
    name: "mcp-marcus",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// --- Tools ---
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_mission_status",
                description: "Get the current high-level status of all active missions/projects.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "start_ralph_loop",
                description: "Authorize and start a Ralph Loop for a specific objective.",
                inputSchema: {
                    type: "object",
                    properties: {
                        objective: { type: "string", description: "The goal of the loop" },
                    },
                    required: ["objective"],
                },
            },
            {
                name: "broadcast_to_orchestra",
                description: "Post an high-priority coordination message to the chatroom.",
                inputSchema: {
                    type: "object",
                    properties: {
                        message: { type: "string", description: "Message to broadcast" },
                        tier: { type: "string", enum: ["P0", "P1", "P2"], default: "P1" },
                    },
                    required: ["message"],
                },
            },
            {
                name: "query_agent_lore",
                description: "Retrieve specific agent personality and capabilities for coordination.",
                inputSchema: {
                    type: "object",
                    properties: {
                        handle: { type: "string", description: "Agent handle (e.g. @priya)" },
                    },
                    required: ["handle"],
                },
            }
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === "get_mission_status") {
            const { data: projects, error } = await supabase.from("projects").select("*");
            if (error)
                throw error;
            return { content: [{ type: "text", text: `Active Missions Log:\n${JSON.stringify(projects, null, 2)}` }] };
        }
        if (name === "broadcast_to_orchestra") {
            const { message, tier } = z.object({
                message: z.string(),
                tier: z.enum(["P0", "P1", "P2"]).default("P1"),
            }).parse(args);
            const formatted = `[COMMAND][${tier}] ${message}`;
            const { error } = await supabase
                .from("chatroom")
                .insert([{ agent_handle: "@marcus", message: formatted, created_at: new Date().toISOString() }]);
            if (error)
                throw error;
            return { content: [{ type: "text", text: `Maestro broadcasted: ${formatted}` }] };
        }
        // Additional tools would be implemented here...
        throw new Error(`Tool not found: ${name}`);
    }
    catch (error) {
        return {
            content: [{ type: "text", text: `Maestro Error: ${error.message}` }],
            isError: true,
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Maestro Online — Marcus Cole Orchestration Live");
}
main().catch((error) => {
    console.error("Maestro Fatal Error:", error);
    process.exit(1);
});
