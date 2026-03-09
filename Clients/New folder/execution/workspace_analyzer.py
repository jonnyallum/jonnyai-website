import os
import json
import sys

def analyze_workspace(root_path):
    """
    Analyzes the workspace structure and returns a summary.
    Excludes common noise directories.
    """
    summary = {
        "directories": [],
        "files": [],
        "agent_skills": [],
        "directives": []
    }
    
    exclude_dirs = {'.git', 'node_modules', '.tmp', '__pycache__', '.agent'}
    
    for root, dirs, files in os.walk(root_path):
        # Filter directories to skip excluded ones
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        rel_path = os.path.relpath(root, root_path)
        if rel_path == '.':
            rel_path = ''
            
        if rel_path:
            summary["directories"].append(rel_path)
            
        for f in files:
            summary["files"].append(os.path.join(rel_path, f))

    # Specifically scan agents and directives
    agent_path = os.path.join(root_path, '.agent', 'skills')
    if os.path.exists(agent_path):
        summary["agent_skills"] = os.listdir(agent_path)

    directive_path = os.path.join(root_path, 'directives')
    if os.path.exists(directive_path):
        summary["directives"] = os.listdir(directive_path)

    return summary

if __name__ == "__main__":
    if len(sys.argv) < 2:
        path = "."
    else:
        path = sys.argv[1]
        
    result = analyze_workspace(path)
    print(json.dumps(result, indent=2))
