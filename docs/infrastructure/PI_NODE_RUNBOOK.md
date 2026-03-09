# PI_NODE_RUNBOOK.md

**Maintainer:** @Adrian (The Welder)
**Last updated:** 2026-02-27
**Status:** Production — Node 1 (`pi-research-01`) live on `192.168.1.64:8747`

---

## Architecture Overview

Each Raspberry Pi 5 runs `antigravity-edge-node` — a FastMCP 3.0.2 SSE server on a dedicated port. The host machine connects to each node via `.mcp.json` SSE entries. All nodes share the same `server.py` codebase; identity and port are injected entirely through environment variables.

```
Host (Windows) ─── .mcp.json ──► Pi-1 :8747  (pi-research-01)
                              ──► Pi-2 :8748  (pi-research-02)
                              ──► Pi-3 :8749  (pi-compute-01)
                              ──► Pi-4 :8750  (pi-media-01)
                              ──► Pi-5 :8751  (pi-betting-01)
```

---

## 1. Dockerfile — `antigravity-pi-base`

Pre-bakes all Python dependencies on Debian Bookworm for arm64/aarch64. The image is built once and pushed to a private registry (or built locally on each Pi). `server.py` is bind-mounted at runtime so you never rebuild the image when server logic changes.

```dockerfile
# ── antigravity-pi-base ────────────────────────────────────────────────────
# Target: Raspberry Pi 5 (aarch64 / arm64)
# Base:   Python 3.11 on Debian Bookworm Slim (matches host OS: Bookworm 12)
# Build:  docker buildx build --platform linux/arm64 -t antigravity-pi-base .
# ──────────────────────────────────────────────────────────────────────────

FROM python:3.11-slim-bookworm

# ── system deps ─────────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    build-essential \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# ── uv (pinned to match production Node 1) ──────────────────────────────────
ENV UV_VERSION=0.10.6
RUN curl -LsSf "https://astral.sh/uv/${UV_VERSION}/install.sh" | sh
ENV PATH="/root/.local/bin:$PATH"

# ── working directory ────────────────────────────────────────────────────────
WORKDIR /app

# ── copy dependency manifests only (layer cache optimisation) ─────────────────
COPY pyproject.toml uv.lock ./

# ── install all project dependencies into the system Python ──────────────────
RUN uv pip install --system --no-cache \
    "fastmcp>=3.0.2" \
    "psutil>=7.2.2" \
    "beautifulsoup4>=4.14.3" \
    "requests>=2.32.5" \
    "python-dotenv>=1.2.1" \
    "supabase>=2.28.0"

# ── server.py is bind-mounted at runtime — do NOT COPY here ─────────────────
EXPOSE 8747

CMD ["python", "server.py"]
```

**Build commands:**

```bash
# Build natively on the Pi (preferred):
cd ~/antigravity-edge
docker build -t antigravity-pi-base:latest .

# Cross-compile from dev machine:
docker buildx build \
  --platform linux/arm64 \
  -t ghcr.io/antigravity/pi-base:latest \
  --push .
```

---

## 2. `docker-compose.yml`

```yaml
version: "3.9"

services:
  mcp-server:
    image: antigravity-pi-base:latest
    container_name: antigravity-mcp
    restart: unless-stopped

    volumes:
      - ./server.py:/app/server.py:ro
      - ./.env:/app/.env:ro

    env_file:
      - .env

    ports:
      - "${PORT:-8747}:${PORT:-8747}"

    healthcheck:
      test: ["CMD", "curl", "-sf", "http://localhost:${PORT:-8747}/sse"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s

    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "1.5"
        reservations:
          memory: 128M
          cpus: "0.25"
```

**`.env` template:**

```bash
NODE_ID=pi-research-01
NODE_TIER=research
PORT=8747
ANTIGRAVITY_BRAIN_URL=https://lkwydqtfbdjhxaarelaz.supabase.co
ANTIGRAVITY_BRAIN_KEY=
```

---

## 3. Bash Setup Script — `setup_node.sh`

```bash
#!/usr/bin/env bash
# setup_node.sh — Antigravity Edge Node one-shot bootstrap
set -euo pipefail

REPO_URL="https://github.com/YOUR_ORG/antigravity-edge.git"
INSTALL_DIR="$HOME/antigravity-edge"
SERVICE_NAME="antigravity-edge"
UV_VERSION="0.10.6"

echo "==> [1/6] System packages"
sudo apt-get update -qq && sudo apt-get install -y -qq git curl build-essential

echo "==> [2/6] Installing uv $UV_VERSION"
curl -LsSf "https://astral.sh/uv/${UV_VERSION}/install.sh" | sh
export PATH="$HOME/.local/bin:$PATH"

echo "==> [3/6] Cloning repo"
[ -d "$INSTALL_DIR" ] && rm -rf "$INSTALL_DIR"
git clone --depth 1 "$REPO_URL" "$INSTALL_DIR" && cd "$INSTALL_DIR"

echo "==> [4/6] Creating .env"
[ ! -f .env ] && cp .env.example .env
echo "     >> Set NODE_ID, NODE_TIER, PORT, ANTIGRAVITY_BRAIN_KEY in $INSTALL_DIR/.env"

echo "==> [5/6] Installing Python dependencies"
uv sync --frozen

echo "==> [6/6] Installing systemd service"
sudo tee /etc/systemd/system/${SERVICE_NAME}.service > /dev/null <<EOF
[Unit]
Description=Antigravity Edge Node — MCP Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$INSTALL_DIR
Environment=PATH=$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin
EnvironmentFile=$INSTALL_DIR/.env
ExecStart=$HOME/.local/bin/uv run python server.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload && sudo systemctl enable "$SERVICE_NAME" && sudo systemctl start "$SERVICE_NAME"
echo "==> Done. Status: sudo systemctl status $SERVICE_NAME | Logs: journalctl -u $SERVICE_NAME -f"
```

---

## 4. Port Scheme & `.mcp.json` Configuration

### Node-to-Port Map

| Node | `NODE_ID`          | `NODE_TIER` | LAN IP (example) | PORT |
|------|--------------------|-------------|------------------|------|
| 1    | `pi-research-01`   | research    | `192.168.1.64`   | 8747 |
| 2    | `pi-research-02`   | research    | `192.168.1.65`   | 8748 |
| 3    | `pi-compute-01`    | compute     | `192.168.1.66`   | 8749 |
| 4    | `pi-media-01`      | media       | `192.168.1.67`   | 8750 |
| 5    | `pi-betting-01`    | betting     | `192.168.1.68`   | 8751 |

### `.mcp.json` — full 5-node config

```json
{
  "mcpServers": {
    "antigravity-pi": {
      "type": "sse",
      "url": "http://192.168.1.64:8747/sse"
    },
    "antigravity-pi-02": {
      "type": "sse",
      "url": "http://192.168.1.65:8748/sse"
    },
    "antigravity-pi-03": {
      "type": "sse",
      "url": "http://192.168.1.66:8749/sse"
    },
    "antigravity-pi-04": {
      "type": "sse",
      "url": "http://192.168.1.67:8750/sse"
    },
    "antigravity-pi-05": {
      "type": "sse",
      "url": "http://192.168.1.68:8751/sse"
    }
  }
}
```

---

## 5. New Node Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ANTIGRAVITY — NEW NODE CHECKLIST                           @Adrian v1.0    │
├─────────────────────────────────────────────────────────────────────────────┤
│   1.  Flash RPi OS Bookworm 64-bit Lite. Set hostname=NODE_ID, enable SSH,  │
│       set username=jonny, add your SSH public key.                          │
│   2.  Assign static LAN IP via router DHCP. Scheme: 192.168.1.64+(n-1)     │
│   3.  SSH in and run: bash <(curl -sL .../setup_node.sh)                   │
│   4.  Edit ~/antigravity-edge/.env — NODE_ID, NODE_TIER, PORT, KEY         │
│   5.  sudo systemctl start antigravity-edge                                 │
│   6.  Verify: curl http://localhost:PORT/sse                                │
│   7.  Add SSE entry to .mcp.json on host machine                            │
│   8.  Restart Claude Code. Confirm node tools appear.                       │
│   9.  Run get_node_status — confirm NODE_ID, tier, temp, uptime.           │
│  10.  Log to Supabase + chatroom broadcast.                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Appendix A — Systemd Service (Production Reference)

```ini
[Unit]
Description=Antigravity Edge Node — MCP Server
After=network.target

[Service]
Type=simple
User=jonny
WorkingDirectory=/home/jonny/antigravity-edge
Environment=PATH=/home/jonny/.local/bin:/usr/local/bin:/usr/bin:/bin
EnvironmentFile=/home/jonny/antigravity-edge/.env
ExecStart=/home/jonny/.local/bin/uv run python server.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl status antigravity-edge
sudo systemctl restart antigravity-edge
journalctl -u antigravity-edge -f
journalctl -u antigravity-edge --since today
```

---

## Appendix B — Dependency Version Lock

Confirmed on Node 1 (`pi-research-01`), 2026-02-27:

```toml
[project]
name = "antigravity-edge"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "beautifulsoup4>=4.14.3",
    "fastmcp>=3.0.2",
    "psutil>=7.2.2",
    "python-dotenv>=1.2.1",
    "requests>=2.32.5",
    "supabase>=2.28.0",
]
```

- OS: Debian GNU/Linux 12 Bookworm, kernel `6.12.25+rpt-rpi-2712`
- Architecture: `aarch64`
- Python: `3.11.2`
- uv: `0.10.6`
- FastMCP: `3.0.2`

---

## Appendix C — ngrok (Remote Access)

```bash
ngrok config add-authtoken YOUR_TOKEN
bash ~/antigravity-edge/start-ngrok.sh
# Outputs: Public MCP URL: https://xxxx.ngrok-free.app/sse
```

For stable remote access: use ngrok reserved domains (paid) or Tailscale mesh.

---

**Delivery: @Adrian — 2026-02-27**
