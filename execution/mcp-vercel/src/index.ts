import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || "";
const VERCEL_DEFAULT_PROJECT_ID = process.env.VERCEL_DEFAULT_PROJECT_ID || "";

if (!VERCEL_TOKEN) {
  console.error("[mcp-vercel] VERCEL_TOKEN not set in .env");
  process.exit(1);
}

// ── Vercel API helper ──────────────────────────────────────────────────────────

async function vercelApi(
  path: string,
  options: RequestInit = {},
  extraParams: Record<string, string> = {}
): Promise<any> {
  const url = new URL(`https://api.vercel.com${path}`);

  // Always inject teamId if available (required for team-scoped resources)
  if (VERCEL_TEAM_ID) url.searchParams.set("teamId", VERCEL_TEAM_ID);

  for (const [k, v] of Object.entries(extraParams)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    ...options,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg = data?.error?.message || data?.message || text;
    throw new Error(`Vercel API ${res.status}: ${msg}`);
  }

  return data;
}

// ── Server setup ──────────────────────────────────────────────────────────────

const server = new Server(
  { name: "vercel-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ── Tool definitions ──────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // ── Projects ────────────────────────────────────────────────────────────
    {
      name: "list_projects",
      description: "List all Vercel projects in the account/team.",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Max projects to return (default 20)" },
        },
      },
    },
    {
      name: "get_project",
      description: "Get details for a specific Vercel project by ID or name.",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string", description: "Project ID or name (defaults to VERCEL_DEFAULT_PROJECT_ID)" },
        },
      },
    },

    // ── Deployments ─────────────────────────────────────────────────────────
    {
      name: "list_deployments",
      description: "List recent deployments for a project.",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string", description: "Project ID (optional, uses default)" },
          limit: { type: "number", description: "Number of deployments to return (default 10)" },
          state: {
            type: "string",
            enum: ["BUILDING", "ERROR", "INITIALIZING", "QUEUED", "READY", "CANCELED"],
            description: "Filter by deployment state",
          },
        },
      },
    },
    {
      name: "get_deployment",
      description: "Get full details of a specific deployment by ID or URL.",
      inputSchema: {
        type: "object",
        properties: {
          deploymentId: { type: "string", description: "Deployment ID (starts with dpl_) or URL" },
        },
        required: ["deploymentId"],
      },
    },
    {
      name: "get_deployment_status",
      description: "Get the build/deployment status for a project — returns latest deployment state, URL, and any errors.",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string", description: "Project ID or name (optional, uses default)" },
        },
      },
    },
    {
      name: "redeploy",
      description: "Trigger a redeploy of an existing deployment (useful for applying new env vars without a code push).",
      inputSchema: {
        type: "object",
        properties: {
          deploymentId: { type: "string", description: "Deployment ID to redeploy" },
          target: {
            type: "string",
            enum: ["production", "preview"],
            description: "Deploy target (default: production)",
          },
        },
        required: ["deploymentId"],
      },
    },
    {
      name: "get_build_logs",
      description: "Get build logs for a deployment.",
      inputSchema: {
        type: "object",
        properties: {
          deploymentId: { type: "string", description: "Deployment ID" },
          limit: { type: "number", description: "Max log lines to return (default 100)" },
        },
        required: ["deploymentId"],
      },
    },
    {
      name: "cancel_deployment",
      description: "Cancel a queued or in-progress deployment.",
      inputSchema: {
        type: "object",
        properties: {
          deploymentId: { type: "string", description: "Deployment ID to cancel" },
        },
        required: ["deploymentId"],
      },
    },

    // ── Environment Variables ────────────────────────────────────────────────
    {
      name: "list_env_vars",
      description: "List all environment variables for a Vercel project.",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string", description: "Project ID (optional, uses default)" },
        },
      },
    },
    {
      name: "add_env_var",
      description: "Add or update an environment variable on a Vercel project.",
      inputSchema: {
        type: "object",
        properties: {
          key: { type: "string", description: "Environment variable name" },
          value: { type: "string", description: "Value to set" },
          target: {
            type: "array",
            items: { type: "string", enum: ["production", "preview", "development"] },
            description: "Which environments to apply to (default: production + preview)",
          },
          projectId: { type: "string", description: "Project ID (optional, uses default)" },
          type: {
            type: "string",
            enum: ["plain", "secret", "encrypted", "sensitive"],
            description: "Variable type (default: encrypted)",
          },
        },
        required: ["key", "value"],
      },
    },
    {
      name: "delete_env_var",
      description: "Delete an environment variable from a Vercel project.",
      inputSchema: {
        type: "object",
        properties: {
          envId: { type: "string", description: "Environment variable ID (from list_env_vars)" },
          projectId: { type: "string", description: "Project ID (optional, uses default)" },
        },
        required: ["envId"],
      },
    },

    // ── Domains ─────────────────────────────────────────────────────────────
    {
      name: "list_domains",
      description: "List all custom domains configured on a project.",
      inputSchema: {
        type: "object",
        properties: {
          projectId: { type: "string", description: "Project ID (optional, uses default)" },
        },
      },
    },
    {
      name: "get_domain",
      description: "Get details and DNS configuration for a specific domain.",
      inputSchema: {
        type: "object",
        properties: {
          domain: { type: "string", description: "Domain name, e.g. jonnyai.co.uk" },
        },
        required: ["domain"],
      },
    },
    {
      name: "verify_domain",
      description: "Check domain verification status and get DNS records needed.",
      inputSchema: {
        type: "object",
        properties: {
          domain: { type: "string", description: "Domain name to verify" },
          projectId: { type: "string", description: "Project ID (optional, uses default)" },
        },
        required: ["domain"],
      },
    },
  ],
}));

// ── Tool handlers ─────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // ── list_projects ────────────────────────────────────────────────────────
    if (name === "list_projects") {
      const { limit = 20 } = z.object({ limit: z.number().optional() }).parse(args ?? {});
      const data = await vercelApi(`/v9/projects`, {}, { limit: String(limit) });

      const projects = (data.projects ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        framework: p.framework,
        latestDeployment: p.latestDeployments?.[0]?.url,
        updatedAt: p.updatedAt,
      }));

      return { content: [{ type: "text", text: JSON.stringify(projects, null, 2) }] };
    }

    // ── get_project ──────────────────────────────────────────────────────────
    if (name === "get_project") {
      const { projectId = VERCEL_DEFAULT_PROJECT_ID } = z.object({ projectId: z.string().optional() }).parse(args ?? {});
      const data = await vercelApi(`/v9/projects/${projectId}`);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            id: data.id,
            name: data.name,
            framework: data.framework,
            buildCommand: data.buildCommand,
            outputDirectory: data.outputDirectory,
            installCommand: data.installCommand,
            rootDirectory: data.rootDirectory,
            productionDeployment: data.targets?.production?.url,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          }, null, 2),
        }],
      };
    }

    // ── list_deployments ────────────────────────────────────────────────────
    if (name === "list_deployments") {
      const { projectId = VERCEL_DEFAULT_PROJECT_ID, limit = 10, state } = z.object({
        projectId: z.string().optional(),
        limit: z.number().optional(),
        state: z.string().optional(),
      }).parse(args ?? {});

      const params: Record<string, string> = { limit: String(limit) };
      if (projectId) params.projectId = projectId;
      if (state) params.state = state;

      const data = await vercelApi(`/v6/deployments`, {}, params);

      const deployments = (data.deployments ?? []).map((d: any) => ({
        uid: d.uid,
        url: d.url,
        state: d.state,
        target: d.target,
        createdAt: new Date(d.createdAt).toISOString(),
        buildingAt: d.buildingAt ? new Date(d.buildingAt).toISOString() : null,
        readyAt: d.readyAt ? new Date(d.readyAt).toISOString() : null,
        errorMessage: d.errorMessage,
        meta: d.meta,
      }));

      return { content: [{ type: "text", text: JSON.stringify(deployments, null, 2) }] };
    }

    // ── get_deployment ──────────────────────────────────────────────────────
    if (name === "get_deployment") {
      const { deploymentId } = z.object({ deploymentId: z.string() }).parse(args);
      const data = await vercelApi(`/v13/deployments/${deploymentId}`);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            id: data.id,
            url: data.url,
            state: data.readyState,
            target: data.target,
            meta: data.meta,
            createdAt: data.createdAt,
            buildingAt: data.buildingAt,
            readyAt: data.readyAt,
            errorMessage: data.errorMessage,
            gitSource: data.gitSource,
          }, null, 2),
        }],
      };
    }

    // ── get_deployment_status ───────────────────────────────────────────────
    if (name === "get_deployment_status") {
      const { projectId = VERCEL_DEFAULT_PROJECT_ID } = z.object({ projectId: z.string().optional() }).parse(args ?? {});
      const params: Record<string, string> = { limit: "1" };
      if (projectId) params.projectId = projectId;

      const data = await vercelApi(`/v6/deployments`, {}, params);
      const latest = data.deployments?.[0];

      if (!latest) return { content: [{ type: "text", text: "No deployments found for this project." }] };

      const status = {
        state: latest.state,
        url: `https://${latest.url}`,
        target: latest.target,
        deploymentId: latest.uid,
        createdAt: new Date(latest.createdAt).toISOString(),
        readyAt: latest.readyAt ? new Date(latest.readyAt).toISOString() : "still building",
        errorMessage: latest.errorMessage ?? null,
        commit: latest.meta?.githubCommitMessage ?? latest.meta?.gitlabCommitMessage ?? null,
        branch: latest.meta?.githubCommitRef ?? null,
      };

      return { content: [{ type: "text", text: JSON.stringify(status, null, 2) }] };
    }

    // ── redeploy ────────────────────────────────────────────────────────────
    if (name === "redeploy") {
      const { deploymentId, target = "production" } = z.object({
        deploymentId: z.string(),
        target: z.enum(["production", "preview"]).optional(),
      }).parse(args);

      const data = await vercelApi(`/v13/deployments`, {
        method: "POST",
        body: JSON.stringify({
          deploymentId,
          target,
          name: "redeploy-via-mcp",
        }),
      });

      return {
        content: [{
          type: "text",
          text: `Redeploy triggered.\nNew deployment ID: ${data.id}\nURL: https://${data.url}\nState: ${data.readyState}`,
        }],
      };
    }

    // ── get_build_logs ──────────────────────────────────────────────────────
    if (name === "get_build_logs") {
      const { deploymentId, limit = 100 } = z.object({
        deploymentId: z.string(),
        limit: z.number().optional(),
      }).parse(args);

      const data = await vercelApi(`/v2/deployments/${deploymentId}/events`, {}, { limit: String(limit) });
      const events = Array.isArray(data) ? data : data.events ?? [];

      const logLines = events
        .filter((e: any) => e.type === "stdout" || e.type === "stderr" || e.type === "command")
        .map((e: any) => `[${e.type}] ${e.payload?.text ?? e.text ?? JSON.stringify(e.payload ?? {})}`)
        .join("\n");

      return { content: [{ type: "text", text: logLines || "No log lines found." }] };
    }

    // ── cancel_deployment ───────────────────────────────────────────────────
    if (name === "cancel_deployment") {
      const { deploymentId } = z.object({ deploymentId: z.string() }).parse(args);
      await vercelApi(`/v12/deployments/${deploymentId}/cancel`, { method: "PATCH" });

      return { content: [{ type: "text", text: `Deployment ${deploymentId} cancelled.` }] };
    }

    // ── list_env_vars ────────────────────────────────────────────────────────
    if (name === "list_env_vars") {
      const { projectId = VERCEL_DEFAULT_PROJECT_ID } = z.object({ projectId: z.string().optional() }).parse(args ?? {});
      const data = await vercelApi(`/v9/projects/${projectId}/env`);

      const envs = (data.envs ?? []).map((e: any) => ({
        id: e.id,
        key: e.key,
        target: e.target,
        type: e.type,
        // Values are encrypted — show placeholder
        value: e.type === "plain" ? e.value : "[encrypted]",
        updatedAt: e.updatedAt,
      }));

      return { content: [{ type: "text", text: JSON.stringify(envs, null, 2) }] };
    }

    // ── add_env_var ──────────────────────────────────────────────────────────
    if (name === "add_env_var") {
      const { key, value, target = ["production", "preview"], projectId = VERCEL_DEFAULT_PROJECT_ID, type = "encrypted" } = z.object({
        key: z.string(),
        value: z.string(),
        target: z.array(z.string()).optional(),
        projectId: z.string().optional(),
        type: z.enum(["plain", "secret", "encrypted", "sensitive"]).optional(),
      }).parse(args);

      // Check if var already exists — if so, patch it
      const existing = await vercelApi(`/v9/projects/${projectId}/env`);
      const found = (existing.envs ?? []).find((e: any) => e.key === key);

      if (found) {
        // Update existing
        const updated = await vercelApi(`/v9/projects/${projectId}/env/${found.id}`, {
          method: "PATCH",
          body: JSON.stringify({ value, target, type }),
        });
        return { content: [{ type: "text", text: `Updated env var: ${key} (id: ${updated.id})\nTargets: ${(updated.target ?? []).join(", ")}` }] };
      }

      // Create new
      const created = await vercelApi(`/v10/projects/${projectId}/env`, {
        method: "POST",
        body: JSON.stringify({ key, value, target, type }),
      });

      return { content: [{ type: "text", text: `Created env var: ${key} (id: ${created.id})\nTargets: ${(created.target ?? []).join(", ")}` }] };
    }

    // ── delete_env_var ───────────────────────────────────────────────────────
    if (name === "delete_env_var") {
      const { envId, projectId = VERCEL_DEFAULT_PROJECT_ID } = z.object({
        envId: z.string(),
        projectId: z.string().optional(),
      }).parse(args);

      await vercelApi(`/v9/projects/${projectId}/env/${envId}`, { method: "DELETE" });

      return { content: [{ type: "text", text: `Deleted env var: ${envId}` }] };
    }

    // ── list_domains ─────────────────────────────────────────────────────────
    if (name === "list_domains") {
      const { projectId = VERCEL_DEFAULT_PROJECT_ID } = z.object({ projectId: z.string().optional() }).parse(args ?? {});
      const data = await vercelApi(`/v9/projects/${projectId}/domains`);

      const domains = (data.domains ?? []).map((d: any) => ({
        name: d.name,
        verified: d.verified,
        redirect: d.redirect,
        gitBranch: d.gitBranch,
        createdAt: d.createdAt,
      }));

      return { content: [{ type: "text", text: JSON.stringify(domains, null, 2) }] };
    }

    // ── get_domain ───────────────────────────────────────────────────────────
    if (name === "get_domain") {
      const { domain } = z.object({ domain: z.string() }).parse(args);
      const data = await vercelApi(`/v5/domains/${domain}`);

      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    // ── verify_domain ────────────────────────────────────────────────────────
    if (name === "verify_domain") {
      const { domain, projectId = VERCEL_DEFAULT_PROJECT_ID } = z.object({
        domain: z.string(),
        projectId: z.string().optional(),
      }).parse(args);

      const data = await vercelApi(`/v9/projects/${projectId}/domains/${domain}/verify`, { method: "POST" });

      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }

    throw new Error(`Tool not found: ${name}`);

  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[mcp-vercel] Vercel MCP Server running on stdio");
  console.error(`[mcp-vercel] Team: ${VERCEL_TEAM_ID || "personal"} | Default project: ${VERCEL_DEFAULT_PROJECT_ID || "none"}`);
}

main().catch((error) => {
  console.error("[mcp-vercel] Fatal error:", error);
  process.exit(1);
});
