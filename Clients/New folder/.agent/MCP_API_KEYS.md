# MCP Server API Keys Checklist

This file lists all API keys and credentials needed to fully activate the MCP servers in `.agent/mcp-config.json`.

---

## ✅ No Auth Required (Ready to Use)

These servers work immediately with no configuration:

| Server | Purpose |
| :--- | :--- |
| `sequential-thinking` | Multi-step reasoning |
| `memory` | Persistent knowledge graph |
| `fetch` | Web scraping to Markdown |
| `filesystem` | Local file operations |
| `git` | Git repository operations |
| `time` | Timezone conversions |
| `puppeteer` | Browser automation |
| `sqlite` | Local SQLite database |

---

## 🔑 API Keys Required

### Priority 1: High-Value (Get These First)

| Key | Server | Where to Get |
| :--- | :--- | :--- |
| `BRAVE_API_KEY` | brave-search | https://brave.com/search/api/ (Free tier: 2,000 queries/month) |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | github | https://github.com/settings/tokens (Create with `repo` scope) |
| `POSTGRES_CONNECTION_STRING` | postgres | Your Supabase project → Settings → Database → Connection string |

### Priority 2: Productivity & Collaboration

| Key | Server | Where to Get |
| :--- | :--- | :--- |
| `SLACK_BOT_TOKEN` | slack | https://api.slack.com/apps → Create App → OAuth & Permissions |
| `SLACK_TEAM_ID` | slack | Your Slack workspace ID (starts with `T`) |
| `LINEAR_API_KEY` | linear | https://linear.app/settings/api → Personal API keys |
| `SENTRY_AUTH_TOKEN` | sentry | https://sentry.io/settings/account/api/auth-tokens/ |
| `SENTRY_ORG` | sentry | Your Sentry organization slug |

### Priority 3: Google Services (OAuth)

| Key | Server | Where to Get |
| :--- | :--- | :--- |
| `GOOGLE_CLIENT_ID` | google-drive | https://console.cloud.google.com/apis/credentials |
| `GOOGLE_CLIENT_SECRET` | google-drive | Same as above (create OAuth 2.0 Client ID) |
| `GOOGLE_MAPS_API_KEY` | google-maps | https://console.cloud.google.com/apis/credentials |

### Priority 4: AI & Search

| Key | Server | Where to Get |
| :--- | :--- | :--- |
| `EXA_API_KEY` | exa | https://exa.ai/ (Neural search API) |
| `EVERART_API_KEY` | everart | https://www.everart.ai/ (AI image generation) |

### Priority 5: DevOps & Cloud (Optional)

| Key | Server | Where to Get |
| :--- | :--- | :--- |
| `GITLAB_PERSONAL_ACCESS_TOKEN` | gitlab | https://gitlab.com/-/profile/personal_access_tokens |
| `GITLAB_API_URL` | gitlab | `https://gitlab.com/api/v4` (or your self-hosted URL) |
| `AWS_ACCESS_KEY_ID` | aws-kb-retrieval | AWS IAM Console → Security credentials |
| `AWS_SECRET_ACCESS_KEY` | aws-kb-retrieval | Same as above |
| `AWS_REGION` | aws-kb-retrieval | e.g., `us-east-1` |

### Priority 6: Insydetradar Project (Critical)

| Key | Server | Purpose |
| :--- | :--- | :--- |
| `INSYDETRADAR_SUPABASE_URL` | insydetradar-supabase | Project API Endpoint |
| `INSYDETRADAR_SUPABASE_ANON_KEY` | insydetradar-supabase | Public Data Access |
| `INSYDETRADAR_SUPABASE_MCP_URL` | insydetradar-supabase | Remote Management |

---

## 📝 How to Add Keys

1. **Create `.env` file** in the workspace root:

```env
# .agent/.env - MCP Server Credentials

# Search & Research
BRAVE_API_KEY=your_brave_api_key_here

# GitHub
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# Database (Supabase)
POSTGRES_CONNECTION_STRING=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# Slack
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxx
SLACK_TEAM_ID=T0XXXXXXX

# Google (OAuth)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxx
GOOGLE_MAPS_API_KEY=AIzaXXXXXXXXXXXX

# Linear
LINEAR_API_KEY=lin_api_xxxxxxxxxxxx

# Sentry
SENTRY_AUTH_TOKEN=sntrys_xxxxxxxxxxxx
SENTRY_ORG=your-org-slug

# Exa (Neural Search)
EXA_API_KEY=exa-xxxxxxxxxxxx

# EverArt (AI Images)
EVERART_API_KEY=ea_xxxxxxxxxxxx
```

2. **The MCP servers will automatically read from environment variables.**

---

## 🚀 Quick Start Recommendation

For immediate productivity, get these 3 keys first:

1. **`BRAVE_API_KEY`** → Unlocks powerful web search for Scout and research tasks
2. **`GITHUB_PERSONAL_ACCESS_TOKEN`** → Unlocks GitHub integration for Jonny AI
3. **`POSTGRES_CONNECTION_STRING`** → Unlocks Supabase/database access for Datastore

---

## ⚠️ Security Notes

- **Never commit `.env` files to Git** (already in `.gitignore`)
- **Use read-only tokens where possible** (especially for database)
- **Rotate keys every 90 days** (Vaultguard will remind you)
- **Scope tokens minimally** (only the permissions needed)

---

*Last updated: 2026-01-31 | Managed by @Adapter & @Vaultguard*
