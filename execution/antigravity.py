import sys
import subprocess
import os
import io
from pathlib import Path

# Force UTF-8 for stdout/stderr to support emojis/unicode in various terminals
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
if sys.stderr.encoding != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

ROOT = Path(r"C:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0")
EXEC_DIR = ROOT / "execution"

COMMANDS = {
    "sync": {
        "script": "sync_all_skills_full.py",
        "desc": "Synchronize all local agent SKILL.md files to the Shared Brain."
    },
    "validate": {
        "script": "validate_agents.py",
        "desc": "Run the Jai.OS 5.0 validation suite on all agent profiles."
    },
    "apply": {
        "script": "apply_directives.py",
        "desc": "Inject official Governing Directives into all local SKILL.md files."
    },
    "deploy": {
        "script": "deploy_v4.py",
        "desc": "Deploy code using the Jai.OS 5.0 high-velocity pipeline."
    },
    "ralph": {
        "script": "ralph_loop.py",
        "desc": "Execute an autonomous iterative loop for a specific task."
    },
    "status": {
        "script": "orchestra_status.py",
        "desc": "Get a real-time status report of the agent orchestra health."
    },
    "audit": {
        "script": "diff_audit.py",
        "desc": "Score a file edit for quality, placeholders, and standard compliance."
    },
    "onboard": {
        "script": "onboard_project.py",
        "desc": "Scaffold a new client project with directories, tasklists, and context."
    },
    "fact": {
        "script": "verify_fact.py",
        "desc": "Lock or list verified agency facts in the Truth-Lock DB."
    },
    "context": {
        "script": "inject_context.py",
        "desc": "Manage project-specific metadata for agent session hydration."
    },
    "variate": {
        "script": "variance_engine.py",
        "desc": "Trigger the Automated Variance Engine for component A/B testing."
    },
    "proof": {
        "script": "social_proof.py",
        "desc": "Aggregate recent project wins and generate social proof components."
    },
    "scholar": {
        "script": "academic_audit.py",
        "desc": "Audit a file for deprecated framework patterns and academic synthesis."
    },
    "figma": {
        "script": "figma_export.py",
        "desc": "Export design variables and tokens directly from a Figma file ID."
    },
    "research": {
        "script": "research_engine.py",
        "desc": "Execute a deep intelligence research cycle on a specific topic."
    },
    "monetize": {
        "script": "monetize_pipeline.py",
        "desc": "Run a full monetization sprint: Research -> Ideate -> Log -> Sign-off."
    },
    "market-audit": {
        "script": "audit_marketing.py",
        "desc": "Audit all client projects for GA4 and Google Search Console tags."
    }
}

def print_help():
    print("\nANTIGRAVITY UNIFIED CLI (Jai.OS 5.0)\n")
    print("Available Commands:")
    for cmd, info in COMMANDS.items():
        print(f"  {cmd:10} - {info['desc']}")
    print("\nUsage: python execution/antigravity.py [command] [--args]\n")

def run_command(cmd_name, args):
    if cmd_name not in COMMANDS:
        print(f"Unknown command: {cmd_name}")
        print_help()
        return

    info = COMMANDS[cmd_name]
    script_path = EXEC_DIR / info["script"]
    
    if not script_path.exists():
        print(f"Script not found: {script_path}")
        return

    print(f"Executing {cmd_name.upper()}...")
    
    # Construct subprocess command
    cmd = [sys.executable, str(script_path)] + args
    
    try:
        # Stream the output
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True,
            encoding='utf-8'
        )
        
        for line in process.stdout:
            print(line, end='')
            
        process.wait()
        
        if process.returncode == 0:
            print(f"\n{cmd_name.upper()} completed successfully.")
        else:
            print(f"\n{cmd_name.upper()} failed with exit code {process.returncode}")
            
    except Exception as e:
        print(f"Error executing command: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print_help()
        sys.exit(1)
        
    cmd_name = sys.argv[1]
    args = sys.argv[2:]
    run_command(cmd_name, args)
