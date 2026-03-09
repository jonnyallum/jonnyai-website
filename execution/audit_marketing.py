import sys
import io
import os
from pathlib import Path

# Force UTF-8 for stdout/stderr
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
if sys.stderr.encoding != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

ROOT = Path(r"C:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0")
CLIENTS_DIR = ROOT / "Clients"

def audit_marketing_tags():
    print("📊 INITIATING GLOBAL MARKETING AUDIT...")
    
    clients = [d for d in CLIENTS_DIR.iterdir() if d.is_dir()]
    
    report = []
    
    for client in clients:
        print(f"Checking: {client.name}...")
        results = {"client": client.name, "ga_found": False, "gsc_found": False}
        
        # Search for common tag patterns
        # Next.js usually has them in app/layout.tsx or components/
        valid_extensions = [".tsx", ".html", ".js"]
        
        for root, dirs, files in os.walk(client):
            if "node_modules" in dirs:
                dirs.remove("node_modules")
            if ".next" in dirs:
                dirs.remove(".next")
                
            for file in files:
                if any(file.endswith(ext) for ext in valid_extensions):
                    path = Path(root) / file
                    try:
                        content = open(path, 'r', encoding='utf-8').read()
                        if "googletagmanager.com/gtag/js" in content or "G-" in content:
                            results["ga_found"] = True
                        if 'name="google-site-verification"' in content:
                            results["gsc_found"] = True
                    except:
                        continue
        
        report.append(results)
        
    print("\n--- GLOBAL MARKETING REPORT ---")
    print(f"{'Client':<30} | {'GA4':<10} | {'GSC':<10}")
    print("-" * 55)
    for r in report:
        ga = "✅" if r["ga_found"] else "❌"
        gsc = "✅" if r["gsc_found"] else "❌"
        print(f"{r['client']:<30} | {ga:<10} | {gsc:<10}")
    
    # Save report to .tmp
    tmp_report = ROOT / ".tmp" / "marketing_audit_report.json"
    with open(tmp_report, 'w', encoding='utf-8') as f:
        import json
        json.dump(report, f, indent=2)
        
    print(f"\n📄 Full Report saved to: {tmp_report}")

if __name__ == "__main__":
    audit_marketing_tags()
