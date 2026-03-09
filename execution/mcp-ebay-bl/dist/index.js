import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { z } from "zod";
import * as dotenv from "dotenv";
dotenv.config();
const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID;
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
const EBAY_REFRESH_TOKEN = process.env.EBAY_REFRESH_TOKEN;
const EBAY_ENVIRONMENT = process.env.EBAY_ENVIRONMENT || "production";
if (!EBAY_CLIENT_ID || !EBAY_CLIENT_SECRET) {
    console.error("Missing eBay credentials in .env");
    process.exit(1);
}
const BASE_URL = EBAY_ENVIRONMENT === "production"
    ? "https://api.ebay.com"
    : "https://api.sandbox.ebay.com";
const server = new Server({ name: "mcp-ebay-bl", version: "2.0.0" }, { capabilities: { tools: {} } });
// ── Token Management ────────────────────────────────────────────────────────
let cachedUserToken = null;
let tokenExpiry = 0;
async function getAppToken() {
    const auth = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString("base64");
    const res = await axios.post(`${BASE_URL}/identity/v1/oauth2/token`, "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope", { headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${auth}` } });
    return res.data.access_token;
}
async function getUserToken() {
    if (cachedUserToken && Date.now() < tokenExpiry)
        return cachedUserToken;
    if (!EBAY_REFRESH_TOKEN)
        throw new Error("No EBAY_REFRESH_TOKEN — cannot access seller APIs");
    const auth = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString("base64");
    const scopes = [
        "https://api.ebay.com/oauth/api_scope/sell.inventory",
        "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
        "https://api.ebay.com/oauth/api_scope/sell.account",
        "https://api.ebay.com/oauth/api_scope/sell.marketing",
    ].join(" ");
    const res = await axios.post(`${BASE_URL}/identity/v1/oauth2/token`, `grant_type=refresh_token&refresh_token=${encodeURIComponent(EBAY_REFRESH_TOKEN)}&scope=${encodeURIComponent(scopes)}`, { headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${auth}` } });
    cachedUserToken = res.data.access_token;
    tokenExpiry = Date.now() + (res.data.expires_in - 60) * 1000;
    return cachedUserToken;
}
function sellerHeaders(token) {
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Content-Language": "en-GB",
    };
}
// ── Tool Definitions ────────────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: "search_listings",
            description: "Search eBay for items (public Browse API). Good for competitor research.",
            inputSchema: {
                type: "object",
                properties: {
                    q: { type: "string", description: "Search query" },
                    limit: { type: "number", description: "Results (max 200)", default: 20 },
                },
                required: ["q"],
            },
        },
        {
            name: "get_inventory_items",
            description: "List BL Motorcycles eBay inventory items (paginated). Returns SKU, price, stock, product info.",
            inputSchema: {
                type: "object",
                properties: {
                    limit: { type: "number", description: "Items per page (max 100)", default: 25 },
                    offset: { type: "number", description: "Pagination offset", default: 0 },
                },
            },
        },
        {
            name: "get_inventory_item",
            description: "Get a single inventory item by SKU.",
            inputSchema: {
                type: "object",
                properties: {
                    sku: { type: "string", description: "Product SKU" },
                },
                required: ["sku"],
            },
        },
        {
            name: "get_offers",
            description: "Get all active offers (listings) for a specific SKU.",
            inputSchema: {
                type: "object",
                properties: {
                    sku: { type: "string", description: "Product SKU" },
                },
                required: ["sku"],
            },
        },
        {
            name: "withdraw_offer",
            description: "Withdraw (end) an eBay listing by offer ID. Use get_offers first to find the offer ID.",
            inputSchema: {
                type: "object",
                properties: {
                    offerId: { type: "string", description: "The eBay offer ID to withdraw" },
                },
                required: ["offerId"],
            },
        },
        {
            name: "delete_inventory_item",
            description: "Delete an inventory item by SKU. Removes it from eBay inventory completely.",
            inputSchema: {
                type: "object",
                properties: {
                    sku: { type: "string", description: "Product SKU to delete" },
                },
                required: ["sku"],
            },
        },
        {
            name: "update_inventory_item",
            description: "Update an inventory item's price, stock quantity, or condition.",
            inputSchema: {
                type: "object",
                properties: {
                    sku: { type: "string", description: "Product SKU" },
                    price: { type: "number", description: "New price in GBP (optional)" },
                    quantity: { type: "number", description: "New stock quantity (optional)" },
                    title: { type: "string", description: "New title (optional)" },
                },
                required: ["sku"],
            },
        },
        {
            name: "get_orders",
            description: "Get recent eBay orders (Fulfillment API). Returns buyer info, items, shipping, status.",
            inputSchema: {
                type: "object",
                properties: {
                    limit: { type: "number", description: "Orders to return (max 200)", default: 50 },
                    offset: { type: "number", description: "Pagination offset", default: 0 },
                    days_back: { type: "number", description: "How many days back to look (max 90)", default: 30 },
                    status: { type: "string", description: "Filter: ACTIVE, COMPLETED, CANCELLED, or ALL", default: "ALL" },
                },
            },
        },
        {
            name: "get_order",
            description: "Get a single eBay order by order ID.",
            inputSchema: {
                type: "object",
                properties: {
                    orderId: { type: "string", description: "eBay order ID" },
                },
                required: ["orderId"],
            },
        },
        {
            name: "bulk_withdraw_offers",
            description: "Withdraw multiple eBay listings by SKU list. Ends all offers for each SKU.",
            inputSchema: {
                type: "object",
                properties: {
                    skus: {
                        type: "array",
                        items: { type: "string" },
                        description: "Array of SKUs to withdraw from eBay",
                    },
                },
                required: ["skus"],
            },
        },
        {
            name: "get_active_listing_count",
            description: "Get the total number of active eBay listings for BL Motorcycles.",
            inputSchema: { type: "object", properties: {} },
        },
    ],
}));
// ── Tool Handlers ───────────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        // ── search_listings (public) ──
        if (name === "search_listings") {
            const { q, limit } = z.object({ q: z.string(), limit: z.number().default(20) }).parse(args);
            const token = await getAppToken();
            const res = await axios.get(`${BASE_URL}/buy/browse/v1/item_summary/search?q=${encodeURIComponent(q)}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } });
            const items = res.data.itemSummaries?.map((i) => ({
                title: i.title, price: i.price?.value, currency: i.price?.currency,
                condition: i.condition, itemId: i.itemId, seller: i.seller?.username,
                image: i.image?.imageUrl, itemWebUrl: i.itemWebUrl,
            })) || [];
            return { content: [{ type: "text", text: JSON.stringify({ total: res.data.total, items }, null, 2) }] };
        }
        // ── get_inventory_items (seller) ──
        if (name === "get_inventory_items") {
            const { limit, offset } = z.object({ limit: z.number().default(25), offset: z.number().default(0) }).parse(args);
            const token = await getUserToken();
            const res = await axios.get(`${BASE_URL}/sell/inventory/v1/inventory_item?limit=${limit}&offset=${offset}`, { headers: sellerHeaders(token) });
            const items = res.data.inventoryItems?.map((i) => ({
                sku: i.sku,
                title: i.product?.title,
                price: i.product?.aspects?.Price?.[0],
                quantity: i.availability?.shipToLocationAvailability?.quantity,
                condition: i.condition,
                brand: i.product?.brand,
                imageUrl: i.product?.imageUrls?.[0],
                description: i.product?.description?.substring(0, 100),
            })) || [];
            return { content: [{ type: "text", text: JSON.stringify({
                            total: res.data.total, size: res.data.size, offset, items,
                            hasMore: offset + limit < (res.data.total || 0),
                        }, null, 2) }] };
        }
        // ── get_inventory_item (seller) ──
        if (name === "get_inventory_item") {
            const { sku } = z.object({ sku: z.string() }).parse(args);
            const token = await getUserToken();
            const res = await axios.get(`${BASE_URL}/sell/inventory/v1/inventory_item/${encodeURIComponent(sku)}`, { headers: sellerHeaders(token) });
            return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
        }
        // ── get_offers (seller) ──
        if (name === "get_offers") {
            const { sku } = z.object({ sku: z.string() }).parse(args);
            const token = await getUserToken();
            const res = await axios.get(`${BASE_URL}/sell/inventory/v1/offer?sku=${encodeURIComponent(sku)}&limit=100`, { headers: sellerHeaders(token) });
            return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
        }
        // ── withdraw_offer (seller) ──
        if (name === "withdraw_offer") {
            const { offerId } = z.object({ offerId: z.string() }).parse(args);
            const token = await getUserToken();
            const res = await axios.post(`${BASE_URL}/sell/inventory/v1/offer/${offerId}/withdraw`, {}, { headers: sellerHeaders(token) });
            return { content: [{ type: "text", text: `Offer ${offerId} withdrawn successfully. Listing ended.` }] };
        }
        // ── delete_inventory_item (seller) ──
        if (name === "delete_inventory_item") {
            const { sku } = z.object({ sku: z.string() }).parse(args);
            const token = await getUserToken();
            await axios.delete(`${BASE_URL}/sell/inventory/v1/inventory_item/${encodeURIComponent(sku)}`, { headers: sellerHeaders(token) });
            return { content: [{ type: "text", text: `Inventory item ${sku} deleted from eBay.` }] };
        }
        // ── update_inventory_item (seller) ──
        if (name === "update_inventory_item") {
            const { sku, price, quantity, title } = z.object({
                sku: z.string(), price: z.number().optional(), quantity: z.number().optional(), title: z.string().optional(),
            }).parse(args);
            const token = await getUserToken();
            // First get existing item
            const existing = await axios.get(`${BASE_URL}/sell/inventory/v1/inventory_item/${encodeURIComponent(sku)}`, { headers: sellerHeaders(token) });
            const item = existing.data;
            // Apply updates
            if (quantity !== undefined) {
                item.availability = item.availability || {};
                item.availability.shipToLocationAvailability = item.availability.shipToLocationAvailability || {};
                item.availability.shipToLocationAvailability.quantity = quantity;
            }
            if (title) {
                item.product = item.product || {};
                item.product.title = title;
            }
            // PUT updated item
            await axios.put(`${BASE_URL}/sell/inventory/v1/inventory_item/${encodeURIComponent(sku)}`, item, { headers: sellerHeaders(token) });
            // Update offer price if provided
            if (price !== undefined) {
                const offersRes = await axios.get(`${BASE_URL}/sell/inventory/v1/offer?sku=${encodeURIComponent(sku)}&limit=10`, { headers: sellerHeaders(token) });
                for (const offer of offersRes.data.offers || []) {
                    offer.pricingSummary = offer.pricingSummary || {};
                    offer.pricingSummary.price = { value: price.toFixed(2), currency: "GBP" };
                    await axios.put(`${BASE_URL}/sell/inventory/v1/offer/${offer.offerId}`, offer, { headers: sellerHeaders(token) });
                }
            }
            return { content: [{ type: "text", text: `Updated ${sku}: ${quantity !== undefined ? `qty=${quantity}` : ""} ${price !== undefined ? `price=£${price}` : ""} ${title ? `title=${title}` : ""}`.trim() }] };
        }
        // ── get_orders (seller) ──
        if (name === "get_orders") {
            const { limit, offset, days_back, status } = z.object({
                limit: z.number().default(50), offset: z.number().default(0),
                days_back: z.number().default(30), status: z.string().default("ALL"),
            }).parse(args);
            const token = await getUserToken();
            const since = new Date(Date.now() - days_back * 86400000).toISOString();
            let url = `${BASE_URL}/sell/fulfillment/v1/order?limit=${limit}&offset=${offset}&filter=creationdate:[${since}..],orderfulfillmentstatus:{NOT_STARTED|IN_PROGRESS|FULFILLED}`;
            const res = await axios.get(url, { headers: sellerHeaders(token) });
            const orders = res.data.orders?.map((o) => ({
                orderId: o.orderId,
                status: o.orderFulfillmentStatus,
                paymentStatus: o.orderPaymentStatus,
                creationDate: o.creationDate,
                buyer: o.buyer?.username,
                total: o.pricingSummary?.total?.value,
                currency: o.pricingSummary?.total?.currency,
                items: o.lineItems?.map((li) => ({
                    sku: li.sku, title: li.title, quantity: li.quantity,
                    price: li.lineItemCost?.value,
                })),
                shippingAddress: o.fulfillmentStartInstructions?.[0]?.shippingStep?.shipTo ? {
                    name: o.fulfillmentStartInstructions[0].shippingStep.shipTo.fullName,
                    city: o.fulfillmentStartInstructions[0].shippingStep.shipTo.contactAddress?.city,
                    postcode: o.fulfillmentStartInstructions[0].shippingStep.shipTo.contactAddress?.postalCode,
                } : null,
            })) || [];
            return { content: [{ type: "text", text: JSON.stringify({
                            total: res.data.total, returned: orders.length, offset, orders,
                        }, null, 2) }] };
        }
        // ── get_order (seller) ──
        if (name === "get_order") {
            const { orderId } = z.object({ orderId: z.string() }).parse(args);
            const token = await getUserToken();
            const res = await axios.get(`${BASE_URL}/sell/fulfillment/v1/order/${orderId}`, { headers: sellerHeaders(token) });
            return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
        }
        // ── bulk_withdraw_offers (seller) ──
        if (name === "bulk_withdraw_offers") {
            const { skus } = z.object({ skus: z.array(z.string()) }).parse(args);
            const token = await getUserToken();
            const results = [];
            for (const sku of skus) {
                try {
                    const offersRes = await axios.get(`${BASE_URL}/sell/inventory/v1/offer?sku=${encodeURIComponent(sku)}&limit=100`, { headers: sellerHeaders(token) });
                    let withdrawn = 0;
                    for (const offer of offersRes.data.offers || []) {
                        try {
                            await axios.post(`${BASE_URL}/sell/inventory/v1/offer/${offer.offerId}/withdraw`, {}, { headers: sellerHeaders(token) });
                            withdrawn++;
                        }
                        catch { /* offer may already be withdrawn */ }
                    }
                    results.push({ sku, status: "ok", offersWithdrawn: withdrawn });
                }
                catch (e) {
                    results.push({ sku, status: e.response?.status === 404 ? "not_found" : "error", offersWithdrawn: 0 });
                }
            }
            const ok = results.filter(r => r.status === "ok").length;
            const totalWithdrawn = results.reduce((s, r) => s + r.offersWithdrawn, 0);
            return { content: [{ type: "text", text: JSON.stringify({
                            summary: `${ok}/${skus.length} SKUs processed, ${totalWithdrawn} offers withdrawn`,
                            results,
                        }, null, 2) }] };
        }
        // ── get_active_listing_count (seller) ──
        if (name === "get_active_listing_count") {
            const token = await getUserToken();
            const res = await axios.get(`${BASE_URL}/sell/inventory/v1/inventory_item?limit=1&offset=0`, { headers: sellerHeaders(token) });
            return { content: [{ type: "text", text: `BL Motorcycles has ${res.data.total || 0} inventory items on eBay.` }] };
        }
        throw new Error(`Tool not found: ${name}`);
    }
    catch (error) {
        const msg = error.response?.data?.errors?.[0]?.message
            || error.response?.data?.error_description
            || error.message;
        const status = error.response?.status;
        return {
            content: [{ type: "text", text: `Error (${status || "?"}): ${msg}` }],
            isError: true,
        };
    }
});
// ── Start ───────────────────────────────────────────────────────────────────
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("eBay BL MCP Server v2.0.0 running — 11 tools available");
}
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
