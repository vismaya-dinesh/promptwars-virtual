import asyncio
import json
import random
import os
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(title="VenueFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated state
def get_state():
    return {
        "crowd_density": {
            "section_a": random.randint(40, 95),
            "section_b": random.randint(30, 80),
            "section_c": random.randint(60, 100),
            "section_d": random.randint(20, 60),
        },
        "wait_times": {
            "food_stand_1": random.randint(5, 25),
            "restroom_north": random.randint(2, 12),
            "merch_store": random.randint(10, 40)
        },
        "alerts": [
            {"id": 1, "severity": "low", "message": "Spill reported in Section B"},
            {"id": 2, "severity": "critical" if random.random() > 0.8 else "medium", "message": "Crowd surge at North Gate"},
        ],
        "personnel": [
            {"id": "p1", "role": "security", "location": "North Gate"},
            {"id": "p2", "role": "medical", "location": "Section A"}
        ]
    }

@app.get("/api/state")
async def get_current_state():
    return get_state()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_text(json.dumps(get_state()))
            await asyncio.sleep(2)
    except Exception as e:
        print(f"WebSocket closed: {e}")

# Serve static files from the "static" directory
if os.path.isdir("static"):
    app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

    # Catch-all for SPA routing
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = f"static/{full_path}"
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse("static/index.html")
