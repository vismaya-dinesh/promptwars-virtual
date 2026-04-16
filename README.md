# VenueFlow 🏟️
**Live venue intelligence. Optimized for your experience.**

A real-time AI-powered venue management dashboard built for Google's PromptWars challenge.
VenueFlow provides two views — one for attendees and one for staff — powered by Firebase 
Realtime Database, Google Maps, and a Python FastAPI backend deployed on Google Cloud Run.

🔗 **Live Demo:** https://venueflow-bdknjnccqa-uc.a.run.app

---

## 📸 Views

### 🗺️ Attendee Live View
- Google Maps heatmap showing live crowd density across venue sections
- Color-coded crowd density cards (green = clear, amber = busy, red = critical)
- Real-time wait times for Food Stands, Restrooms & Merch Stores
- One-tap Order Concessions button
- Emergency SOS button with rate-limited backend endpoint

### 🛡️ Staff Ops — Command Operations View
- Live Facility Crowd Index (animated multi-line chart)
- Active Anomalies feed with priority levels (Low / Critical)
- aria-live alerts — screen readers announce new anomalies instantly
- Real-time personnel tracking — Security & Medical unit locations
- System status indicator (Nominal / Alert)

---

## 🚀 Features

- **Firebase Realtime Database** — single source of truth for all live venue state
- **Google Maps Heatmap** — crowd density visualized on an actual venue map overlay
- **Google Cloud Logging** — all anomaly events and SOS triggers logged to Cloud Logging
- **Live Simulation Loop** — Python backend writes realistic venue state to Firebase every few seconds
- **WCAG 2.1 AA Accessibility** — full keyboard navigation, ARIA labels, skip-to-content, screen reader support
- **80%+ Test Coverage** — Vitest + React Testing Library (frontend), pytest + httpx (backend)
- **Security Hardened** — rate limiting, CORS, CSP headers, Pydantic validation, env-based secrets
- **Optimized Performance** — React.memo, lazy loading, Suspense, debounced inputs, GZip compression
- **Mobile-First Design** — fully responsive on any screen size

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, CSS (mobile-first) |
| Real-time Data | Firebase Realtime Database |
| Maps | Google Maps JavaScript API + HeatmapLayer |
| Backend | Python, FastAPI, firebase-admin |
| Logging | Google Cloud Logging |
| Deployment | Google Cloud Run (Buildpacks) |

---

## 🧪 Testing

### Frontend (Vitest + React Testing Library)
```bash
cd frontend
npm install
npm run test
npm run coverage
```
Covers: `CrowdDensityCard`, `WaitTimePanel`, `AnomalyFeed`, `PersonnelTracker`, `SOSButton`

### Backend (pytest + httpx)
```bash
cd backend
pip install -r requirements.txt --break-system-packages
pytest --cov=main --cov-report=term-missing
```
Covers: `/api/state`, `/api/sos` endpoints, WebSocket fallback

---

## ♿ Accessibility (WCAG 2.1 AA)

- `aria-live="polite"` on crowd density and wait time panels
- `role="alert"` + `aria-live="assertive"` on anomaly feed
- All interactive elements have `aria-label`
- Clickable areas use semantic `<button>` elements
- Full keyboard navigation with visible focus rings
- Skip-to-content link at top of page
- All decorative icons marked `aria-hidden="true"`
- Color contrast ratios meet 4.5:1 minimum

---

## 🔒 Security

- All API keys stored as environment variables (never hardcoded)
- Rate limiting via SlowAPI: `/api/state` → 60 req/min, `/api/sos` → 5 req/min
- CORS restricted to deployment domain
- Content Security Policy headers on all responses
- Pydantic `SOSRequest` model validates all incoming request bodies
- GZip compression on all backend responses
- Firebase Admin initialized via Service Account JSON from environment variable

---

## 🛠️ Local Development

### Prerequisites
- Node.js & npm
- Python 3.8+
- Firebase project with Realtime Database enabled
- Google Maps JavaScript API key (with Maps + Visualization libraries enabled)

### 1. Configure Environment Variables

Create a `.env` file in the `frontend/` directory:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key

Create a `.env` file in the `backend/` directory:
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

See `.env.example` in both directories for full reference.

### 2. Start the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs at `http://localhost:8000`

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

---

## ☁️ Deployment (Google Cloud Run)

```bash
# 1. Build the frontend
cd frontend && npm run build

# 2. Copy build output to backend static folder
cp -r dist/* ../backend/static/

# 3. Deploy via gcloud
cd ../backend
gcloud run deploy
```

Set all environment variables as Cloud Run secrets before deploying.
The FastAPI backend automatically serves the compiled React frontend
from the `backend/static/` directory.

---

## 🏆 Built For
Google PromptWars — built end-to-end using Antigravity,
Google's agent-first AI IDE. The prompt was engineered manually;
the agent handled planning, coding, testing, and deployment autonomously.
