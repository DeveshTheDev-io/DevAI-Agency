import os
import time
import httpx
import asyncio
from datetime import datetime

OBSIDIAN_VAULT = r"d:\DEVSCOSMIC"
OPENCLAW_URL = "http://127.0.0.1:18789"
EMBED_MODEL = "openai-compatible/nomic-embed-text:latest"

async def generate_embedding(text: str):
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{OPENCLAW_URL}/v1/embeddings",
                json={
                    "model": EMBED_MODEL,
                    "input": text
                },
                timeout=30.0
            )
            return resp.json()
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return None

async def index_vault():
    print(f"[{datetime.now().isoformat()}] Starting continuous indexing of {OBSIDIAN_VAULT}")
    indexed_files = set()
    
    while True:
        try:
            for root, dirs, files in os.walk(OBSIDIAN_VAULT):
                for file in files:
                    if file.endswith(".md"):
                        filepath = os.path.join(root, file)
                        mtime = os.path.getmtime(filepath)
                        file_key = f"{filepath}_{mtime}"
                        
                        if file_key not in indexed_files:
                            print(f"Indexing new/modified file: {filepath}")
                            with open(filepath, "r", encoding="utf-8") as f:
                                content = f.read()
                            
                            # Generate embedding
                            res = await generate_embedding(content)
                            if res:
                                # Here we would typically push the embedding to Supabase pgvector or similar
                                print(f"Successfully generated embedding for {file}")
                                indexed_files.add(file_key)
                                
            # Wait before next poll
            await asyncio.sleep(60)
        except Exception as e:
            print(f"Indexer error: {e}")
            await asyncio.sleep(60)

if __name__ == "__main__":
    asyncio.run(index_vault())
