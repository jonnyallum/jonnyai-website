# GCP VM SSH Connection Guide

> **FOR ALL AIs** — Claude, Gemini, ChatGPT, Grok. Read this before attempting to connect.

## Quick Connect

```bash
# ONE-LINER — copy-paste this exactly:
ssh -i execution/vps_key -o StrictHostKeyChecking=no antigravity-ai@34.105.146.38

# Or use the helper script:
python execution/ssh_to_vps.py status          # Health check
python execution/ssh_to_vps.py "uptime"        # Run any command
python execution/ssh_to_vps.py                 # Interactive shell
```

## Connection Details

| Field | Value |
|:------|:------|
| **IP Address** | `34.105.146.38` |
| **Primary User** | `antigravity-ai` |
| **Alt User** | `info` (GCP OS Login) |
| **SSH Key** | `execution/vps_key` (Ed25519) |
| **Port** | 22 (default) |
| **OS** | Ubuntu 24.04 LTS |
| **Hostname** | `antigravity-orchestra` |

## Full SSH Command (Absolute Path)

```bash
ssh -i "c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution\vps_key" -o StrictHostKeyChecking=no antigravity-ai@34.105.146.38
```

## Running Remote Commands

```bash
# Single command:
ssh -i execution/vps_key -o StrictHostKeyChecking=no antigravity-ai@34.105.146.38 "uptime"

# Multiple commands:
ssh -i execution/vps_key -o StrictHostKeyChecking=no antigravity-ai@34.105.146.38 "hostname && uptime && df -h / && free -h"

# Docker (sudo required for fresh sessions):
ssh -i execution/vps_key -o StrictHostKeyChecking=no antigravity-ai@34.105.146.38 "sudo docker ps -a"
```

## VM Specs

| Component | Value |
|:----------|:------|
| **GCP Project** | `charged-magnet-489103-g9` |
| **Zone** | `europe-west2-c` (London) |
| **Machine** | `n2-standard-4` (4 vCPU, 16GB RAM) |
| **Disk** | 100GB SSD |
| **Pre-installed** | Docker, Nginx, Python3, Git, UFW, Fail2ban |

## Troubleshooting

| Issue | Fix |
|:------|:----|
| `Permission denied (publickey)` | Ensure key path is correct: `execution/vps_key` |
| `Connection timed out` | VM may be stopped. Run `python execution/gcp_vm_setup.py status` |
| `Docker permission denied` | Use `sudo docker` or re-login (docker group was added) |
| Wrong user | Use `antigravity-ai` (primary) or `info` (both work) |

## Important Notes

- The SSH key (`execution/vps_key`) is **NOT in git** — it only exists locally on Jonny's machine
- Both `antigravity-ai` and `info` users have the same SSH key authorized
- Both users have Docker group access (may need re-login for group to take effect)
- Tailscale is installed but currently logged out

---
_Last updated: 2026-03-03 | @Marcus via Claude_
