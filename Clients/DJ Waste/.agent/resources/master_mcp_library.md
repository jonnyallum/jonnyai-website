# Antigravity Master MCP Library (Stolen Patterns)

This is the curated list of Model Context Protocol (MCP) servers and tools, "stolen" from the Anthropic GitHub and community repos. 

## 🏗️ Core & System
*Essential servers for any high-performance workspace.*

### 🛠️ Filesystem
- **Source**: Official Anthropic Reference
- **Add**: `claude mcp add filesystem npx @modelcontextprotocol/server-filesystem [PATH]`
- **Capabilities**: Secure file operations with path-level permissions.

### 🌿 Git
- **Source**: Official Anthropic Reference
- **Add**: `claude mcp add git npx @modelcontextprotocol/server-git`
- **Capabilities**: Automated commits, branch management, and repository mapping.

### 🧠 Sequential Thinking
- **Source**: Official Anthropic Reference
- **Add**: `claude mcp add sequential-thinking npx @modelcontextprotocol/server-sequential-thinking`
- **Capabilities**: Enables agents to perform deep, multi-step reasoning before taking action.

---

## 🔍 Search & Data
*Power tools for Kenneth and Sloane.*

### 🦁 Brave Search
- **Source**: `modelcontextprotocol/servers/src/brave-search`
- **Add**: `claude mcp add brave-search npx @modelcontextprotocol/server-brave-search --api-key [YOUR_API_KEY]`
- **Capabilities**: Real-time web search and content fetching.

### 🕷️ Firecrawl (Web Scraping)
- **Source**: Community (Mendable)
- **Add**: `claude mcp add firecrawl npx @mendable/firecrawl-mcp`
- **Capabilities**: Crawl websites and return clean, AI-ready markdown.

### 📊 PostgreSQL
- **Source**: Official Anthropic Reference
- **Add**: `claude mcp add postgres npx @modelcontextprotocol/server-postgres "postgresql://user:pass@localhost:5432/db"`
- **Capabilities**: Direct agent interaction with production data.

---

## 🏗️ Development & Automation
*The heavy machinery for Mick and Tyler.*

### 🎭 Puppeteer / Playwright
- **Source**: Official / Community
- **Add**: `claude mcp add puppeteer npx @modelcontextprotocol/server-puppeteer`
- **Capabilities**: Browser automation, UI testing, and screenshots.

### 📦 GitHub
- **Source**: Official Anthropic Reference
- **Add**: `claude mcp add github npx @modelcontextprotocol/server-github`
- **Capabilities**: Issue management, PR reviews, and repo-wide search.

### 🚀 Octopus Deploy / GitHub Actions
- **Source**: Community
- **Capabilities**: Direct triggering and monitoring of CI/CD pipelines.

---

## 🤝 Communication & Workflow
*Syncing the orchestra.*

### 💬 Slack
- **Source**: Official Anthropic Reference
- **Add**: `claude mcp add slack npx @modelcontextprotocol/server-slack`
- **Capabilities**: Sending notifications, reading channels, and managing Standups.

### 📅 Google Calendar / Tasks
- **Source**: Community / Google
- **Capabilities**: Scheduling "Team Talks" and "Ten at 10s" directly from the agent.

---

## 📜 Best Patterns (Mick's Forge)
- **Tool Naming**: Use `domain_action` (e.g. `github_create_issue`).
- **Error Handling**: Return errors as JSON if possible, with clear "Suggested Next Steps" for the agent.
- **Pagination**: Agents perform best when data is returned in chunks of 50-100 items.
