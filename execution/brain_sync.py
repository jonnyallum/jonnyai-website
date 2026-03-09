
import os
import sys
import json
from pathlib import Path
from datetime import datetime, timedelta
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Configuration
CONNECTION_STRING = os.getenv("ANTIGRAVITY_BRAIN_CONNECTION_STRING")
ROOT_DIR = Path(__file__).parent.parent
MEMORY_DIR = ROOT_DIR / ".agent" / "memory"
LEARNINGS_DIR = MEMORY_DIR / "learnings"
SESSIONS_DIR = MEMORY_DIR / "sessions"

def get_db():
    return psycopg2.connect(CONNECTION_STRING)

def sync_learnings():
    """Push local learnings to Supabase."""
    print("Syncing learnings to Shared Brain...")
    if not LEARNINGS_DIR.exists():
        print("No local learnings found.")
        return

    conn = get_db()
    cur = conn.cursor()

    # ── Detect actual column names in the learnings table ──────────────────────
    try:
        cur.execute("SELECT * FROM learnings LIMIT 1;")
        colnames = [desc[0] for desc in cur.description]
        print(f"  Learnings table columns: {colnames}")
    except Exception as e:
        print(f"  Could not inspect learnings table: {e}")
        conn.rollback()
        cur.close()
        conn.close()
        return

    agent_col   = next((c for c in ["source_agent", "agent_handle", "agent", "agent_id"] if c in colnames), None)
    content_col = next((c for c in ["learning", "content", "text"] if c in colnames), None)
    time_col    = next((c for c in ["created_at", "timestamp", "synced_at"] if c in colnames), None)

    if not agent_col or not content_col:
        print(f"  Cannot map columns — agent_col={agent_col}, content_col={content_col}. Aborting learnings sync.")
        conn.rollback()
        cur.close()
        conn.close()
        return

    print(f"  Using: agent={agent_col}, content={content_col}, time={time_col}")

    for agent_file in LEARNINGS_DIR.glob("*.json"):
        agent_handle = agent_file.stem
        try:
            with open(agent_file, 'r', encoding='utf-8') as f:
                data = json.load(f)

            for entry in data.get("learnings", []):
                ts = entry.get('timestamp', datetime.now().isoformat())
                if time_col:
                    cur.execute(f"""
                        INSERT INTO learnings ({agent_col}, {content_col}, {time_col})
                        VALUES (%s, %s, %s)
                        ON CONFLICT DO NOTHING;
                    """, (agent_handle, entry['learning'], ts))
                else:
                    cur.execute(f"""
                        INSERT INTO learnings ({agent_col}, {content_col})
                        VALUES (%s, %s)
                        ON CONFLICT DO NOTHING;
                    """, (agent_handle, entry['learning']))

        except Exception as e:
            print(f"  Error syncing {agent_handle}: {e}")
            conn.rollback()
            conn = get_db()
            cur = conn.cursor()

    conn.commit()
    cur.close()
    conn.close()
    print("Learning sync complete.")

def sync_heartbeat():
    """Standard heartbeat check and agent activity log for the entire orchestra."""
    print("Checking orchestra heartbeat...")
    
    # Metadata map for all 65 agents from Jai.OS 5.0 roster
    # Format: handle: (human_name, nickname, role, tier)
    agent_meta = {
        # Command Tier
        "marcus": ("Marcus Cole", "The Maestro", "Orchestrator & Team Lead", "Command"),
        "design-manager": ("Automated Logic", "The Overseer", "Design Systems & QA Director", "Command"),
        "delegator": ("Cassian Hart", "Control Room", "Meta-Orchestrator & Mission Planner", "Command"),
        "arthur": ("Arthur Webb", "The Librarian", "Knowledge Base & Documentation", "Operations"),
        
        # Development Tier
        "sebastian": ("Sebastian Cross", "The Architect", "Full-Stack Architect", "Development"),
        "diana": ("Diana Chen", "The Vault", "Database Architect", "Development"),
        "steve": ("Steve Rivers", "The Schema Whisperer", "Supabase Specialist", "Development"),
        "sam": ("Sam Blackwood", "The Gatekeeper", "Security & QA Lead", "Development"),
        "derek": ("Derek O'Brien", "The Engine", "Infrastructure & DevOps", "Development"),
        "owen": ("Owen Stinger", "The Hornet", "CI/CD & Deployment", "Development"),
        "milo": ("Milo Chen", "The Optimizer", "Performance & Mobile QA", "Development"),
        "adrian": ("Adrian Cross", "The Welder", "MCP Server Development", "Development"),
        
        # Design & Creative
        "priya": ("Priya Sharma", "The Perfectionist", "UI/Visual Designer", "Design"),
        "vivienne": ("Vivienne Frost", "The Visionary", "Brand Identity Lead", "Design"),
        "blaise": ("Blaise Moreau", "The Artisan", "Creative Director", "Design"),
        "elena": ("Elena Vasquez", "The Voice", "Copywriter", "Design"),
        
        # Growth & Marketing
        "felix": ("Felix Morgan", "The Alchemist", "Strategy & Monetization", "Growth"),
        "grace": ("Grace Liu", "The Ranker", "SEO & Schema Specialist", "Growth"),
        "carlos": ("Carlos Mendez", "The Hook", "Video Editor", "Growth"),
        "maya": ("Maya Singh", "The Oracle", "Analytics & Conversion", "Growth"),
        "contentforge": ("Aria Voss", "The Story Engine", "Content Factory Director", "Growth"),
        "boyce": ("Boyce Jones", "Gold Rush", "Growth Systems & Monetization", "Growth"),
        "rocket": ("Ricky Hazbin", "Launchpad", "Growth Campaign Execution", "Growth"),
        
        # Intelligence & Research
        "scholar": ("Dr. Elias Thorne", "The Professor", "Deep Research Lead", "Intelligence"),
        "sophie": ("Sophie Reid", "The Hawk", "Web Scraping & OSINT", "Intelligence"),
        "hugo": ("Hugo Reeves", "The Crawler", "GitHub & Repo Intelligence", "Intelligence"),
        "patrick": ("Patrick Nguyen", "The Surgeon", "Data Extraction & Parsing", "Intelligence"),
        "intelhub": ("Autonomous Intel", "The Beacon", "Research Automation", "Intelligence"),
        
        # Operations & Support
        "hannah": ("Hannah Park", "The Fixer", "Customer Success & Triage", "Operations"),
        "alex": ("Alex Torres", "The Machine", "Workflow Automation", "Operations"),
        "mason": ("Mason Drake", "The Bridgemaster", "MCP Integration", "Operations"),
        "julian": ("Julian West", "The Conductor", "Project Management", "Operations"),
        "chronos": ("Automated Time-Lock", "The Watchmaker", "Deadline Specialist", "Operations"),
        "quartermaster": ("Automated Logic", "The Logistics Officer", "Resource Specialist", "Operations"),
        "successbot": ("Automated Delight", "The Ambassador", "Success Automation", "Operations"),
        "finops": ("Automated Ledger", "The Treasurer", "Financial Automation", "Operations"),
        
        # Legal & Compliance
        "luna": ("Luna Sterling", "The Shield", "Legal & Compliance", "Legal"),
        "victor": ("Victor Reyes", "The Locksmith", "Security & Encryption", "Legal"),
        "riskguard": ("Lena Voss", "The Sentinel", "Risk & Compliance Engine", "Legal"),
        
        # Quality & Verification
        "vigil": ("Vigil Chen", "The Eye", "Truth Verification & Agent Audit", "Quality"),
        "rowan": ("Rowan", "The Beast", "Content Depth & Truth-Lock", "Quality"),
        "watcher": ("Automated Vigilance", "The Auditor", "Improvement Scanning", "Quality"),
        "qualityguard": ("Quinn Reyes", "The Validator", "Automated Testing Lead", "Quality"),
        "validator": ("Naomi Kline", "Checksum", "Artifact Quality Verifier", "Quality"),
        
        # Specialized Ecosystems
        "winston": ("Winston Hayes", "Whiz", "E-Commerce & Dropshipping", "Specialized"),
        "trotter": ("Derek Trotter", "The Trader", "Trading Systems", "Specialized"),
        "genesis": ("Genesis Nova", "The Cloner", "Ecosystem Creation", "Specialized"),
        "dreamer": ("Davey Butcha", "The Gravy", "Creative Opportunity Discovery", "Specialized"),
        
        # Betting Ecosystem
        "gareth": ("Gareth Williams", "The Tactician", "Football Tactical Intel", "Betting"),
        "monty": ("Monty Carlo", "The Mathematician", "Roulette Math", "Betting"),
        "redeye": ("Redeye", "The Night Owl", "Betting Coordination", "Betting"),
        "pietro": ("Pietro Rossi", "The Strategist", "Formula 1 Analysis", "Betting"),
        "terry": ("Terry Taylor", "The 180 King", "Darts Analysis", "Betting"),
        "harry": ("Harry Holt", "The Form Master", "Horse Racing Analysis", "Betting"),
        "daniel": ("Dr. Daniel Rossi", "The Doctor", "MotoGP Analysis", "Betting"),
        "sterling": ("Sterling Brooks", "The Bookie", "Sports Betting Systems", "Betting"),
        
        # Management & Automation Tier
        "quinn": ("Quinn Harper", "The Catalyst", "Product Strategy", "Management"),
        "jasper": ("Jasper Cole", "The Closer", "Sales & Biz Dev", "Management"),
        "nina": ("Nina Patel", "The Analyst", "Business Intelligence", "Management"),
        "theo": ("Theo Martinez", "The Architect", "System Architecture", "Management"),
        "executor": ("Rex Carver", "The Closer", "Autonomous Operator", "Automation"),
        "dashboard": ("Mila-Honey", "The Dashboard Architect", "Business Intelligence & Dashboard Architecture", "Management"),

        # Education & Course Design Tier
        "coursewright": ("Nia Sterling", "The Curriculum Architect", "Online Course Design", "Education"),

        # Missing / New Agents
        "syncmaster": ("Silas Vane", "The Pulse", "Memory Propagation Lead", "Operations"),
        "pipeline-guardian": ("Sienna Cross", "The Guardian", "Production Pipeline Monitoring", "Operations"),
        "parser": ("Kieran Vale", "The Decoder", "Data Parsing & Schema Contracts", "Intelligence"),
        "neo": ("Morpheus Anderson", "The Architect of Minds", "Agent Creation Specialist", "Specialized"),
        "nathan": ("Nathan Robinson", "The Automation", "Automation & Email Architect", "Operations"),
        "improver": ("Mike Litswet", "The Auditor", "Continuous Improvement & Auditor", "Management"),
    }

    
    try:
        conn = get_db()
        cur = conn.cursor()
        
        # Mark all agents as active with latest sync
        for handle, (name, nickname, role, tier) in agent_meta.items():
            cur.execute("""
                INSERT INTO agents (id, human_name, nickname, role, tier, status, last_active)
                VALUES (%s, %s, %s, %s, %s, 'active', NOW())
                ON CONFLICT (id) DO UPDATE 
                SET status = 'active', last_active = NOW(), human_name = EXCLUDED.human_name, 
                    nickname = EXCLUDED.nickname, role = EXCLUDED.role, tier = EXCLUDED.tier;
            """, (handle, name, nickname, role, tier))
        
        conn.commit()
        cur.close()
        conn.close()
        print(f"Heartbeat sync successful for {len(agent_meta)} agents.")
    except Exception as e:
        print(f"Heartbeat sync error: {e}")

def pull_learnings():
    """Pull global learnings from Supabase to local memory."""
    print("Pulling global learnings from Shared Brain...")
    try:
        conn = get_db()
        cur = conn.cursor()
        
        # Get all learnings from the last 7 days
        print(f"Executing query on table 'learnings'...")
        cur.execute("""
            SELECT * FROM learnings LIMIT 1;
        """)
        colnames = [desc[0] for desc in cur.description]
        print(f"Detected columns: {colnames}")
        
        target_col = "source_agent" if "source_agent" in colnames else "agent_handle" if "agent_handle" in colnames else "agent"
        content_col = "learning" if "learning" in colnames else "content"
        print(f"Using columns: {target_col}, {content_col}")

        cur.execute(f"""
            SELECT {target_col}, {content_col}, created_at 
            FROM learnings 
            WHERE created_at > NOW() - INTERVAL '7 days'
            ORDER BY created_at DESC;
        """)
        
        rows = cur.fetchall()
        if not rows:
            print("No new global learnings found.")
            return

        # Group by agent
        agent_data = {}
        for agent_id, content, created_at in rows:
            if agent_id not in agent_data:
                agent_data[agent_id] = []
            agent_data[agent_id].append({
                "learning": content,
                "timestamp": created_at.isoformat() if hasattr(created_at, 'isoformat') else str(created_at),
                "source": "shared_brain"
            })

        # Save to local memory
        LEARNINGS_DIR.mkdir(parents=True, exist_ok=True)
        for agent_id, learnings in agent_data.items():
            agent_file = LEARNINGS_DIR / f"{agent_id}.json"
            
            # Load existing or create new
            if agent_file.exists():
                with open(agent_file, 'r', encoding='utf-8') as f:
                    local_data = json.load(f)
            else:
                local_data = {"agent": agent_id, "learnings": [], "tasks": [], "patterns": {}}

            # Merge learnings (avoiding exact duplicates)
            existing_contents = [l["learning"] for l in local_data.get("learnings", [])]
            new_added = 0
            for l in learnings:
                if l["learning"] not in existing_contents:
                    local_data["learnings"].append(l)
                    new_added += 1
            
            if new_added > 0:
                with open(agent_file, 'w', encoding='utf-8') as f:
                    json.dump(local_data, f, indent=2)
                print(f"Propagated {new_added} learnings to @{agent_id}")

        cur.close()
        conn.close()
        print("Pull sync complete.")
    except Exception as e:
        print(f"Pull sync error: {e}")

if __name__ == "__main__":
    if "--pull" in sys.argv:
        pull_learnings()
    else:
        sync_heartbeat()
        sync_learnings()
