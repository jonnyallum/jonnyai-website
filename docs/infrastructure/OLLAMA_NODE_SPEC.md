# Ollama Node Spec — pi-llm-01 (Node 3)

**Author:** @Theo (The Architect)
**Assigned by:** @Marcus
**Date:** 2026-02-27
**Status:** Ready for implementation

---

## Hardware Summary

| Component | Spec |
|:----------|:-----|
| Board | Raspberry Pi 5 8GB |
| Accelerator | AI HAT+ 2 (Hailo-10H, 26 TOPS, PCIe Gen 3 x4) |
| Storage | 256GB NVMe SSD (via HAT PCIe lane) |
| OS | Raspberry Pi OS (64-bit, Bookworm) |
| Hostname | pi-llm-01 |
| Role | Local LLM inference — routing, validation, decomposition |

---

## What the AI HAT+ 2 Actually Accelerates (Honest Assessment)

The Hailo-10H is a **dedicated neural processing unit** connected via PCIe Gen 3 x4. It is NOT a GPU.

**What it CAN accelerate:**
- Fixed-graph neural network inference compiled to Hailo HEF format
- Models pre-compiled via the Hailo Model Zoo or Hailo Dataflow Compiler
- Vision and classification workloads (object detection, image segmentation)

**What it CANNOT do with Ollama:**
- Ollama uses `llama.cpp` as its backend. As of 2026-02, `llama.cpp` has no Hailo NPU backend.
- Ollama cannot offload transformer layers to the Hailo-10H natively.
- The HAT will NOT be used automatically when you run `ollama run`.

**The practical reality — RPi5 8GB CPU-only Ollama:**
- Tiny models (1.5B Q4): 15–25 tokens/sec
- Small models (3B Q4): 8–14 tokens/sec
- Medium models (7B Q4): 3–6 tokens/sec

**Recommendation:** Treat pi-llm-01 as a CPU inference node with future NPU expansion capability. Select models sized for RPi5 CPU performance.

---

## Section 1 — Full Install Script

Save as `/home/pi/setup-ollama.sh`:

```bash
#!/usr/bin/env bash
# Antigravity Node 3 — Ollama Install & Configure
set -euo pipefail

NVME_MOUNT="/mnt/nvme"
OLLAMA_DATA_DIR="${NVME_MOUNT}/ollama"

echo "==> [1/7] Checking NVMe mount..."
# NVMe PREP (run once):
# sudo fdisk -l  # identify device, likely /dev/nvme0n1
# sudo mkfs.ext4 /dev/nvme0n1
# sudo mkdir -p /mnt/nvme && sudo mount /dev/nvme0n1 /mnt/nvme
# echo '/dev/nvme0n1 /mnt/nvme ext4 defaults,noatime 0 2' | sudo tee -a /etc/fstab
if ! mountpoint -q "${NVME_MOUNT}"; then
    echo "ERROR: NVMe is not mounted at ${NVME_MOUNT}. Prep the drive first."
    exit 1
fi

echo "==> [2/7] Updating system packages..."
sudo apt-get update -qq && sudo apt-get install -y curl wget ca-certificates

echo "==> [3/7] Installing Ollama (arm64)..."
curl -fsSL https://ollama.com/install.sh | sh

echo "==> [4/7] Stopping default service to reconfigure..."
sudo systemctl stop ollama 2>/dev/null || true
sudo systemctl disable ollama 2>/dev/null || true

echo "==> [5/7] Creating Ollama data directory on NVMe..."
sudo mkdir -p "${OLLAMA_DATA_DIR}"
sudo chown -R "$(whoami):$(whoami)" "${OLLAMA_DATA_DIR}"

echo "==> [6/7] Creating systemd override..."
sudo mkdir -p /etc/systemd/system/ollama.service.d
sudo tee /etc/systemd/system/ollama.service.d/override.conf > /dev/null <<'EOF'
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_MODELS=/mnt/nvme/ollama"
Environment="OLLAMA_NUM_CTX=2048"
Environment="OLLAMA_NUM_THREADS=4"
Environment="OLLAMA_KEEP_ALIVE=30m"
Environment="OLLAMA_MAX_LOADED_MODELS=1"
Environment="OLLAMA_FLASH_ATTENTION=1"
EOF

echo "==> [7/7] Starting Ollama..."
sudo systemctl daemon-reload && sudo systemctl enable ollama && sudo systemctl start ollama

echo "API endpoint: http://0.0.0.0:11434"
echo "Model storage: ${OLLAMA_DATA_DIR}"
echo "Test: curl http://localhost:11434/api/tags"
```

**Post-install — pull models:**
```bash
ollama pull qwen2.5:1.5b
ollama pull phi3:mini
ollama pull tinyllama
ollama pull gemma2:2b
```

**Firewall:**
```bash
sudo ufw allow from 192.168.1.0/24 to any port 11434
sudo ufw reload
```

---

## Section 2 — Model Selection

### Tier 1 — Primary (Always Loaded)

**qwen2.5:1.5b (Q4_K_M)** — RAM: ~1.1GB | Speed: 18–25 tok/s
- Use case: @marcus routing decisions, intent classification, escalation gates
- **Verdict: Best overall pick. Default model for all routing tasks.**

**tinyllama (Q4_K_M)** — RAM: ~700MB | Speed: 22–30 tok/s
- Use case: Ultra-fast binary classification, health ping, first-pass filter
- **Verdict: Fastest available. Adequate for yes/no tasks only.**

### Tier 2 — Secondary (Loaded on Demand)

**phi3:mini (Q4_K_M)** — RAM: ~2.3GB | Speed: 8–14 tok/s
- Use case: @delegator task decomposition, @validator pre-checks, structured JSON output
- **Verdict: Best quality-per-RAM in 3-4B range. Exceptional at structured output.**

**gemma2:2b (Q4_K_M)** — RAM: ~1.5GB | Speed: 13–18 tok/s
- Use case: @executor task graph validation, output verification
- **Verdict: Strong middle ground. Use when 1.5B is insufficient but 3.8B too slow.**

### Tier 3 — Avoid in Production

**mistral:7b-instruct-q2_K** — RAM: ~2.7GB | Speed: 4–7 tok/s
- **Verdict: Q2 quantization destroys quality. Phi-3-mini Q4 outperforms this in most tasks.**

### RAM Budget

```
RPi5 8GB Total:         8,192 MB
OS + services:         ~1,500 MB
MCP server:              ~200 MB
Available for Ollama:  ~6,500 MB

Recommended hot config:
  qwen2.5:1.5b Q4_K_M  = 1,100 MB  [always resident]
  phi3:mini    Q4_K_M  = 2,300 MB  [loaded on demand]
  Peak total:            4,900 MB  [safe — 1.6GB headroom]
```

---

## Section 3 — Systemd Service

```ini
[Unit]
Description=Ollama LLM Inference Server
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ollama
Group=ollama
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_MODELS=/mnt/nvme/ollama"
Environment="OLLAMA_NUM_CTX=2048"
Environment="OLLAMA_NUM_THREADS=4"
Environment="OLLAMA_KEEP_ALIVE=30m"
Environment="OLLAMA_MAX_LOADED_MODELS=1"
Environment="OLLAMA_FLASH_ATTENTION=1"
ExecStart=/usr/local/bin/ollama serve
Restart=always
RestartSec=10
MemoryMax=6G
CPUQuota=380%

[Install]
WantedBy=multi-user.target
```

**Monitoring cron:**
```bash
*/5 * * * * curl -sf http://localhost:11434/api/tags > /dev/null || sudo systemctl restart ollama
```

---

## Section 4 — FastMCP Tool Addition (server.py)

Add this block to `/home/pi/antigravity-edge-node/server.py` on pi-llm-01, before the entry point block:

```python
# ── LOCAL LLM INFERENCE (OLLAMA) ───────────────────────────────────────────

OLLAMA_BASE_URL      = os.getenv("OLLAMA_BASE_URL",      "http://localhost:11434")
OLLAMA_DEFAULT_MODEL = os.getenv("OLLAMA_DEFAULT_MODEL", "qwen2.5:1.5b")
OLLAMA_TIMEOUT       = int(os.getenv("OLLAMA_TIMEOUT",   "60"))


@mcp.tool()
def run_local_llm(
    prompt: str,
    model: str = OLLAMA_DEFAULT_MODEL,
    system: str = "",
    temperature: float = 0.1,
    max_tokens: int = 512,
) -> dict:
    """
    Run inference against the local Ollama LLM server on pi-llm-01.
    Use for: routing decisions, task classification, validation pre-checks,
    simple decomposition. Saves Claude API calls for cheap deterministic tasks.
    Models: qwen2.5:1.5b | phi3:mini | gemma2:2b | tinyllama
    """
    import time

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model":    model,
        "messages": messages,
        "stream":   False,
        "options": {
            "temperature": temperature,
            "num_predict": max_tokens,
            "num_ctx":     2048,
        },
    }

    t_start = time.monotonic()
    try:
        resp = requests.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json=payload,
            timeout=OLLAMA_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()

        elapsed_ms    = round((time.monotonic() - t_start) * 1000, 1)
        eval_count    = data.get("eval_count", 0)
        eval_duration = data.get("eval_duration", 1)
        tps = round(eval_count / (eval_duration / 1e9), 1) if eval_duration > 0 else 0

        return {
            "success":           True,
            "response":          data["message"]["content"],
            "model":             data.get("model", model),
            "tokens_generated":  eval_count,
            "tokens_per_second": tps,
            "prompt_tokens":     data.get("prompt_eval_count", 0),
            "total_tokens":      data.get("prompt_eval_count", 0) + eval_count,
            "duration_ms":       elapsed_ms,
            "node":              NODE_ID,
        }

    except requests.exceptions.ConnectionError:
        return {"success": False, "error": "Ollama not running. Start: sudo systemctl start ollama", "node": NODE_ID}
    except requests.exceptions.Timeout:
        return {"success": False, "error": f"Ollama timed out after {OLLAMA_TIMEOUT}s.", "node": NODE_ID}
    except Exception as e:
        return {"success": False, "error": str(e), "node": NODE_ID}


@mcp.tool()
def list_local_models() -> dict:
    """List all models currently available on the local Ollama instance."""
    try:
        resp = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=10)
        resp.raise_for_status()
        data = resp.json()
        models = [
            {
                "name":         m.get("name"),
                "size_gb":      round(m.get("size", 0) / 1e9, 2),
                "modified":     m.get("modified_at", "")[:19],
                "parameters":   m.get("details", {}).get("parameter_size", "unknown"),
                "quantization": m.get("details", {}).get("quantization_level", "unknown"),
            }
            for m in data.get("models", [])
        ]
        return {"success": True, "model_count": len(models), "models": models, "node": NODE_ID}
    except Exception as e:
        return {"success": False, "error": str(e), "node": NODE_ID}
```

**Add to pi-llm-01's `.env`:**
```bash
NODE_ID=pi-llm-01
NODE_TIER=inference
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=qwen2.5:1.5b
OLLAMA_TIMEOUT=60
PORT=8748
```

---

## Section 5 — Routing Logic

See `execution/local_router.py` for the full `route_task()` implementation.

**Decision tree:**
1. If `production_flag=True` → always Claude API
2. If task type in `ALWAYS_CLAUDE` set (code_generation, debugging, architecture, research, legal, financial) → Claude API
3. If task type in `ALWAYS_LOCAL` set (routing, classification, pre-check, binary decision, field extraction) → local Ollama
4. If `token_budget > 800` → Claude API
5. If `requires_context=True` → Claude API
6. If complexity score >= 6/10 → Claude API
7. Otherwise → local Ollama with model selected by complexity

---

## Section 6 — Claude Code Integration

### Via MCP Tool (Recommended)

```json
{
  "mcpServers": {
    "antigravity-pi-llm": {
      "url": "http://pi-llm-01.local:8748/sse",
      "type": "sse"
    }
  }
}
```

Then call from Claude Code:
```
run_local_llm(
    prompt="Which agent handles CSS animation work?",
    system="You are @Marcus. Reply with ONLY one agent handle. No other text.",
    model="qwen2.5:1.5b",
    temperature=0.0,
    max_tokens=15,
)
```

### End-to-End Verification

```bash
curl http://pi-llm-01.local:11434/api/tags
curl http://pi-llm-01.local:11434/api/generate \
  -d '{"model":"qwen2.5:1.5b","prompt":"Which agent handles database schema design? One handle only.","stream":false}' \
  | python -m json.tool
```

---

## Performance Summary

| Model | RAM | Load Time | Tok/s | Best For |
|:------|:----|:----------|:------|:---------|
| tinyllama | 700MB | ~3s | 22–30 | Binary decisions, routing |
| qwen2.5:1.5b | 1.1GB | ~5s | 18–25 | Routing, classification, extraction |
| gemma2:2b | 1.5GB | ~8s | 13–18 | Decomposition, validation |
| phi3:mini | 2.3GB | ~12s | 8–14 | Decomposition, structured output |
| mistral:7b-q2 | 2.7GB | ~20s | 4–7 | Avoid — poor quality/speed ratio |

**The 15 tok/s target is met by qwen2.5:1.5b at 18–25 tok/s.**

## Cost Savings Estimate

- 1,000 routing calls/day at ~500 tokens average = ~$3.90/day at Sonnet pricing
- 60% local offload = ~$2.34/day saved = **~$854/year**
- RPi5 + HAT hardware (~$180) pays back in approximately 2.5 months

---

*@Theo (The Architect) | pi-llm-01 | Jai.OS 5.0 | 2026-02-27*
