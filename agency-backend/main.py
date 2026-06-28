import os
import httpx
import asyncio
from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from database import db_layer
from github_integration import gh_layer
from google_workspace import google_layer
from obsidian_logger import obsidian_logger, trigger_nomic_indexing

app = FastAPI(title="DevAI-Agency Enterprise Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://devscosmic.ai"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vram_lock = asyncio.Semaphore(1)

OPENCLAW_URL = "http://localhost:18789"

async def _proxy_to_openclaw(request: Request):
    body = await request.body()
    is_heavy = False
    
    if b"deepseek-r1:8b" in body or b"qwen2.5-coder:7b" in body or b"qwen2.5vl:7b" in body:
        is_heavy = True

    if is_heavy:
        async with vram_lock:
            return await _send_proxy(request, body)
    else:
        return await _send_proxy(request, body)

async def _send_proxy(request: Request, body: bytes):
    url = f"{OPENCLAW_URL}{request.url.path}"
    headers = dict(request.headers)
    headers.pop("host", None)
    
    async with httpx.AsyncClient() as client:
        try:
            proxy_req = client.build_request(
                request.method, url, headers=headers, content=body
            )
            response = await client.send(proxy_req)
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Error connecting to OpenClaw: {str(e)}")

@app.post("/api/chat/completions")
async def chat_completions(request: Request):
    return await _proxy_to_openclaw(request)

@app.post("/api/v1/{path:path}")
async def proxy_all(request: Request, path: str):
    return await _proxy_to_openclaw(request)

@app.post("/api/cms/content")
async def create_cms_content(data: dict):
    try:
        return db_layer.create_record("cms_content", data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cms/content")
async def get_cms_content():
    try:
        return db_layer.read_records("cms_content")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/smoke_test")
async def smoke_test(background_tasks: BackgroundTasks):
    obsidian_logger.log_ai_ops("Smoke_Test", "Received smoke test request via backend.")
    trigger_nomic_indexing()
    return {"status": "ok", "message": "Smoke test sequence triggered."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
