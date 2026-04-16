import asyncio
import json
import random
import os
import contextlib
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

import firebase_admin
from firebase_admin import credentials, db
from google.cloud import logging as cloud_logging

load_dotenv()

# Initialize Google Cloud Logging
try:
    client = cloud_logging.Client()
    client.setup_logging()
    import logging
    logger = logging.getLogger("venueflow")
    logger.info("Cloud Logging enabled.")
except Exception as e:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("venueflow")
    logger.warning("Cloud Logging not enabled (likely missing credentials), using standard logging.")

# Initialize Firebase Admin
firebase_db = None
try:
    db_url = os.environ.get("FIREBASE_DATABASE_URL", "https://dummy.firebaseio.com")
    sa_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
    
    if sa_json:
        try:
            cert_dict = json.loads(sa_json)
            cred = credentials.Certificate(cert_dict)
            logger.info("Loaded Firebase credentials from JSON string.")
        except Exception as err:
            logger.error(f"Error parsing FIREBASE_SERVICE_ACCOUNT_JSON: {err}")
            cred = credentials.ApplicationDefault()
    else:
        cred = credentials.ApplicationDefault()
    
    # For dummy use, fallback to unauthenticated/mock behavior if ApplicationDefault fails
    try:
        firebase_admin.initialize_app(cred, {
            'databaseURL': db_url,
            'projectId': 'promptwars-virtual-98379'
        })
        firebase_db = db.reference()
        logger.info("Firebase Admin initialized successfully.")
    except Exception as e:
        logger.warning(f"Could not init Firebase with ADC, mocking. {e}")
        firebase_admin.initialize_app(options={'databaseURL': db_url})
        firebase_db = db.reference()
except Exception as e:
    logger.error(f"Failed to initialize Firebase Admin: {e}")

# Rate Limiter
limiter = Limiter(key_func=get_remote_address)

# Lifespan context for background simulation loop
@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(simulation_loop())
    yield
    task.cancel()

app = FastAPI(title="VenueFlow API", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middlewares
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_ORIGIN", "https://promptwars-virtual-493005.a.run.app")],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseio.com wss://*.firebaseio.com https://*.googleapis.com https://*.gstatic.com data: blob:;"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response

# Static Cache headers middleware
class CacheStaticFiles(StaticFiles):
    def is_not_modified(self, response_headers, request_headers) -> bool:
        response_headers["Cache-Control"] = "public, max-age=31536000"
        return super().is_not_modified(response_headers, request_headers)

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

async def simulation_loop():
    logger.info("Starting simulation background loop...")
    while True:
        state = get_state()
        if firebase_db:
            try:
                # Write to Firebase if available
                state_ref = firebase_db.child('venue_state')
                state_ref.set(state)
                logger.info(f"Pushed state to firebase successfully.")
            except Exception as e:
                # Log any auth errors with dummy config but keep loop alive
                logger.error(f"Could not push to Firebase: {e}")
        else:
             logger.warning("Firebase db not initialized, cannot push.")
        await asyncio.sleep(2)

@app.get("/api/state")
@limiter.limit("60/minute")
async def get_current_state(request: Request):
    return get_state()

# Pydantic Input Validation for SOS
class SOSRequest(BaseModel):
    location: str = Field(..., min_length=2, max_length=100)
    user_id: str = Field(..., pattern=r'^[a-zA-Z0-9_-]+$')

@app.post("/api/sos")
@limiter.limit("5/minute")
async def trigger_sos(request: Request, payload: SOSRequest):
    logger.warning(f"SOS Triggered at {payload.location} by {payload.user_id}")
    # In a real app, this would append to the active anomalies dynamically
    return {"status": "dispatched", "message": "Help is on the way."}

# Serve static files from the "static" directory
if os.path.isdir("static"):
    app.mount("/assets", CacheStaticFiles(directory="static/assets"), name="assets")

    # Catch-all for SPA routing
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = f"static/{full_path}"
        if os.path.isfile(file_path):
            return FileResponse(file_path, headers={"Cache-Control": "public, max-age=31536000"})
        return FileResponse("static/index.html", headers={"Cache-Control": "no-cache"})

