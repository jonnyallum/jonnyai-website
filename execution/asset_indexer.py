import os
import json
import hashlib
from datetime import datetime

def generate_asset_manifest(target_dir, output_file):
    print(f"🔍 TRUTH-LOCK: Indexing assets in {target_dir}...")
    manifest = {
        "generated_at": datetime.now().isoformat(),
        "total_assets": 0,
        "assets": []
    }

    if not os.path.exists(target_dir):
        print(f"❌ Error: Directory {target_dir} does not exist.")
        return

    for root, dirs, files in os.walk(target_dir):
        for file in files:
            file_path = os.path.join(root, file)
            relative_path = os.path.relpath(file_path, target_dir)
            
            # Skip hidden files
            if file.startswith('.'):
                continue

            # Calculate SHA-256 hash
            sha256_hash = hashlib.sha256()
            with open(file_path, "rb") as f:
                for byte_block in iter(lambda: f.read(4096), b""):
                    sha256_hash.update(byte_block)
            
            file_info = {
                "path": relative_path.replace('\\', '/'),
                "size_bytes": os.path.getsize(file_path),
                "hash": sha256_hash.hexdigest(),
                "modified": datetime.fromtimestamp(os.path.getmtime(file_path)).isoformat(),
                "type": file.split('.')[-1] if '.' in file else "unknown"
            }
            
            manifest["assets"].append(file_info)
            manifest["total_assets"] += 1

    with open(output_file, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"✅ TRUTH-LOCK: Manifest generated at {output_file}. Total: {manifest['total_assets']} assets.")

if __name__ == "__main__":
    # Project-specific indexing
    projects = [
        {"dir": "Clients/jonnyai.website/public", "out": "Clients/jonnyai.website/asset-manifest.json"},
        {"dir": ".agent/assets", "out": ".agent/asset-manifest.json"}
    ]

    for p in projects:
        generate_asset_manifest(p["dir"], p["out"])
