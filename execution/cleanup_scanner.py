import os
import sys

def get_directory_size(path):
    total_size = 0
    try:
        with os.scandir(path) as it:
            for entry in it:
                if entry.is_file():
                    total_size += entry.stat().st_size
                elif entry.is_dir():
                    total_size += get_directory_size(entry.path)
    except (PermissionError, OSError):
        pass
    return total_size

def find_node_modules(root_path):
    results = []
    print(f"Scanning {root_path} for node_modules...")
    for root, dirs, files in os.walk(root_path):
        if 'node_modules' in dirs:
            full_path = os.path.join(root, 'node_modules')
            size = get_directory_size(full_path)
            results.append((full_path, size))
            # Don't recurse into own node_modules
            dirs.remove('node_modules')
    return results

if __name__ == "__main__":
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    found = find_node_modules(desktop)
    
    found.sort(key=lambda x: x[1], reverse=True)
    
    total_size = sum(x[1] for x in found)
    
    print("\n--- TOP BLOAT FOLDERS ---")
    for path, size in found[:15]:
        print(f"{size / (1024**2):.2f} MB | {path}")
        
    print(f"\nTOTAL DUPLICATE NODE_MODULES: {len(found)}")
    print(f"TOTAL WASTED SPACE: {total_size / (1024**3):.2f} GB")
