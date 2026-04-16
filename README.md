# SmartVenue (VenueFlow)

**Live Demo**: [https://venueflow-bdknjnccqa-uc.a.run.app](https://venueflow-bdknjnccqa-uc.a.run.app)

SmartVenue is a mobile-first AI dashboard and live monitoring system designed for modern venue management. It provides a real-time, interactive overview of the venue, tracking metrics like crowd density, queue wait times, active alerts, and personnel locations. 

With a dynamic Single Page Application (SPA) architecture, the solution features interactive Map and Queue views, live-simulated filtering, and heatmaps to ensure a responsive and intuitive user experience.

## 🚀 Features
- **Live State Simulation**: Real-time websocket streaming of venue state including crowd density across sections, wait times for amenities, simulated alerts, and staff positioning.
- **Interactive Dashboard**: Modern, responsive React SPA containing multiple views (Map, Queue, Dashboard) designed for mobile-first but fully responsive.
- **High-Performance API**: Python FastAPI backend ensuring low-latency communication via WebSockets and serving static assets.
- **Cloud Run Ready**: Fully configured for containerized deployment on Google Cloud Run.

## 💻 Technology Stack
- **Frontend**: React, Vite, CSS (Mobile-first responsive design)
- **Backend**: Python, FastAPI, WebSockets
- **Deployment**: Google Cloud Run (Buildpacks)

## 🛠️ Local Development

### Prerequisites
- Node.js & npm (for frontend)
- Python 3.8+ (for backend)

### 1. Start the Backend
The backend serves the API, WebSocket server, and static files.

```bash
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn main:app --reload
```
The backend API will be running at `http://localhost:8000`.

### 2. Start the Frontend
In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend should now be running, usually accessible at `http://localhost:5173`. 

## ☁️ Deployment

This project uses Google Cloud Buildpacks for zero-config deployments. The FastAPI backend is set up to automatically serve the frontend's compiled static assets out of the `backend/static/` directory.

To deploy on Cloud Run:
1. Build the Vite frontend: `npm run build`
2. Copy the contents of `frontend/dist` to `backend/static/`
3. Deploy the `backend` folder via gcloud or Google Cloud Console.
