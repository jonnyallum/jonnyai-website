# MCP Server Management

## Purpose
Document how to troubleshoot and configure Model Context Protocol (MCP) servers in Antigravity.

## Configuration File Location
**Critical:** Antigravity uses `c:\Users\jonny\.gemini\antigravity\mcp_config.json` for MCP server configuration.

**NOT** `opencode.json` or other config files—those may exist but won't be read by Antigravity's "Manage MCP servers" interface.

## Configuration Format
```json
{
  "mcpServers": {
    "server-name": {
      "command": "path/to/executable",
      "args": [
        "arg1",
        "arg2"
      ]
    }
  }
}
```

## Common Issues & Solutions

### Issue: Installed MCP server doesn't show in "Manage MCP servers"
**Diagnosis:**
1. Check if `mcp_config.json` exists at `c:\Users\jonny\.gemini\antigravity\mcp_config.json`
2. Check if the server is actually configured in that file (not just installed via pip/npm)
3. Verify the configuration syntax is valid JSON

**Solution:**
1. Add the server configuration to `mcp_config.json`
2. Restart Antigravity or reload MCP configuration
3. Verify the command path is correct and executable exists

### Issue: Server configured but not working
**Diagnosis:**
1. Verify the command path points to a real executable
2. Check if Python/Node environment is accessible
3. Look for authentication requirements (e.g., `notebooklm-mcp-auth.exe`)

**Solution:**
1. Test the command manually in terminal
2. Update paths to use absolute paths
3. Run authentication setup if required

## Known MCP Servers

### NotebookLM
- **Installation:** `pip install notebooklm-mcp`
- **Executables:** 
  - `notebooklm-mcp.exe` (main server)
  - `notebooklm-mcp-auth.exe` (authentication)
- **Configuration:**
```json
{
  "mcpServers": {
    "notebooklm": {
      "command": "C:\\Users\\jonny\\Anaconda3\\python.exe",
      "args": [
        "-m",
        "notebooklm_mcp"
      ]
    }
  }
}
```

## Troubleshooting Workflow

1. **Check installation:**
   - Search for executables: `fd notebooklm c:\Users\jonny`
   - Verify pip/npm installation

2. **Check configuration:**
   - Open `c:\Users\jonny\.gemini\antigravity\mcp_config.json`
   - Verify JSON syntax
   - Verify paths are correct

3. **Test manually:**
   - Run the command from terminal to verify it works
   - Check for error messages

4. **Add/Update configuration:**
   - Edit `mcp_config.json` with correct server config
   - Save and restart Antigravity

5. **Verify in UI:**
   - Open "Manage MCP servers"
   - Server should now appear

## Edge Cases

- **Multiple Python installations:** Verify which Python has the package installed
- **Virtual environments:** May need to activate venv or use venv's Python path
- **Windows paths:** Use double backslashes `\\\\` in JSON strings
- **Empty config:** If `mcp_config.json` has `"mcpServers": {}`, servers won't appear

## Update History
- 2026-01-26: Created directive after NotebookLM installation issue
