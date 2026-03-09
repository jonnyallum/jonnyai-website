# Antigravity Agent Ecosystem

This folder contains the complete **Agent Orchestra** for the Antigravity workspace. Each subfolder in `skills/` represents a specialized agent with its own `SKILL.md` defining its role, competencies, workflows, and restrictions.

## Quick Reference

| File | Purpose |
| :--- | :--- |
| `AGENT_SITEMAP.md` | Visual hierarchy of all agents by domain. |
| `AGENT_SKILLS_MATRIX.md` | Training Day skills matrix for all agents. |
| `mcp-config.json` | MCP server configuration (sequential-thinking, memory, fetch, etc.). |

## Agent Roster (20 Agents)

| Agent | Role |
| :--- | :--- |
| Conductor | Orchestrator & Team Lead |
| Jonny AI | Full-Stack Development Lead |
| Autoflow | Automation Engineer |
| Pixel | UI/Visual Designer |
| Parser | Data Parsing & Transformation |
| Scout | Research & Scraping |
| Goldie | SEO & Structured Data |
| Clippers | Viral Video Editor |
| Forge | Strategy & Monetization |
| Helpline | Support & Success |
| Archivist | Documentation & Knowledge |
| Sentinel | Security & QA |
| DevOps | Infrastructure & Deployment |
| Metric | Performance & Analytics |
| Echo | Communication & Tone |
| Vaultguard | Secrets & Security |
| Datastore | Database & Storage |
| Manus | MCP Bridgemaster (Discovery & Wiring) |
| Counsel | Legal & Compliance |
| Adapter | MCP Engineer (Server Development) |
| Deploy | CI/CD & Hostinger Deployments |



## Workflows

See `.agent/workflows/` for executable workflows:
- `/training-day` – Audit agents, detect skill gaps, run drills.
- `/component` – Create production-grade React components.
- `/task` – Create mission-specific task boards.

## MCP Servers (via mcp-config.json)

| Server | Purpose |
| :--- | :--- |
| `sequential-thinking` | Multi-step reasoning |
| `memory` | Persistent knowledge graph |
| `fetch` | Clean web scraping |
| `filesystem` | File operations |
| `git` | Git manipulation |
| `time` | Timezone conversions |
| `notebooklm` | Deep research |

---
*Managed by Conductor. Last updated: 2026-01-31.*
