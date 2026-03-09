
import os
import re

root = 'c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.tmp/awesome-skills-repo/skills'
catalog_file = 'c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.tmp/awesome-skills-repo/CATALOG.md'
output_file = 'c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/docs/skills_catalog.md'

# Map repository categories to Jai.OS Domain Leads
REPO_TO_JAIO_OWNER = {
    'architecture': 'Sebastian (@Sebastian)',
    'business': 'Felix (@Felix)',
    'data-ai': 'Diana (@Diana)',
    'design-creative': 'Priya (@Priya)',
    'development': 'Sebastian (@Sebastian)',
    'devops-infra': 'Derek (@Derek)',
    'education-learning': 'Arthur (@Arthur)',
    'intelligence-research': 'Sophie (@Sophie)',
    'legal-compliance': 'Luna (@Luna)',
    'operations-support': 'Julian (@Julian)',
    'security': 'Sam (@Sam)',
    'social-growth': 'Felix (@Felix)',
    'testing-qa': 'Quinn Reyes (@Qualityguard)',
    'workflow-productivity': 'Arthur (@Arthur)',
    'infrastructure': 'Derek (@Derek)',
    'workflow': 'Arthur (@Arthur)',
    'testing': 'Quinn Reyes (@Qualityguard)',
    'general': 'Arthur (@Arthur)'
}

# Priority Keywords for High Priority
HIGH_PRIORITY_KEYWORDS = [
    'security', 'audit', 'deployment', 'architect', 'schema', 'performance', 
    'scaling', 'memory', 'agent-orchestration', 'mcp', 'supabase', 'nextjs',
    'validation', 'compliance', 'safety', 'automation', 'workflow-orchestration',
    'infrastructure', 'recovery', 'incident', 'backup', 'scaling', 'bottleneck'
]

def parse_repo_catalog(catalog_path):
    sections = {}
    current_section = None
    
    if not os.path.exists(catalog_path):
        return sections

    with open(catalog_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    section_re = re.compile(r'^## (.*) \((\d+)\)')
    table_row_re = re.compile(r'^\| `(.*?)` \| (.*?) \| (.*?) \| (.*?) \|')

    for line in lines:
        section_match = section_re.match(line)
        if section_match:
            current_section = section_match.group(1).strip()
            sections[current_section] = {}
            continue
        
        row_match = table_row_re.match(line)
        if row_match and current_section:
            skill_handle = row_match.group(1).strip()
            description = row_match.group(2).strip()
            sections[current_section][skill_handle] = description
            
    return sections

def get_priority(handle, description, category):
    comb = f"{handle} {description} {category}".lower()
    for kw in HIGH_PRIORITY_KEYWORDS:
        if kw in comb:
            return "High"
    return "Medium"

def main():
    repo_sections = parse_repo_catalog(catalog_file)
    
    # Flatten repo sections into a handle -> (category, description) map
    handle_info = {}
    for section, skills in repo_sections.items():
        for handle, desc in skills.items():
            handle_info[handle] = (section, desc)

    catalog = []
    if os.path.exists(root):
        for item in sorted(os.listdir(root)):
            path = os.path.join(root, item)
            if os.path.isdir(path):
                # Check for SKILL.md or item.md
                skill_files = ['SKILL.md', f'{item}.md']
                found = False
                for sf in skill_files:
                    if os.path.exists(os.path.join(path, sf)):
                        found = True
                        break
                
                if found:
                    raw_handle = item
                    info = handle_info.get(raw_handle, ("general", "TBD"))
                    category = info[0]
                    description = info[1]
                    
                    priority = get_priority(raw_handle, description, category)
                    owner = REPO_TO_JAIO_OWNER.get(category, "Arthur (@Arthur)")
                    
                    catalog.append({
                        'handle': f'@{raw_handle}',
                        'path': f'skills/{raw_handle}',
                        'category': category,
                        'priority': priority,
                        'owner': owner,
                        'description': description
                    })

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('# Antigravity Awesome Skills Catalog\n\n')
        f.write('**Generated:** 2026-03-09\n')
        f.write('**Source:** `sickn33/antigravity-awesome-skills`\n\n')
        f.write('| Handle | Category | Priority | Owner | Path |\n')
        f.write('| :--- | :--- | :--- | :--- | :--- |\n')
        for c in catalog:
            f.write(f"| {c['handle']} | {c['category']} | {c['priority']} | {c['owner']} | {c['path']} |\n")

    print(f"Enriched catalog generated with {len(catalog)} skills.")

if __name__ == "__main__":
    main()
