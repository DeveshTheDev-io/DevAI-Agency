import os
import shutil

SOURCE_DIR = r"d:\Devscosmic.AI\DevAI-Agency\tmp_agency_agents"
TARGET_DIR = r"C:\Users\asus\.openclaw\skills\agency-workers"

def sync_agents():
    print(f"Syncing agents from {SOURCE_DIR} to {TARGET_DIR}...")
    os.makedirs(TARGET_DIR, exist_ok=True)
    count = 0

    for root, dirs, files in os.walk(SOURCE_DIR):
        # Skip hidden directories like .git
        if '.git' in root:
            continue
        for file in files:
            if file.endswith(".md") and file != "README.md":
                source_path = os.path.join(root, file)
                
                # Determine a clean name for the skill directory based on the file name
                skill_name = file[:-3].lower().replace(" ", "-").replace("_", "-")
                if not skill_name:
                    continue
                
                skill_dir = os.path.join(TARGET_DIR, skill_name)
                os.makedirs(skill_dir, exist_ok=True)
                
                target_path = os.path.join(skill_dir, "SKILL.md")
                
                # Read original content
                with open(source_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                
                # Create frontmatter
                frontmatter = f"---\nname: {skill_name}\ndescription: Agency worker imported from {file}\n---\n\n"
                
                # Prepend frontmatter if not present
                if not content.startswith("---"):
                    final_content = frontmatter + content
                else:
                    final_content = content
                
                # Write to new destination
                with open(target_path, "w", encoding="utf-8") as f:
                    f.write(final_content)
                count += 1

    print(f"Successfully synced {count} agent skills to {TARGET_DIR}")

if __name__ == "__main__":
    sync_agents()
