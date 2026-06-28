import os
import datetime

OBSIDIAN_VAULT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "DEVSCOSMIC"))
CLIENTS_DIR = os.path.join(OBSIDIAN_VAULT, "01_Clients_and_Projects")
AI_OPS_DIR = os.path.join(OBSIDIAN_VAULT, "04_Local_AI_Ops")

class ObsidianLogger:
    def __init__(self):
        os.makedirs(CLIENTS_DIR, exist_ok=True)
        os.makedirs(AI_OPS_DIR, exist_ok=True)

    def log_client_project(self, title: str, content: str):
        filename = f"{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}_{title.replace(' ', '_')}.md"
        path = os.path.join(CLIENTS_DIR, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return path

    def log_ai_ops(self, title: str, content: str):
        filename = f"{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}_{title.replace(' ', '_')}.md"
        path = os.path.join(AI_OPS_DIR, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return path

obsidian_logger = ObsidianLogger()

def trigger_nomic_indexing():
    """
    Mock function representing the trigger for nomic-embed-text:latest 
    to re-index the DEVSCOSMIC vault.
    """
    return obsidian_logger.log_ai_ops("Indexing_Trigger", "Triggered nomic-embed-text:latest to index the vault.")
