import os

paths = [
    r"C:\Users\jonny\AppData\Roaming\Antigravity",
    r"C:\Users\jonny\.antigravity",
    r"C:\Users\jonny\.config\opencode"
]

for p in paths:
    print(f"Checking {p}...")
    if os.path.exists(p):
        for root, dirs, files in os.walk(p):
            for f in files:
                if f.endswith(".json"):
                    print(f"  Found: {os.path.join(root, f)}")
    else:
        print(f"  Path does not exist")
