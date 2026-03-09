#!/bin/bash
# Antigravity Orchestra — Cron Runner
# Loads .env and runs a Python script from the execution/ directory
# Usage: /home/antigravity-ai/Antigravity_Orchestra/run_cron.sh <script.py> [args...]

set -euo pipefail

REPO_ROOT="/home/antigravity-ai/Antigravity_Orchestra"
cd "$REPO_ROOT"

# Export all env vars from .env (skip comments and blank lines)
set -a
while IFS= read -r line; do
    [[ -z "$line" || "$line" == \#* ]] && continue
    export "$line"
done < "$REPO_ROOT/.env"
set +a

# Add local bin to PATH for pip-installed tools
export PATH="/home/antigravity-ai/.local/bin:$PATH"

# Run the script
SCRIPT="$1"
shift
exec python3 "execution/$SCRIPT" "$@"
