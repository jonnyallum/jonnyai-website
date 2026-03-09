import subprocess
import os
import json
import time

env = os.environ.copy()
env["PYTHONWARNINGS"] = "ignore"

print("Starting server...")
proc = subprocess.Popen(
    [r"C:\Users\jonny\Anaconda3\Scripts\notebooklm-mcp.exe"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    env=env,
    bufsize=0
)

init_request = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
        "protocolVersion": "2024-11-05",
        "capabilities": {},
        "clientInfo": {"name": "test-client", "version": "1.0.0"}
    }
}

print("Sending initialize request...")
proc.stdin.write(json.dumps(init_request) + "\n")
proc.stdin.flush()

print("Reading response...")
stdout_lines = []
# Give it some time to respond
time.sleep(2)

# Non-blocking read attempt
import msvcrt
def read_all_stdout(p):
    out = ""
    while True:
        line = p.stdout.readline()
        if not line: break
        out += line
        if "}" in line: break # Assume end of JSON for simple test
    return out

stdout = read_all_stdout(proc)
proc.terminate()
_, stderr = proc.communicate()

print("--- STDOUT ---")
print(repr(stdout))
print("--- STDERR ---")
print(repr(stderr))
