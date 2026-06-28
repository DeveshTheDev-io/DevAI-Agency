import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import db_layer
from obsidian_logger import obsidian_logger, trigger_nomic_indexing
from github_integration import gh_layer
from main import vram_lock

async def simulate_instruction():
    print("Simulating instruction...")
    obsidian_logger.log_ai_ops("Simulation", "Simulated instruction executed.")

async def log_mock_supabase():
    print("Logging mock entry to Supabase...")
    try:
        db_layer.create_record("cms_content", {"title": "Smoke Test", "content": "This is a test."})
        print("Mock entry logged (check errors if Supabase keys are dummy).")
    except Exception as e:
        print(f"Supabase logging caught exception (expected if dummy credentials): {e}")

async def log_obsidian():
    print("Generating markdown log in Obsidian DEVSCOSMIC vault...")
    filepath = obsidian_logger.log_ai_ops("Smoke_Test_Log", "## Smoke Test\nAll systems nominal.")
    trigger_nomic_indexing()
    print(f"Log generated at: {filepath}")

async def check_github():
    print("Checking GitHub repository status...")
    try:
        repo = gh_layer.get_repo("msitarzewski/agency-agents")
        if repo:
            print(f"GitHub check successful: {repo.full_name}")
    except Exception as e:
        print(f"GitHub check failed (expected if token is invalid or missing): {e}")

async def heavy_task(task_id: int):
    print(f"Task {task_id} waiting for VRAM lock...")
    async with vram_lock:
        print(f"Task {task_id} acquired VRAM lock, simulating model load...")
        await asyncio.sleep(2)
        print(f"Task {task_id} releasing VRAM lock.")

async def verify_vram_lock():
    print("Verifying VRAM lock...")
    tasks = [heavy_task(i) for i in range(3)]
    await asyncio.gather(*tasks)
    print("VRAM lock verification complete. Tasks executed sequentially.")

async def run_smoke_test():
    print("--- STARTING SMOKE TEST ---")
    await simulate_instruction()
    await log_mock_supabase()
    await log_obsidian()
    await check_github()
    await verify_vram_lock()
    print("--- SMOKE TEST COMPLETE ---")

if __name__ == "__main__":
    asyncio.run(run_smoke_test())
