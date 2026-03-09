import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError, } from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
    process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const server = new Server({
    name: "mcp-bl-supabase",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * Tool definitions
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "upsert_products",
                description: "Insert or update multiple products in the enterprise catalog",
                inputSchema: {
                    type: "object",
                    properties: {
                        products: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    sku: { type: "string" },
                                    supplier_sku: { type: "string" },
                                    supplier_id: { type: "string" },
                                    brand: { type: "string" },
                                    title: { type: "string" },
                                    description: { type: "string" },
                                    trade_price: { type: "number" },
                                    retail_price: { type: "number" },
                                    stock_level: { type: "integer" },
                                    category: { type: "string" },
                                    image_url: { type: "string" },
                                    is_active_on_ebay: { type: "boolean" },
                                },
                                required: ["sku", "supplier_id", "title", "trade_price"],
                            },
                        },
                    },
                    required: ["products"],
                },
            },
            {
                name: "upsert_fitment",
                description: "Insert or update motorcycle fitment mappings",
                inputSchema: {
                    type: "object",
                    properties: {
                        mappings: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    sku: { type: "string" },
                                    make: { type: "string" },
                                    model: { type: "string" },
                                    cc: { type: "integer" },
                                    year_start: { type: "integer" },
                                    year_end: { type: "integer" },
                                },
                                required: ["sku", "make", "model"],
                            },
                        },
                    },
                    required: ["mappings"],
                },
            },
            {
                name: "query_products",
                description: "Query the product catalog with filters",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string" },
                        supplier_id: { type: "string" },
                        min_price: { type: "number" },
                        max_price: { type: "number" },
                        limit: { type: "integer", default: 50 },
                    },
                },
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "upsert_products": {
                const { products } = args;
                const { data, error } = await supabase
                    .from("products")
                    .upsert(products, { onConflict: "sku" })
                    .select();
                if (error)
                    throw new McpError(ErrorCode.InternalError, `Supabase Error: ${error.message}`);
                return { content: [{ type: "text", text: `Successfully upserted ${data?.length} products.` }] };
            }
            case "upsert_fitment": {
                const { mappings } = args;
                const { data, error } = await supabase
                    .from("fitment")
                    .upsert(mappings)
                    .select();
                if (error)
                    throw new McpError(ErrorCode.InternalError, `Supabase Error: ${error.message}`);
                return { content: [{ type: "text", text: `Successfully upserted ${data?.length} fitment mappings.` }] };
            }
            case "query_products": {
                const { query, supplier_id, min_price, max_price, limit } = args;
                let q = supabase.from("products").select("*");
                if (query)
                    q = q.ilike("title", `%${query}%`);
                if (supplier_id)
                    q = q.eq("supplier_id", supplier_id);
                if (min_price)
                    q = q.gte("selling_price", min_price);
                if (max_price)
                    q = q.lte("selling_price", max_price);
                const { data, error } = await q.limit(limit || 50).order("selling_price", { ascending: true });
                if (error)
                    throw new McpError(ErrorCode.InternalError, `Supabase Error: ${error.message}`);
                return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
            }
            default:
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
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
    console.error("BL Motorcycles Supabase MCP server running on stdio");
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
