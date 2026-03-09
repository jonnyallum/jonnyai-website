import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import * as dotenv from "dotenv";
dotenv.config();
const SUPABASE_URL = process.env.ANTIGRAVITY_BRAIN_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.ANTIGRAVITY_BRAIN_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const server = new Server({
    name: "antigravity-brain",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// --- Resources ---
server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: "mcp://antigravity/roster",
                name: "Antigravity Agent Roster",
                description: "Live list of all 45 specialized agents and their current status.",
                mimeType: "application/json",
            },
            {
                uri: "mcp://antigravity/chatroom",
                name: "Shared Brain Chatroom",
                description: "Recent messages from the global agent sync chatroom.",
                mimeType: "text/markdown",
            }
        ],
    };
});
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    if (uri === "mcp://antigravity/roster") {
        const { data: agents, error } = await supabase.from("agents").select("*");
        if (error)
            throw new Error(`Supabase error: ${error.message}`);
        return {
            contents: [
                {
                    uri,
                    mimeType: "application/json",
                    text: JSON.stringify(agents, null, 2),
                },
            ],
        };
    }
    if (uri === "mcp://antigravity/chatroom") {
        const { data: messages, error } = await supabase
            .from("chatroom")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(20);
        if (error)
            throw new Error(`Supabase error: ${error.message}`);
        const markdown = messages.map(m => `**${m.agent_handle}**: ${m.message}`).join("\n\n");
        return {
            contents: [
                {
                    uri,
                    mimeType: "text/markdown",
                    text: markdown,
                },
            ],
        };
    }
    throw new Error(`Resource not found: ${uri}`);
});
// --- Tools ---
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "query_brain",
                description: "Search the Antigravity Shared Brain for learnings or agent lore.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Keyword to search for" },
                        table: { type: "string", enum: ["learnings", "agents"], default: "learnings" },
                    },
                    required: ["query"],
                },
            },
            {
                name: "sync_agent_philosophy",
                description: "Push local SKILL.md content to the agent's philosophy column in Supabase.",
                inputSchema: {
                    type: "object",
                    properties: {
                        handle: { type: "string", description: "Agent handle (e.g. @marcus)" },
                        philosophy: { type: "string", description: "Full markdown content of the SKILL.md" },
                    },
                    required: ["handle", "philosophy"],
                },
            },
            {
                name: "post_broadcast",
                description: "Send a message to the shared brain chatroom (session sync).",
                inputSchema: {
                    type: "object",
                    properties: {
                        agent: { type: "string", description: "Your agent handle" },
                        message: { type: "string", description: "Message to broadcast" },
                    },
                    required: ["agent", "message"],
                },
            }
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === "query_brain") {
            const { query, table } = z.object({
                query: z.string(),
                table: z.enum(["learnings", "agents"]).default("learnings"),
            }).parse(args);
            const { data, error } = await supabase
                .from(table)
                .select("*")
                .textSearch(table === "learnings" ? "learning" : "philosophy", query);
            if (error)
                throw error;
            return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
        }
        if (name === "sync_agent_philosophy") {
            const { handle, philosophy } = z.object({
                handle: z.string(),
                philosophy: z.string(),
            }).parse(args);
            const { data, error } = await supabase
                .from("agents")
                .update({ philosophy, updated_at: new Date().toISOString() })
                .eq("handle", handle);
            if (error)
                throw error;
            return { content: [{ type: "text", text: `Philosophy for ${handle} synced to Shared Brain.` }] };
        }
        if (name === "post_broadcast") {
            const { agent, message } = z.object({
                agent: z.string(),
                message: z.string(),
            }).parse(args);
            const { error } = await supabase
                .from("chatroom")
                .insert([{ agent_handle: agent, message, created_at: new Date().toISOString() }]);
            if (error)
                throw error;
            return { content: [{ type: "text", text: `Broadcasted to chatroom: ${message}` }] };
        }
        throw new Error(`Tool not found: ${name}`);
    }
    catch (error) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Antigravity Brain MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
