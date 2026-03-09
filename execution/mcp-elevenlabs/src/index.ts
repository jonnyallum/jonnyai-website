import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ElevenLabsClient } from "elevenlabs";
import { z } from "zod";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import * as path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error("Missing ELEVENLABS_API_KEY in .env");
  process.exit(1);
}

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

const server = new Server(
  {
    name: "mcp-elevenlabs",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// --- Tools ---

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "text_to_speech",
        description: "Convert text to audio using ElevenLabs.",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Text to convert to speech" },
            voice_id: { type: "string", description: "Voice ID to use (e.g. 'pNInz6obpgDQGcFmaJgB' for Adam)" },
            model_id: { type: "string", default: "eleven_multilingual_v2", description: "Model ID to use" },
            output_format: { type: "string", default: "mp3_44100_128", description: "Output format" },
          },
          required: ["text", "voice_id"],
        },
      },
      {
        name: "list_voices",
        description: "List all available ElevenLabs voices.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_voice_settings",
        description: "Get settings for a specific voice.",
        inputSchema: {
          type: "object",
          properties: {
            voice_id: { type: "string", description: "Voice ID" },
          },
          required: ["voice_id"],
        },
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "text_to_speech") {
      const { text, voice_id, model_id, output_format } = z.object({
        text: z.string(),
        voice_id: z.string(),
        model_id: z.string().default("eleven_multilingual_v2"),
        output_format: z.string().default("mp3_44100_128"),
      }).parse(args);

      // Note: In an MCP context, we might return the metadata or a local file path
      // if the server saves it locally. For now, we'll return a status.
      const response = await client.generate({
        voice: voice_id,
        text: text,
        model_id: model_id,
      });

      // This is a simplified implementation. Real-world usage would stream or save to disk.
      return { 
        content: [{ 
          type: "text", 
          text: `Speech generated for text: "${text.substring(0, 50)}..." using voice ${voice_id}.` 
        }] 
      };
    }

    if (name === "list_voices") {
      const voices = await client.voices.getAll();
      return { 
        content: [{ 
          type: "text", 
          text: JSON.stringify(voices, null, 2) 
        }] 
      };
    }

    if (name === "get_voice_settings") {
      const { voice_id } = z.object({
        voice_id: z.string(),
      }).parse(args);

      const settings = await client.voices.getSettings(voice_id);
      return { 
        content: [{ 
          type: "text", 
          text: JSON.stringify(settings, null, 2) 
        }] 
      };
    }

    throw new Error(`Tool not found: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("mcp-elevenlabs running — Audio Excellence Active");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
