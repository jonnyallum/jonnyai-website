---
description: How to install and configure MCP servers in Antigravity
---

# Installing MCP Servers

This workflow ensures MCP servers are properly installed AND configured so they appear in "Manage MCP servers".

## Important Note
**Just installing via pip/npm is NOT enough.** You must also add the server to the config file.

## Steps

### 1. Install the MCP server package
```bash
# For Python-based servers
pip install <package-name>

# For Node-based servers  
npm install -g <package-name>
```

### 2. Find the executable location
```bash
# Windows - search for the executable
fd <server-name> c:\Users\jonny

# Or check Python site-packages
pip show <package-name>
```

### 3. **CRITICAL: Add to mcp_config.json**
Edit `c:\Users\jonny\.gemini\antigravity\mcp_config.json` and add the server configuration.

**For Python modules:**
```json
{
  "mcpServers": {
    "server-name": {
      "command": "C:\\Users\\jonny\\Anaconda3\\python.exe",
      "args": [
        "-m",
        "module_name"
      ]
    }
  }
}
```

**For executables:**
```json
{
  "mcpServers": {
    "server-name": {
      "command": "C:\\path\\to\\executable.exe",
      "args": []
    }
  }
}
```

### 4. Restart Antigravity
Fully restart Antigravity or reload the MCP configuration.

### 5. Verify in UI
Check "Manage MCP servers" - your server should now appear.

## Common Mistakes to Avoid
- ❌ Installing but not configuring → Server won't appear
- ❌ Editing `opencode.json` instead of `mcp_config.json` → Wrong file
- ❌ Using single backslashes in paths → Invalid JSON
- ❌ Forgetting to restart → Changes won't take effect

## Reference
See `directives/mcp_server_management.md` for detailed troubleshooting.
