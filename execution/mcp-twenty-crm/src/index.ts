#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const TWENTY_API_REST = process.env.TWENTY_API_REST || "https://crm.jonnyai.co.uk/rest";
const TWENTY_API_KEY = process.env.TWENTY_API_KEY;

if (!TWENTY_API_KEY) {
    console.error("TWENTY_API_KEY environment variable is required");
    process.exit(1);
}

const headers = {
    "Authorization": `Bearer ${TWENTY_API_KEY}`,
    "Content-Type": "application/json"
};

const server = new Server(
    {
        name: "twenty-crm",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_companies",
                description: "List all companies in Twenty CRM",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "create_company",
                description: "Create a new company in Twenty CRM",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "The name of the company",
                        },
                        domainName: {
                            type: "string",
                            description: "The primary domain name URL (e.g. https://example.com) [optional]"
                        }
                    },
                    required: ["name"],
                },
            },
            {
                name: "add_note_to_company",
                description: "Add a text note to a company in Twenty CRM",
                inputSchema: {
                    type: "object",
                    properties: {
                        companyId: {
                            type: "string",
                            description: "The UUID of the company"
                        },
                        title: {
                            type: "string",
                            description: "The title of the note"
                        },
                        markdownBody: {
                            type: "string",
                            description: "The markdown content of the note"
                        }
                    },
                    required: ["companyId", "title", "markdownBody"],
                },
            }
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "get_companies": {
            try {
                const response = await fetch(`${TWENTY_API_REST}/companies`, { headers });
                const data = await response.json();
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(data, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                return {
                    content: [{ type: "text", text: `Error: ${error.message}` }],
                    isError: true,
                };
            }
        }

        case "create_company": {
            try {
                const { name, domainName } = request.params.arguments as any;
                const body: any = { name };
                if (domainName) {
                    body.domainName = { primaryLinkUrl: domainName };
                }

                const response = await fetch(`${TWENTY_API_REST}/companies`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(body)
                });
                const data = await response.json();
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(data, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                return {
                    content: [{ type: "text", text: `Error: ${error.message}` }],
                    isError: true,
                };
            }
        }

        case "add_note_to_company": {
            try {
                const { companyId, title, markdownBody } = request.params.arguments as any;

                // Using blocknote V2 spec for simple markdown text
                const blocknote_content = [
                    {
                        "type": "paragraph",
                        "children": [
                            {
                                "text": markdownBody
                            }
                        ]
                    }
                ];

                const payload = {
                    title: title,
                    bodyV2: {
                        blocknote: JSON.stringify(blocknote_content)
                    }
                };

                const noteRes = await fetch(`${TWENTY_API_REST}/notes`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify(payload)
                });

                const noteData = await noteRes.json();
                if (!noteData?.data?.createNote?.id) {
                    return {
                        content: [{ type: "text", text: `Failed to create note: ${JSON.stringify(noteData)}` }],
                        isError: true,
                    };
                }

                const noteId = noteData.data.createNote.id;

                const targetRes = await fetch(`${TWENTY_API_REST}/noteTargets`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        noteId: noteId,
                        companyId: companyId
                    })
                });

                const targetData = await targetRes.json();

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({ note: noteData, target: targetData }, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                return {
                    content: [{ type: "text", text: `Error: ${error.message}` }],
                    isError: true,
                };
            }
        }

        default:
            throw new Error("Unknown tool");
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Twenty CRM MCP server running on stdio");
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
