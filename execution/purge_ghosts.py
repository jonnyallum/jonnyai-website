
import os
import shutil
from pathlib import Path

KEEP = {
    "marcus", "sebastian", "diana", "steve", "sam", "derek", "owen", "milo", "adrian",
    "priya", "vivienne", "blaise", "elena", "felix", "grace", "carlos", "maya",
    "scholar", "sophie", "hugo", "patrick", "hannah", "arthur", "alex", "mason", "julian",
    "luna", "victor", "winston", "trotter", "genesis", "vigil", "rowan",
    "gareth", "monty", "redeye", "pietro", "terry", "harry", "daniel", "sterling",
    "quinn", "jasper", "nina", "theo", 
    "coursewright",
    "executor", "riskguard", "qualityguard", "contentforge", "design-manager",
    "chronos", "quartermaster", "watcher", "intelhub", "successbot", "finops",
    "methodology"
}

SKILLS_DIR = Path(r"c:\Users\jonny\Desktop\JonnyAI_JaiOS_5.0\.agent\skills")

def purge():
    print(f"Purging redundant skills in {SKILLS_DIR}...")
    purged_count = 0
    for item in SKILLS_DIR.iterdir():
        if item.is_dir():
            if item.name.lower() not in KEEP:
                print(f"  [X] Purging {item.name}")
                shutil.rmtree(item)
                purged_count += 1
    
    print(f"Done. Purged {purged_count} ghost agents.")

if __name__ == "__main__":
    purge()
