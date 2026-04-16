# VenueFlow 🏟️
**Live venue intelligence. Optimized for your experience.**

A real-time AI-powered venue management dashboard built for Google's PromptWars challenge.
VenueFlow provides two views — one for attendees and one for staff — connected by a live
WebSocket data stream that simulates the full state of a large-scale sporting venue.

🔗 **Live Demo:** https://venueflow-bdknjnccqa-uc.a.run.app

---

## 📸 What It Looks Like

### Attendee Live View
- Color-coded crowd density cards across Sections A–D (green = clear, amber = busy)
- Real-time wait times for Food Stands, Restrooms & Merch Stores
- One-tap Order Concessions button
- Emergency SOS button

### Staff Ops — Command Operations View
- Live Facility Crowd Index (multi-line animated chart)
- Active Anomalies feed with priority levels (Low / Critical)
- Real-time personnel tracking — Security & Medical unit locations
- System status indicator (Nominal / Alert)

---

## 🚀 Features

- **Live WebSocket Streaming** — venue state updates in real time including crowd density,
  wait times, anomaly alerts, and staff positions
- **Dual-View SPA** — Attendee Live and Staff Ops views in a single React app
- **Anomaly Detection Feed** — prioritized alerts (e.g. "Crowd surge at North Gate")
- **Personnel Tracker** — live Security and Medical unit location display
- **Mobile-First Design** — fully responsive, works on any screen size
- **Cloud Run Deployed** — zero-config containerized deployment

---

## 💻 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React, Vite, CSS (mobile-first)   |
| Backend    | Python, FastAPI, WebSockets       |
| Deployment | Google Cloud Run (Buildpacks)     |

---

## 🛠️ Local Development

### Prerequisites
- Node.js & npm
- Python 3.8+

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

The FastAPI backend automatically serves the compiled React frontend
from the `backend/static/` directory.

---

## 🏆 Built For
Google PromptWars — built end-to-end using Antigravity,
Google's agent-first AI IDE. The prompt was engineered manually;
the agent handled planning, coding, and deployment autonomously.