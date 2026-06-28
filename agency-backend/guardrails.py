import asyncio
from fastapi import Request, HTTPException

# 8GB VRAM Guardrail: Strict concurrency lock for heavy model inference
class VRAMGuardrail:
    def __init__(self, max_concurrent=1):
        self.semaphore = asyncio.Semaphore(max_concurrent)
        
    async def acquire(self):
        await self.semaphore.acquire()
        
    def release(self):
        self.semaphore.release()
        
    async def enforce(self, model_name: str):
        # Models that are too heavy for concurrent execution on 8GB VRAM
        heavy_models = ["deepseek-r1:8b", "qwen2.5-coder:7b", "qwen2.5vl:7b"]
        
        is_heavy = any(heavy in model_name for heavy in heavy_models)
        
        if is_heavy:
            await self.acquire()
            return True
        return False

# Global instance
vram_guardrail = VRAMGuardrail(max_concurrent=1)
