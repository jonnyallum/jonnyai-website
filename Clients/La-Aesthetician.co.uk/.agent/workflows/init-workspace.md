---
description: How to initialize a new Antigravity workspace with the standard structure and skills.
---

# /init-workspace - Workspace Initialization Workflow

## Purpose
Sets up a pristine Antigravity environment with the complete 21-Agent Ecosystem, MCP configurations, and "Trillion-Dollar Quality" standards.

## Methods

### Option A: Clone from Master Repo (Recommended)
This ensures you get the latest version of all agents and tools.

1. **Clone the Repository**
   // turbo
   ```powershell
   git clone https://github.com/jonnyallum/JonnyAI.co.uk.git .
   ```
   *Note: Run this in your EMPTY target directory.*

2. **Reset Git (Optional)**
   If you want to start a fresh history for a new client/project:
   // turbo
   ```powershell
   Remove-Item -Path .git -Recurse -Force
   git init
   ```

### Option B: Local Copy (Fastest)
Use this if you are on the same machine and want to copy the "Jonny AI" master folder.

1. **Copy Files**
   // turbo
   ```powershell
   Copy-Item -Path "c:\Users\jonny\Desktop\Jonny AI\*" -Destination . -Recurse -Force -Exclude ".git",".tmp",".env"
   ```

## Post-Initialization Steps

3. **Configure Secrets**
   - Create a new `.env` file (copy from `.env.example` if it exists, or ask @Vaultguard to generate one).
   - **CRITICAL:** Do not commit the `.env` file.

4. **Install MCP Tools**
   // turbo
   ```powershell
   npm install -g @modelcontextprotocol/inspector
   ```

5. **Verify Agent Roster**
   - Check `.agent/TEAM_ROSTER.md` to confirm all 21 agents are present.

6. **Run Training Day**
   - Run the `/training-day` workflow to ensure the new swarm is aligned.
