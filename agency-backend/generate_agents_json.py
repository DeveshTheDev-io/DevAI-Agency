import os
import glob
import json
import re

SOURCE_DIR = r"d:\Devscosmic.AI\DevAI-Agency\tmp_agency_agents"
OUT_FILE = r"d:\Devscosmic.AI\DevAI-Agency\components\data\agents.json"

def parse_frontmatter(content):
    frontmatter = {}
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            fm_text = parts[1]
            for line in fm_text.strip().split('\n'):
                if ':' in line:
                    key, val = line.split(':', 1)
                    frontmatter[key.strip()] = val.strip().strip("'\"")
    return frontmatter

def main():
    agents = []
    
    # Exclude certain folders that are not agent divisions
    exclude_dirs = {'integrations', 'scripts', 'examples', 'strategy'}
    
    for root, dirs, files in os.walk(SOURCE_DIR):
        division = os.path.basename(root)
        if division in exclude_dirs or division.startswith('.'):
            continue
            
        for file in files:
            if file.endswith('.md') and file != 'README.md' and file != 'CONTRIBUTING.md' and file != 'SECURITY.md' and file != 'CONTRIBUTING_zh-CN.md':
                path = os.path.join(root, file)
                
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    
                fm = parse_frontmatter(content)
                name = fm.get('name')
                description = fm.get('description')
                
                if not name:
                    name = file.replace('.md', '').replace('-', ' ').title()
                
                if not description:
                    # try to find first paragraph
                    parts = content.split("---", 2)
                    text_body = parts[2] if len(parts) >= 3 else content
                    lines = [l.strip() for l in text_body.split('\n') if l.strip() and not l.startswith('#')]
                    description = lines[0] if lines else "AI Agent Specialist"
                    
                agents.append({
                    "id": file.replace('.md', ''),
                    "name": name,
                    "description": description[:120] + "..." if len(description) > 120 else description,
                    "division": division
                })

    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(agents, f, indent=2)
        
    print(f"Generated {len(agents)} agents in {OUT_FILE}")

if __name__ == "__main__":
    main()
