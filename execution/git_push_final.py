import subprocess
cwd = r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_4.0"
subprocess.run(["git", "add", "execution/"], cwd=cwd, capture_output=True)
r = subprocess.run(["git", "commit", "-m", "fix: vm env aliases and audit improvements"], cwd=cwd, capture_output=True, text=True)
print(r.stdout.strip() or r.stderr.strip()[:100] or "nothing new")
r2 = subprocess.run(["git", "push", "origin", "main"], cwd=cwd, capture_output=True, text=True, timeout=30)
print(r2.stdout.strip() or r2.stderr.strip()[:100] or "pushed ok")
