"""
BL Motorcycles - Full Build + Deploy Script
Writes progress to log file so it can be monitored externally.
"""
import subprocess, shutil, os, sys, time

LOG = r"c:\Users\jonny\Desktop\BL_BUILD_DEPLOY.log"
PROJ = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\Clients\BL-Motorcycles-Enterprise\website"
DEPLOY = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0\execution\deploy_bl_website.py"

def log(msg):
    ts = time.strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n")

# Clear log
open(LOG, "w").close()

log("=== BL BUILD + DEPLOY STARTED ===")

# Step 1: Delete .next cache
cache = os.path.join(PROJ, ".next")
if os.path.exists(cache):
    shutil.rmtree(cache)
    log("Deleted .next cache")
else:
    log("No .next cache found")

# Step 2: Build
log("Starting next build...")
result = subprocess.run(
    "npx next build",
    cwd=PROJ,
    shell=True,
    capture_output=False,  # Let output flow to console
    text=True
)
log(f"Build exit code: {result.returncode}")

if result.returncode != 0:
    log("BUILD FAILED — stopping.")
    sys.exit(1)

log("Build complete! Starting deploy...")

# Step 3: Deploy
result2 = subprocess.run(
    [sys.executable, DEPLOY],
    capture_output=False,
    text=True
)
log(f"Deploy exit code: {result2.returncode}")

if result2.returncode == 0:
    log("=== SUCCESS! Google login is now live at blmotorcyclesltd.co.uk/admin ===")
else:
    log("Deploy had issues — check output above")
